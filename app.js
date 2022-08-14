const EventEmitter = require("events");
const chance = require("chance");
const Chance = new chance();
const caps = new EventEmitter();
const Driver = require("./driver");

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

function sleep(amt) {
  return new Promise((resolve) => setTimeout(resolve, amt));
}

function randomName() {
  const first = Chance.pickone(["Derek", "Hugo", "Zayah", "Luis"]);
  const last = Chance.pickone([
    "Burgeria",
    "Megamall",
    "Outdoor Swimming Pool",
    "TOP SECRET Documents",
    "Poetry Booklet",
    "Hopes and Dreams",
    "Kitchen Nightmare",
    "Cronenberg Clone",
    "Self Statue",
    "Genius Invention",
    "Garden",
    "Telescope",
    "Apple",
    "Evil Apple",
    "Additional List Item",
    "Atlantis Reboot",
    "Time Travel Device",
  ]);
  return first + "'s " + last;
}

function timestamp() {
  return new Date(Date.now()).toTimeString();
}

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

async function onPackageReady(srcPackage) {
  console.log("package ready:", srcPackage);
  await sleep(Chance.integer({ min: 1600, max: 2400 }));
  caps.emit("packagePickup", srcPackage);
}

async function onPackagePickup(srcPackage) {
  srcPackage.pickupDate = timestamp();
  srcPackage.driver = assignDriver();
  console.log(`package picked up by ${srcPackage.driver.name}:`, srcPackage);
  await sleep(Chance.integer({ min: 1600, max: 2400 }));
  caps.emit("packageDelivered", srcPackage);
}

async function onPackageDelivered(srcPackage) {
  srcPackage.deliveredDate = timestamp();
  console.log("package delivered:", srcPackage);
  unAssignDriver(srcPackage.driver);
}

function openForDeliveries() {
  caps.addListener("packageReady", onPackageReady);
  caps.addListener("packagePickup", onPackagePickup);
  caps.addListener("packageDelivered", onPackageDelivered);
  caps.emit("packageReady", createPackage());
  setInterval(() => {
    caps.emit("packageReady", createPackage());
  }, 8000);
}

module.exports = {
  caps,
  openForDeliveries,
  onPackagePickup,
  onPackageReady,
  onPackageDelivered,
  timestamp,
};
