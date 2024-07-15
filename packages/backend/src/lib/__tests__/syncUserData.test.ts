import { prisma } from "../../prisma";
import { syncUserData } from "../syncUserData";

jest.mock("@farther/common", () => ({
  neynarLimiter: {
    getUsersByFid: jest.fn(),
    getUsersByAddress: jest.fn(),
  },
}));

const { neynarLimiter } = require("@farther/common");

describe("syncUserData", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.ethAccount.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("should sync user data correctly", async () => {
    // Arrange
    const users = [
      {
        id: 1,
        displayName: "User One",
        username: "userone",
        pfpUrl: "url1",
        followerCount: 100,
        powerBadge: true,
      },
      {
        id: 2,
        displayName: "User Two",
        username: "usertwo",
        pfpUrl: "url2",
        followerCount: 200,
        powerBadge: false,
      },
    ];

    const neynarUserData = [
      {
        fid: 1,
        display_name: "Updated User One",
        username: "updateduserone",
        pfp_url: "newurl1",
        follower_count: 150,
        power_badge: true,
        verified_addresses: {
          eth_addresses: ["0xAddress1"],
        },
      },
      {
        fid: 2,
        display_name: "Updated User Two",
        username: "updatedusertwo",
        pfp_url: "newurl2",
        follower_count: 250,
        power_badge: false,
        verified_addresses: {
          eth_addresses: ["0xAddress2", "0xAddress3"],
        },
      },
    ];

    await prisma.user.createMany({ data: users });
    neynarLimiter.getUsersByFid.mockResolvedValue(neynarUserData);

    // Act
    await syncUserData();

    // Assert
    const dbUsers = await prisma.user.findMany({
      include: { ethAccounts: true },
    });

    expect(dbUsers).toHaveLength(2);

    dbUsers.forEach((user, index) => {
      expect(user.displayName).toBe(neynarUserData[index].display_name);
      expect(user.username).toBe(neynarUserData[index].username);
      expect(user.pfpUrl).toBe(neynarUserData[index].pfp_url);
      expect(user.followerCount).toBe(neynarUserData[index].follower_count);
      expect(user.powerBadge).toBe(neynarUserData[index].power_badge);
      expect(user.ethAccounts.map((e) => e.ethAccountId)).toEqual(
        neynarUserData[index].verified_addresses.eth_addresses,
      );
    });
  });

  it("should handle empty user data gracefully", async () => {
    // Arrange
    neynarLimiter.getUsersByFid.mockResolvedValue([]);

    // Act
    await syncUserData();

    // Assert
    const dbUsers = await prisma.user.findMany();
    expect(dbUsers).toHaveLength(0);
  });

  it("should update existing data correctly", async () => {
    // Arrange
    const users = [
      {
        id: 1,
        displayName: "User One",
        username: "userone",
        pfpUrl: "url1",
        followerCount: 100,
        powerBadge: true,
      },
    ];

    const neynarUserData = [
      {
        fid: 1,
        display_name: "Updated User One",
        username: "updateduserone",
        pfp_url: "newurl1",
        follower_count: 150,
        power_badge: false,
        verified_addresses: {
          eth_addresses: ["0xAddress1"],
        },
      },
    ];

    await prisma.user.createMany({ data: users });
    neynarLimiter.getUsersByFid.mockResolvedValue(neynarUserData);

    // Act
    await syncUserData();

    // Assert
    const dbUsers = await prisma.user.findMany({
      include: { ethAccounts: true },
    });

    expect(dbUsers).toHaveLength(1);

    const user = dbUsers[0];
    expect(user.displayName).toBe(neynarUserData[0].display_name);
    expect(user.username).toBe(neynarUserData[0].username);
    expect(user.pfpUrl).toBe(neynarUserData[0].pfp_url);
    expect(user.followerCount).toBe(neynarUserData[0].follower_count);
    expect(user.powerBadge).toBe(neynarUserData[0].power_badge);
    expect(user.ethAccounts.map((e) => e.ethAccountId)).toEqual(
      neynarUserData[0].verified_addresses.eth_addresses,
    );
  });

  it("should throw error if returned data length doesn't match", async () => {
    // Arrange
    const users = [
      {
        id: 1,
        displayName: "User One",
        username: "userone",
        pfpUrl: "url1",
        followerCount: 100,
        powerBadge: true,
      },
      {
        id: 2,
        displayName: "User Two",
        username: "usertwo",
        pfpUrl: "url2",
        followerCount: 200,
        powerBadge: false,
      },
    ];

    const neynarUserData = [
      {
        fid: 1,
        display_name: "Updated User One",
        username: "updateduserone",
        pfp_url: "newurl1",
        follower_count: 150,
        power_badge: true,
        verified_addresses: {
          eth_addresses: ["0xAddress1"],
        },
      },
    ];

    await prisma.user.createMany({ data: users });
    neynarLimiter.getUsersByFid.mockResolvedValue(neynarUserData);

    await expect(syncUserData()).rejects.toThrow(
      "Neynar data length does not match user data length",
    );
  });
});
