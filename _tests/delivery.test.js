const { deliverySocket, deliveryDeliveryComplete, deliveryPackageReady, deliveryPickupPackage } = require("../src/delivery");
const { timestamp } = require("../src/helpers");

const testPackage = {
  id: "1de7185a2b3915c51d8e5af2d1ef664b14b7fcc9",
  body: {
    name: "Hugo's Telescope",
    location: "Washington",
  },
  creationDate: timestamp(),
};

describe("delivery system", () => {
  it("logs when I have a package to be picked up.", async () => {
    const spy = jest.spyOn(console, "log");
    await deliveryPackageReady(testPackage);
    expect(spy).toHaveBeenCalledWith("package ready:", testPackage);
  });
  it("logs when I have picked up a package and it is in transit.", async () => {
    const spy = jest.spyOn(console, "log");
    await deliveryPickupPackage(testPackage);
    expect(spy).toHaveBeenCalledWith(`package picked up by ${testPackage.driver.name}:`, testPackage);
  });
  it("emits when a package has been delivered.", async () => {
    const spy = jest.spyOn(deliverySocket, "emit");
    await deliveryDeliveryComplete(testPackage);
    expect(spy).toHaveBeenCalledWith("packageDelivered", testPackage);
  });
});
