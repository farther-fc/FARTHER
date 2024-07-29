import { NEXT_AIRDROP_START_TIME, getMerkleRoot } from "@farther/common";
import { AllocationType, prisma } from "../prisma";

async function verifyAirdrop() {
  for (const type of [
    AllocationType.POWER_USER,
    AllocationType.EVANGELIST,
    AllocationType.LIQUIDITY,
    AllocationType.TIPS,
  ]) {
    const allocations = await prisma.allocation.findMany({
      where: {
        type,
        airdropId: {
          not: null,
        },
        airdrop: {
          startTime: NEXT_AIRDROP_START_TIME,
        },
      },
      select: {
        id: true,
        amount: true,
        referenceAmount: true,
        address: true,
        userId: true,
        index: true,
      },
    });

    const airdrop = await prisma.airdrop.findFirst({
      where: {
        allocations: {
          every: {
            type,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
      take: 1,
    });

    if (!airdrop) {
      throw new Error(`No airdrop found for ${type}`);
    }

    // Create a merkle tree with the above recipients
    const unhashedLeaves = allocations.map((a) => {
      if (typeof a.index !== "number" || !a.address || !a.amount) {
        throw new Error(
          `Invalid recipient data. index: ${a.index}, address: ${a.address}, amount: ${a.amount}`,
        );
      }
      return {
        index: a.index,
        address: a.address as `0x${string}`,
        amount: a.amount,
      };
    });

    unhashedLeaves.sort((a, b) => a.index - b.index);

    const root = getMerkleRoot(unhashedLeaves);

    if (root !== airdrop.root) {
      throw new Error(
        `Merkle root mismatch. airdrop.root: ${airdrop.root}, calculated root: ${root}`,
      );
    }

    const amount = allocations
      .reduce((acc, a) => acc + BigInt(a.amount), BigInt(0))
      .toString();

    if (amount !== airdrop.amount) {
      throw new Error(
        `Airdrop amount mismatch. airdropAmount: ${airdrop.amount}, allocationSum: ${amount}`,
      );
    }

    console.log({
      type,
      address: airdrop.address,
      root: airdrop.root,
      recipients: allocations.length,
      amount,
    });
  }
}

verifyAirdrop().catch(console.error);
