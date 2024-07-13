import { prisma } from "@farther/backend";
import { createDummyCast } from "../tips/agentModeling/createDummyCast";
import { handleTip } from "./utils/handleTip";

async function testHandleTip() {
  const TIPPER_ID = 4378;
  const tipper = await prisma.user.upsert({
    where: { id: TIPPER_ID },
    create: {
      id: 4378,
    },
    update: {},
  });

  // const tipMeta = await prisma.tipMeta.create({
  //   data: {
  //     tipMinimum: 100,
  //     usdPrice: 1,
  //     totalAllowance: 1_000_000,
  //     carriedOver: 0,
  //   },
  // });

  // await prisma.tipAllowance.create({
  //   data: {
  //     userId: TIPPER_ID,
  //     userBalance: "100000000000",
  //     amount: 500,
  //     tipMetaId: tipMeta.id,
  //   },
  // });

  const dummyCastData = createDummyCast({
    tipperFid: tipper.id,
    tippeeFid: TIPPER_ID,
    amount: 500,
  });

  await handleTip({
    castData: dummyCastData.data as any,
    createdAtMs: dummyCastData.created_at * 1000,
  });
}

testHandleTip();
