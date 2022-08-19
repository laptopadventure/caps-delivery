const { vendorPackageDelivered } = require("../src/vendor");
const { timestamp } = require("../src/helpers");

const testPackage = {
  id: "1de7185a2b3915c51d8e5af2d1ef664b14b7fcc9",
  body: {
    name: "Hugo's Telescope",
    location: "Washington",
  },
  creationDate: timestamp(),
};

/*
As a vendor, I want to alert the system when I have a package to be picked up.
As a vendor, I want to be 
*/

describe("vendor system", () => {
  it("logs when my package has been delivered.", () => {
    const spy = jest.spyOn(console, "log");
    vendorPackageDelivered(testPackage);
    expect(spy).toHaveBeenCalledWith("package delivered:", testPackage);
  });
});
