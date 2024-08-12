import { prisma } from "@farther/backend";

export async function isBanned(fids: number[]) {
  const users = await prisma.user.findMany({
    where: {
      id: {
        in: fids,
      },
    },
  });

  return fids.map((fid) => {
    const user = users.find((u) => u.id === fid);
    return user?.isBanned;
  });
}
