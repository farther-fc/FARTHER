import { AllocationType, prisma } from "../../../backend/src/prisma";
import { WAD_SCALER } from "../env";

async function getAirdropData() {
  const powerAllocations = await prisma.allocation.findMany({
    where: {
      type: AllocationType.POWER_USER,
    },
  });

  const amounts = powerAllocations
    .map((allocation) => {
      return allocation.amount;
    })
    .map((amount) => Number(BigInt(amount) / WAD_SCALER))
    .sort((a, b) => b - a);

  console.info(amounts);
}

getAirdropData().catch((e) => {
  console.error(e);
  process.exit(1);
});
