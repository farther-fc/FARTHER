import { prisma } from "../prisma";

async function migrateAllocationIds() {
  const tweets = await prisma.tweet.findMany({
    select: {
      id: true,
      newAllocationId: true,
      allocation: {
        select: {
          id: true,
          newId: true,
        },
      },
    },
  });

  prisma.$transaction(
    tweets.map((tweet) => {
      return prisma.tweet.update({
        where: {
          id: tweet.id,
        },
        data: {
          newAllocationId: tweet.allocation.newId,
        },
      });
    }),
  );
}

migrateAllocationIds().catch(console.error);
