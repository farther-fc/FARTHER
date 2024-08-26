import { writeFile } from "fs/promises";
import { prisma } from "../prisma";

async function snapshot() {
  const latestTipMeta = await prisma.tipMeta.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latestTipMeta) {
    console.log("No tipMeta found");
    return;
  }

  const tippers = await prisma.user.findMany({
    where: {
      tipAllowances: {
        some: {
          tipMetaId: latestTipMeta.id,
        },
      },
    },
    include: {
      tipAllowances: {
        where: {
          tipMetaId: latestTipMeta.id,
        },
      },
    },
  });

  writeFile(
    "snapshot.json",
    JSON.stringify(
      tippers.map((t) => ({
        fid: t.id,
        balance: t.tipAllowances[0].userBalance,
      })),
      null,
      2,
    ),
  );
}

snapshot();
