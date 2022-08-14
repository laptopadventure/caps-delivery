const { caps, onPackageDelivered, onPackageReady, onPackagePickup, timestamp } = require("../app");

const testPackage = {
  id: "1de7185a2b3915c51d8e5af2d1ef664b14b7fcc9",
  body: {
    name: "Hugo's Telescope",
    location: "Washington",
  },
  creationDate: timestamp(),
};

describe("delivery system", () => {
  describe("ready", () => {
    it("emits a signal", async () => {
      const spy = jest.spyOn(caps, "emit");
      await onPackageReady(testPackage);
      expect(spy).toHaveBeenCalled();
    });
    it("console logs", async () => {
      const spy = jest.spyOn(console, "log");
      await onPackageReady(testPackage);
      expect(spy).toHaveBeenCalledWith("package ready:", testPackage);
    });
  });
  describe("pickup", () => {
    it("emits a signal", async () => {
      const spy = jest.spyOn(caps, "emit");
      await onPackagePickup(testPackage);
      expect(spy).toHaveBeenCalled();
    });
    it("console logs", async () => {
      const spy = jest.spyOn(console, "log");
      await onPackagePickup(testPackage);
      expect(spy).toHaveBeenCalledWith(`package picked up by ${testPackage.driver.name}:`, testPackage);
    });
  });
  describe("delivered", () => {
    it("emits a signal", async () => {
      const spy = jest.spyOn(caps, "emit");
      await onPackageDelivered(testPackage);
      expect(spy).toHaveBeenCalled();
    });
    it("console logs", async () => {
      const spy = jest.spyOn(console, "log");
      await onPackageDelivered(testPackage);
      expect(spy).toHaveBeenCalledWith("package delivered:", testPackage);
    });
  });
});
