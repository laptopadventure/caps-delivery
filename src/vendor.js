const { io } = require("socket.io-client");
const { randomName, timestamp } = require("./helpers");
const chance = require("chance");
const Chance = new chance();

// Create a connection to the server
const socket = io("ws://localhost:3500");

function createPackage() {
  return {
    id: Chance.hash(),
    body: {
      name: randomName(),
      location: Chance.pickone(Chance.states()).name,
    },
    creationDate: timestamp(),
  };
}

function onPackageDelivered(srcPackage) {
  srcPackage.deliveredDate = timestamp();
  console.log("package delivered:", srcPackage);
  //thanks
  socket.emit("packageDeliveredRecieved");
}

function processBacklog(srcPackages) {
  for (const srcPackage of srcPackages) {
    onPackageDelivered(srcPackage);
  }
}

function startVending() {
  // let's see what we missed while we were gone
  socket.on("deliveredMessages", processBacklog);
  socket.emit("requestDeliveredMessages");

  // listen for deliveries completed
  socket.on("packageDelivered", onPackageDelivered);

  // start sending packages periodically
  socket.emit("packageReady", createPackage());
  setInterval(() => {
    socket.emit("packageReady", createPackage());
  }, Chance.integer({ min: 6000, max: 9000 }));
}

if (process.argv[2] === "start") {
  startVending();
}

module.exports = {
  vendorPackageDelivered: onPackageDelivered,
};
