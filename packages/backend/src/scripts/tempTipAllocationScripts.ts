// TODO: remove this after fix

import { AirdropLeaf, getMerkleRoot, neynarLimiter } from "@farther/common";
import { Address } from "viem";
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

  const calculatedRoot = getMerkleRoot(
    airdrop.allocations.map((a) => ({
      index: a.index,
      address: a.address as Address,
      amount: a.amount,
    })),
  );

  const calculatedRootFromJson = getMerkleRoot(leafs as AirdropLeaf[]);

  console.log("Calculated root: ", calculatedRoot);
  console.log("Actual root: ", airdrop.root);
  console.log("Calculated root from json: ", calculatedRootFromJson);

  if (calculatedRoot !== airdrop.root) {
    for (const alloc of airdrop.allocations) {
      const leaf = leafs.find(
        (l) => l.address === alloc.address && l.index === alloc.index,
      );
      if (!leaf) {
        console.error("Missing leaf: ", alloc);
      }
    }
    for (const leaf of leafs) {
      const alloc = airdrop.allocations.find(
        (a) => a.address === leaf.address && a.index === leaf.index,
      );
      if (!alloc) {
        console.error("Missing alloc: ", leaf);
      }
    }
  }
}

// removeTipAllocations().catch(console.error);
// fixMissingTipAllocationIndex().catch(console.error);
// spotCheck().catch(console.error);
merkleMismatch().catch(console.error);
