import { prisma } from "../prisma";

async function openRankSnapshotDebugging() {
  const snapshots = await prisma.openRankSnapshot.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
    include: {
      _count: {
        select: {
          scores: true,
        },
      },
    },
  });

  console.log(snapshots);
}

openRankSnapshotDebugging();
