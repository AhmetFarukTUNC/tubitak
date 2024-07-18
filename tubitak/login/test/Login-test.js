const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserRegistry", function () {
  let userRegistry;
  let admin;
  let user1;
  let user2;

  before(async function () {
    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy();
    await userRegistry.deployed();

    [admin, user1, user2] = await ethers.getSigners();
  });

  it("should add users correctly", async function () {
    await userRegistry.connect(admin).addUser("Alice", user1.address, true);
    await userRegistry.connect(admin).addUser("Bob", user2.address, false);

    // Get user information after adding
    const [name1, walletAddress1, isAdmin1] = await userRegistry.getUser(user1.address);
    const [name2, walletAddress2, isAdmin2] = await userRegistry.getUser(user2.address);

    expect(name1).to.equal("Alice");
    expect(isAdmin1).to.equal(true);

    expect(name2).to.equal("Bob");
    expect(isAdmin2).to.equal(false);
  });

  it("should return correct admin status", async function () {
    const isAdminUser1 = await userRegistry.isAdmin(user1.address);
    const isAdminUser2 = await userRegistry.isAdmin(user2.address);

    expect(isAdminUser1).to.equal(true);
    expect(isAdminUser2).to.equal(false);
  });

  it("should prevent adding duplicate users", async function () {
    // Trying to add user1 again should revert with "User already exists"
    await expect(userRegistry.connect(admin).addUser("Alice", user1.address, false))
      .to.be.revertedWith("User already exists");
  });

  it("should allow admin to change admin", async function () {
    await userRegistry.connect(admin).changeAdmin(user1.address);

    const newAdmin = await userRegistry.admin();
    expect(newAdmin).to.equal(user1.address);
  });
});

