// TODO: remove this after fix

import { AirdropLeaf, getMerkleRoot, neynarLimiter } from "@farther/common";
import { prisma } from "../prisma";
import { leafs } from "./tempTipAllocLeafs";

async function removeTipAllocations() {
  const tipAllocations = await prisma.allocation.findMany({
    where: {
      type: "TIPS",
      index: null,
    },
  });

  if (tipAllocations.length !== leafs.length) {
    throw new Error("Mismatched length");
  }

  const uniqueLeafAddresses = new Set(leafs.map((leaf) => leaf.address));
  const uniqueAllocationAddresses = new Set(
    tipAllocations.map((a) => a.address),
  );

  if (uniqueLeafAddresses.size !== uniqueAllocationAddresses.size) {
    throw new Error("Mismatched unique address length");
  }

  if (tipAllocations.filter((t) => t.type !== "TIPS").length > 0) {
    throw new Error("Non-tip allocations found");
  }

  const deletedAllocations = await prisma.allocation.deleteMany({
    where: {
      id: {
        in: tipAllocations.map((tipAllocation) => tipAllocation.id),
      },
    },
  });

  console.log("Deleted tip allocations: ", deletedAllocations.count);
}

async function fixMissingTipAllocationIndex() {
  // Get all tip allocations with a null index
  const tipAllocations = await prisma.allocation.findMany({
    where: {
      type: "TIPS",
      index: null,
    },
  });

  // Verify same length
  if (tipAllocations.length !== leafs.length) {
    throw new Error("Mismatched length");
  }

  console.log("length: ", tipAllocations.length);

  // Verify there are no duplicate addresses in the leafs

  const leafsAddresses = leafs.map((leaf) => leaf.address);
  const leafsAddressesSet = new Set(leafsAddresses);
  if (leafsAddresses.length !== leafsAddressesSet.size) {
    const duplicates = leafsAddresses.filter(
      (l) => leafsAddresses.indexOf(l) !== leafsAddresses.lastIndexOf(l),
    );
    throw new Error(`Duplicate addresses in leafs: ${duplicates.join(", ")}`);
  }

  // Verify there are no duplicate addresses in the tip allocations
  const tipAllocationsAddresses = tipAllocations.map(
    (tipAllocation) => tipAllocation.address,
  );
  const tipAllocationsAddressesSet = new Set(tipAllocationsAddresses);
  if (tipAllocationsAddresses.length !== tipAllocationsAddressesSet.size) {
    throw new Error("Duplicate addresses in tip allocations");
  }

  console.log("gucci");
}

async function spotCheck() {
  const tips = await prisma.tip.findMany({
    where: {
      allocationId: {
        not: null,
      },
    },
    select: {
      allocation: {
        select: {
          id: true,
          address: true,
        },
      },
      tippeeId: true,
    },
  });

  // Take 100 of them at random
  const randomTips = tips
    .sort(() => Math.random() - Math.random())
    .slice(0, 1000);

  // Get tippee data from neynar
  const tippeeIds = randomTips.map((tip) => tip.tippeeId);
  const tippeeData = await neynarLimiter.getUsersByFid(tippeeIds);

  // Verify the allocation addresses are correct

  for (const tip of randomTips) {
    const tippee = tippeeData.find((t) => t.fid === tip.tippeeId);
    if (!tippee) {
      console.error("Could not find tippee data for tippee: ", tip.tippeeId);
      continue;
    }

    if (
      !tippee.verified_addresses.eth_addresses[0].includes(
        tip.allocation.address,
      )
    ) {
      console.error(
        `Mismatched allocation address for tippee: ${tip.tippeeId}`,
      );
    }
  }
  console.log("All good");
}

async function merkleMismatch() {
  const airdrop = await prisma.airdrop.findFirst({
    where: {
      id: "96624a75-f902-4663-b07f-ec3f84826009",
    },
    select: {
      root: true,
      allocations: {
        select: {
          id: true,
          index: true,
          address: true,
          amount: true,
        },
      },
    },
  });

  if (airdrop.allocations.length !== leafs.length) {
    throw new Error("Mismatched length");
  }

  const unhashedLeaves = airdrop.allocations.map((r) => {
    if (typeof r.index !== "number" || !r.address || !r.amount) {
      throw new Error(
        `Invalid recipient data. index: ${r.index}, address: ${r.address}, amount: ${r.amount}`,
      );
    }
    return {
      index: r.index,
      address: r.address as `0x${string}`,
      amount: r.amount,
    };
  });

  unhashedLeaves.sort((a, b) => a.index - b.index);

  const calculatedRoot = getMerkleRoot(unhashedLeaves);

  const calculatedRootFromJson = getMerkleRoot(leafs as AirdropLeaf[]);

  console.log("Calculated root: ", calculatedRoot);
  console.log("Actual root: ", airdrop.root);
  console.log("Calculated root from json: ", calculatedRootFromJson);

  areLeafsIdentical(leafs, unhashedLeaves);

  console.log("gucci");
}

type Leafs = Array<{
  index: number;
  amount: string;
  address: string;
}>;
function areLeafsIdentical(array1: Leafs, array2: Leafs): boolean {
  if (array1.length !== array2.length) {
    throw new Error("Arrays have different lengths");
  }

  for (let i = 0; i < array1.length; i++) {
    const leaf1 = array1[i];
    const leaf2 = array2[i];

    if (leaf1.index !== leaf2.index) {
      throw new Error(
        `Mismatched index at position ${i}: ${leaf1.index} !== ${leaf2.index}`,
      );
    }

    if (leaf1.amount !== leaf2.amount) {
      throw new Error(
        `Mismatched amount at position ${i}: ${leaf1.amount} !== ${leaf2.amount}`,
      );
    }

    if (leaf1.address !== leaf2.address) {
      throw new Error(
        `Mismatched address at position ${i}: ${leaf1.address} !== ${leaf2.address}`,
      );
    }
  }

  return true;
}

// removeTipAllocations().catch(console.error);
// fixMissingTipAllocationIndex().catch(console.error);
// spotCheck().catch(console.error);
merkleMismatch().catch(console.error);
