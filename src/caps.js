const socketIo = require("socket.io");

// Our socket server
const io = socketIo(3500);

const allClients = [];

const deliveryMessages = [];
const readyPackages = [];

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
    readyPackages.push(srcPackage);
    sendToClients("packageReady", readyPackages);
  });
  // requesting packages delivery missed
  client.on("requestReadyPackages", () => {
    sendToClients("readyPackages");
  });
  // delivery now handling a package
  client.on("packagePickup", (srcPackage) => {
    deliverylog("new package picked up, in transit", srcPackage);
    readyPackages.shift();
  });

  client.on("packageDelivered", (srcPackage) => {
    deliverylog("finished delivery", srcPackage);
    deliveryMessages.push(srcPackage);
    sendToClients("packageDelivered", srcPackage);
  });

  //vendor wants all packages that have gone unacknowledged
  client.on("requestDeliveredMessages", () => {
    sendToClients("deliveredMessages", deliveryMessages);
  });

  //vendor reads a package
  client.on("packageDeliveredRecieved", () => {
    //okay, we don't need this one on the backlog since it was delivered
    deliveryMessages.shift();
  });
});
