import { neynarLimiter } from "@farther/common";
import { prisma } from "../prisma";

/**
 * Gets user profile data from Neynar and puts it in database
 */
export async function syncUserData() {
  const users = await prisma.user.findMany();
  const fids = users.map((user) => user.id);

  const neynarUserData = await neynarLimiter.getUsersByFid(fids);

  if (neynarUserData.length !== fids.length) {
    throw new Error("Neynar data length does not match user data length");
  }

  const userAddressPairs = neynarUserData.flatMap((user) =>
    user.verified_addresses.eth_addresses.map((address) => ({
      userId: user.fid,
      ethAccountId: address,
    })),
  );

  const uniqueUserAddressPairs: { userId: number; ethAccountId: string }[] =
    Array.from(
      new Set(userAddressPairs.map((pair) => JSON.stringify(pair))),
    ).map((pair) => JSON.parse(pair));

  const uniqueAddresses = Array.from(
    new Set(
      neynarUserData.flatMap((user) => user.verified_addresses.eth_addresses),
    ),
  );

  await prisma.$transaction(
    async (tx) => {
      await prisma.ethAccount.deleteMany({
        where: {
          users: {
            some: {
              userId: {
                in: fids,
              },
            },
          },
        },
      });

      await tx.user.deleteMany({
        where: {
          id: {
            in: fids,
          },
        },
      });

      await tx.user.createMany({
        data: neynarUserData.map((user) => ({
          id: user.fid,
          displayName: user.display_name,
          username: user.username,
          pfpUrl: user.pfp_url,
          followerCount: user.follower_count,
          powerBadge: user.power_badge,
        })),
      });

      await tx.ethAccount.createMany({
        data: uniqueAddresses.map((address) => ({
          address: address,
        })),
      });

      await tx.userEthAccount.createMany({
        data: uniqueUserAddressPairs.map(({ userId, ethAccountId }) => ({
          userId,
          ethAccountId,
        })),
      });
    },
    { timeout: 300_000 },
  );
}
