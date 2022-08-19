const chance = require("chance");
const Chance = new chance();

function sleep(amt) {
  return new Promise((resolve) => setTimeout(resolve, amt));
}

function timestamp() {
  return new Date(Date.now()).toTimeString();
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

module.exports = {
  sleep,
  timestamp,
  randomName,
};
