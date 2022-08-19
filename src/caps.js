const socketIo = require("socket.io");

// Our socket server
const io = socketIo(3500);

const allClients = [];

function sendToClients(signal, ...args) {
  for (const client of allClients) {
    client.emit(signal, ...args);
  }
}

function vendorlog(...msg) {
  console.log("FROM VENDOR:", ...msg);
}

function deliverylog(...msg) {
  console.log("FROM DELIVERY:", ...msg);
}

io.on("connection", (client) => {
  allClients.push(client);

  // getting packages from vendor
  client.on("packageReady", (srcPackage) => {
    vendorlog("new package ready");
    sendToClients("packageReady", srcPackage);
  });

  client.on("packagePickup", (srcPackage) => {
    deliverylog("new package picked up, in transit", srcPackage);
  });

  client.on("packageDelivered", (srcPackage) => {
    deliverylog("finished delivery", srcPackage);
    sendToClients("packageDelivered", srcPackage);
  });
});
