import { ENVIRONMENT, NEXT_AIRDROP_START_TIME } from "@farther/common";
import { AllocationType } from "@prisma/client";
import { createObjectCsvWriter } from "csv-writer";
import { Address } from "viem";

export async function createAllocationsCSV({
  allocationType,
  leafs,
}: {
  allocationType: AllocationType;
  leafs: { index: number; address: Address; amount: string }[];
}) {
  const csvWriter = createObjectCsvWriter({
    path: `airdrops/${ENVIRONMENT}/${allocationType.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.csv`,
    header: [
      { id: "address", title: "address" },
      { id: "amount", title: "amount" },
    ],
  });

  await csvWriter.writeRecords(leafs);
}
