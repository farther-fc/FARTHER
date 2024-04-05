import {
  ANVIL_AIRDROP_ADDRESS,
  TOTAL_POWER_USER_AIRDROP_SUPPLY,
  powerUserAirdropConfig,
} from "@common/constants";
import { AirdropType, prisma } from "../prisma";
import { getMerkleRoot } from "@common/merkle";
import { writeFile } from "../utils/helpers";
import { ENVIRONMENT, defaultChainId } from "@common/env";

// Prior to calling it, the updatePowerUsers cron should be paused (which effectively becomes the snapshot time)
// After calling it, deploy the airdrop contract with the merkle root, manually update Airdrop.address & Airdrop.root in the DB,
// update the config with the next airdrop's values, and restart the cron.
async function preparePowerDrop() {
  // Get all powers users who have not received an airdrop allocation but do have an address
  const recipients = await prisma.user.findMany({
    where: {
      address: {
        not: null,
      },
      allocations: {
        // Each user only gets one power user airdrop
        none: {
          airdrop: {
            type: AirdropType.POWER_USER,
          },
        },
      },
    },
  });

  const totalAllocation =
    BigInt(powerUserAirdropConfig.RATIO * TOTAL_POWER_USER_AIRDROP_SUPPLY) *
    BigInt(10 ** 18);

  const amountPerRecipient = totalAllocation / BigInt(recipients.length);

  // Throws away any remainder from the division
  const trueTotalAllocation = amountPerRecipient * BigInt(recipients.length);

  // Create a merkle tree with the above recipients
  const rawLeafData = recipients.map((r, i) => ({
    index: i,
    address: r.address as `0x${string}`,
    amount: amountPerRecipient.toString(), // Amount is not needed in the merkle proof
  }));

  const root = getMerkleRoot(rawLeafData);

  // Create Airdrop
  const airdrop = await prisma.airdrop.upsert({
    where: { number: powerUserAirdropConfig.NUMBER, chainId: defaultChainId },
    create: {
      number: powerUserAirdropConfig.NUMBER,
      chainId: defaultChainId,
      amount: trueTotalAllocation.toString(),
      type: AirdropType.POWER_USER,
      root,
      address:
        ENVIRONMENT === "development" ? ANVIL_AIRDROP_ADDRESS : undefined,
    },
    update: {},
  });

  // Add allocations to db
  await prisma.$transaction([
    prisma.allocation.deleteMany({
      where: {
        airdropId: airdrop.id,
      },
    }),
    prisma.allocation.createMany({
      data: recipients.map((recipient, i) => ({
        amount: amountPerRecipient.toString(),
        index: i,
        airdropId: airdrop.id,
        userId: recipient.id,
      })),
    }),
  ]);

  await writeFile(
    `airdrops/${defaultChainId}/power-user-airdrop-${powerUserAirdropConfig.NUMBER}.json`,
    JSON.stringify(
      {
        root,
        rawLeafData,
      },
      null,
      2,
    ),
  );

  console.log({
    root,
    totalAllocation,
    amountPerRecipient,
    trueTotalAllocation,
  });

  console.warn(
    `\n\nFOLLOW NEXT STEPS IN RUNBOOK!: \n https://www.notion.so/Airdrop-runbook-ad7d4c7116444d35ab76705eca2d6c98\n\n`,
  );
}

preparePowerDrop().catch(console.error);
