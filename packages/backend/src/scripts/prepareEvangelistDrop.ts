import {
  ANVIL_AIRDROP_ADDRESS,
  tokenAllocations,
  evangelistAirdropConfig,
  neynarLimiter,
} from "@farther/common";
import { AllocationType, prisma } from "../prisma";
import { getMerkleRoot } from "@farther/common";
import { writeFile } from "../utils/helpers";
import { ENVIRONMENT, CHAIN_ID } from "@farther/common";

// After calling it, deploy the airdrop contract with the merkle root, manually add Airdrop.address & Airdrop.root in the DB,
// update the config with the next airdrop's values, and restart the cron.
async function prepareEvangelistDrop() {
  // Get all evangelists with pending rewards
  const recipients = await prisma.user.findMany({
    where: {
      allocations: {
        every: {
          type: AllocationType.EVANGELIST,
          // No airdrop ID == no airdrop deployed yet
          airdropId: null,
        },
      },
    },
    select: {
      id: true,
      fid: true,
      allocations: true,
    },
  });

  // Get their addresses from Neynar
  const latestUserData = await neynarLimiter.getUsersByFid(
    recipients.map((r) => r.fid),
  );

  const combinedData = recipients.map((r) => ({
    ...r,
    address: latestUserData.find((u) => u.fid === r.fid)?.verified_addresses
      .eth_addresses[0],
  }));

  const recipientsWithAddress = combinedData.filter((r) => r.address);
  const recipientsWithoutAddress = combinedData.filter((r) => !r.address);

  if (recipientsWithoutAddress.length > 0) {
    await writeFile(
      `airdrops/${ENVIRONMENT}/${AllocationType.EVANGELIST}-${evangelistAirdropConfig.NUMBER}-null-addresses.json`,
      JSON.stringify(
        recipientsWithoutAddress.map((r) => ({
          fid: r.fid,
          allocation: r.allocations[0].amount.toString(),
        })),
        null,
        2,
      ),
    );
  }

  const allAllocations = recipientsWithAddress.map((r) => r.allocations).flat();
  const allocationSum = allAllocations.reduce(
    (acc, a) => acc + BigInt(a.amount),
    BigInt(0),
  );

  const airdropAllocation = allocationSum * BigInt(10 ** 18);

  const amountPerRecipient =
    airdropAllocation / BigInt(recipientsWithAddress.length);

  // Create a merkle tree with the above recipients
  const rawLeafData = recipientsWithAddress.map((r, i) => ({
    index: i,
    address: r.address as `0x${string}`,
    amount: amountPerRecipient.toString(), // Amount is not needed in the merkle proof
  }));

  const root = getMerkleRoot(rawLeafData);

  const airdropData = {
    number: evangelistAirdropConfig.NUMBER,
    chainId: CHAIN_ID,
    amount: airdropAllocation.toString(),
    root,
    address: ENVIRONMENT === "development" ? ANVIL_AIRDROP_ADDRESS : undefined,
  };

  // Create Airdrop
  const airdrop = await prisma.airdrop.upsert({
    where: { number: evangelistAirdropConfig.NUMBER, chainId: CHAIN_ID },
    create: airdropData,
    update: airdropData,
  });

  // Add allocations to db
  await prisma.$transaction([
    prisma.allocation.deleteMany({
      where: {
        airdropId: airdrop.id,
      },
    }),
    prisma.allocation.createMany({
      data: recipientsWithAddress.map((recipient, i) => ({
        amount: amountPerRecipient.toString(),
        index: i,
        airdropId: airdrop.id,
        userId: recipient.id,
        type: AllocationType.EVANGELIST,
        address: recipient.address.toLowerCase(),
      })),
    }),
  ]);

  await writeFile(
    `airdrops/${CHAIN_ID}/${AllocationType.EVANGELIST}-${evangelistAirdropConfig.NUMBER}.json`,
    JSON.stringify(
      {
        root,
        amount: airdropAllocation.toString(),
        rawLeafData,
      },
      null,
      2,
    ),
  );

  console.log({
    root,
    amount: airdropAllocation,
    amountPerRecipient,
  });

  console.warn(
    `\n\nFOLLOW NEXT STEPS IN RUNBOOK!: \n https://www.notion.so/Airdrop-runbook-ad7d4c7116444d35ab76705eca2d6c98\n\n`,
  );
}

prepareEvangelistDrop().catch(console.error);
