const { io } = require("socket.io-client");
const { timestamp, sleep } = require("./helpers");
const chance = require("chance");
const Chance = new chance();
const Driver = require("../driver");
// Create a connection to the server
const socket = io("ws://localhost:3500");

let driversAvailable = [
  new Driver("Phoebe", Chance.hash()),
  new Driver("Tim", Chance.hash()),
  new Driver("Jackson", Chance.hash()),
  new Driver("Alice", Chance.hash()),
  new Driver("Wilson", Chance.hash()),
];

function assignDriver() {
  driversAvailable = Chance.shuffle(driversAvailable);
  const chosen = driversAvailable.pop();
  return chosen;
}

function unAssignDriver(driver) {
  driversAvailable.push(driver);
}

async function onPackageReady(srcPackage) {
  console.log("package ready:", srcPackage);
  await sleep(Chance.integer({ min: 1600, max: 2400 }));
  pickupPackage(srcPackage);
}

async function pickupPackage(srcPackage) {
  srcPackage.pickupDate = timestamp();
  srcPackage.driver = assignDriver();
  console.log(`package picked up by ${srcPackage.driver.name}:`, srcPackage);
  socket.emit("packagePickup", srcPackage);
  await sleep(Chance.integer({ min: 1600, max: 2400 }));
  deliveryComplete(srcPackage);
}

async function deliveryComplete(srcPackage) {
  socket.emit("packageDelivered", srcPackage);
  unAssignDriver(srcPackage.driver);
}

function startDelivery() {
  socket.on("packageReady", onPackageReady);
}

if (process.argv[2] === "start") {
  startDelivery();
}

module.exports = {
  deliveryPackageReady: onPackageReady,
  deliveryPickupPackage: pickupPackage,
  deliveryDeliveryComplete: deliveryComplete,
  deliverySocket: socket,
};
