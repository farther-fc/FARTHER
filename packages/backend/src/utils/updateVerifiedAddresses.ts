import { neynarLimiter } from "@farther/common";
import { User } from "@prisma/client";
import { prisma } from "../prisma";

export async function updateVerifiedAddresses(users: User[]) {
  const fids = users.map((u) => u.fid);

  const usersFromNeynar = await neynarLimiter.getUsersByFid(fids);

  return prisma.$transaction(
    usersFromNeynar.map((u) => {
      return prisma.user.update({
        where: { fid: u.fid },
        // If this is undefined, the database will keep the existing address
        data: { address: u.verified_addresses.eth_addresses[0] },
      });
    }),
  );
}
