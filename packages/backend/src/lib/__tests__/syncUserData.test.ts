import { prisma } from "../../prisma";
import { syncUserData } from "../jobQueues/syncUserData";
import { clearDatabase } from "../utils/testUtils";

jest.mock("@farther/common", () => ({
  neynar: {
    getUsersByFid: jest.fn(),
    getUsersByAddress: jest.fn(),
  },
}));

const { neynar } = require("@farther/common");

describe("syncUserData", () => {
  beforeAll(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await clearDatabase();
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
    neynar.getUsersByFid.mockResolvedValue(neynarUserData);

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
        neynarUserData[index].verified_addresses.eth_addresses.map((a) =>
          a.toLowerCase(),
        ),
      );
    });
  });

  it("should handle empty user data gracefully", async () => {
    // Arrange
    neynar.getUsersByFid.mockResolvedValue([]);

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
    neynar.getUsersByFid.mockResolvedValue(neynarUserData);

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
      neynarUserData[0].verified_addresses.eth_addresses.map((a) =>
        a.toLowerCase(),
      ),
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
    neynar.getUsersByFid.mockResolvedValue(neynarUserData);

    await expect(syncUserData()).rejects.toThrow();
  });

  it("should not result in the deletion of other relational user data", async () => {
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

    await prisma.user.createMany({ data: users });

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

    const tipMeta = await prisma.tipMeta.create({
      data: {
        tipMinimum: 123,
        totalAllowance: 123,
        carriedOver: 123,
        usdPrice: 123,
      },
    });

    // Give the tipper a tip allowance
    const tipAllowance = await prisma.tipAllowance.create({
      data: {
        amount: 30239739073,
        userId: 1,
        userBalance: "42069",
        tipMetaId: tipMeta.id,
      },
    });

    await prisma.tip.createMany({
      data: [
        {
          hash: "0x1",
          amount: 100,
          tipperId: 1,
          tippeeId: 2,
          tipAllowanceId: tipAllowance.id,
        },
      ],
    });

    const openRankSnapshot = await prisma.openRankSnapshot.create({
      data: {
        id: new Date().toISOString(),
      },
    });

    await prisma.openRankScore.createMany({
      data: [
        {
          userId: 1,
          score: 100,
          snapshotId: openRankSnapshot.id,
        },
        {
          userId: 2,
          score: 397,
          snapshotId: openRankSnapshot.id,
        },
      ],
    });

    neynar.getUsersByFid.mockResolvedValue(neynarUserData);

    // Act
    await syncUserData();

    // Assert
    const dbUsers = await prisma.user.findMany({
      include: { ethAccounts: true },
    });

    expect(dbUsers).toHaveLength(2);

    const tMeta = await prisma.tipMeta.findMany();
    expect(tMeta).toHaveLength(1);

    const tipAllowances = await prisma.tipAllowance.findMany();
    expect(tipAllowances).toHaveLength(1);

    const tips = await prisma.tip.findMany();
    expect(tips).toHaveLength(1);

    const openRankScores = await prisma.openRankScore.findMany();
    expect(openRankScores).toHaveLength(2);
  });

  it("should update connected eth accounts and remove disconnected ones", async () => {
    await prisma.user.create({
      data: {
        id: 1,
        displayName: "User One",
        username: "userone",
        pfpUrl: "url1",
        followerCount: 100,
        powerBadge: true,
        ethAccounts: {
          connectOrCreate: [
            {
              where: {
                userId_ethAccountId: {
                  userId: 1,
                  ethAccountId: "0xaddress1",
                },
              },
              create: {
                ethAccount: {
                  connectOrCreate: {
                    where: { address: "0xaddress1" },
                    create: { address: "0xaddress1" },
                  },
                },
              },
            },
            {
              where: {
                userId_ethAccountId: {
                  userId: 1,
                  ethAccountId: "0xaddress2",
                },
              },
              create: {
                ethAccount: {
                  connectOrCreate: {
                    where: { address: "0xaddress2" },
                    create: { address: "0xaddress2" },
                  },
                },
              },
            },
          ],
        },
      },
    });

    const neynarUserData = [
      {
        fid: 1,
        display_name: "Updated User One",
        username: "updateduserone",
        pfp_url: "newurl1",
        follower_count: 150,
        power_badge: true,
        verified_addresses: {
          eth_addresses: ["0xAddress2", "0xAddress3"],
        },
      },
    ];

    neynar.getUsersByFid.mockResolvedValue(neynarUserData);

    const dbUsersBefore = await prisma.user.findMany({
      include: { ethAccounts: true },
    });

    expect(dbUsersBefore).toHaveLength(1);
    expect(dbUsersBefore[0].ethAccounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ethAccountId: "0xaddress1", userId: 1 }),
        expect.objectContaining({ ethAccountId: "0xaddress2", userId: 1 }),
      ]),
    );

    // Act
    await syncUserData();

    // Assert
    const dbUsersAfter = await prisma.user.findMany({
      include: { ethAccounts: true },
    });

    expect(dbUsersAfter).toHaveLength(1);
    expect(dbUsersAfter[0].ethAccounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ethAccountId: "0xaddress2", userId: 1 }),
        expect.objectContaining({ ethAccountId: "0xaddress3", userId: 1 }),
      ]),
    );

    const ethAccounts = (await prisma.ethAccount.findMany()).map(
      (d) => d.address,
    );

    console.log("ethAccounts", ethAccounts);

    expect(ethAccounts).toEqual(
      expect.arrayContaining(["0xaddress2", "0xaddress3"]),
    );
    expect(ethAccounts).toHaveLength(2);
  });
});
