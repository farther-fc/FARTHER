import { neynar } from "@farther/common";
import { AllocationType, prisma } from "../prisma";

async function testTipDrop() {
  // Make sure no invalid tips have been allocated to a drop

  const tips = await prisma.tip.findMany({});

  const filteredTips = tips
    .filter((tip) => tip.invalidTipReason)
    .filter((tip) => tip.allocationId !== null);

  console.log("total tips", tips.length);
  console.log("filtered tips", filteredTips.length);

  // Make sure every user who has received tips and has a neynar verified address also has an allocation
  const users = await prisma.user.findMany({
    where: {
      tipsReceived: {
        some: {},
      },
    },
    include: {
      allocations: {
        where: {
          type: AllocationType.TIPS,
        },
      },
    },
  });

  const userData = await neynar.getUsersByFid(users.map((user) => user.id));

  const usersWithAddresses = userData.filter(
    (user) => user.verified_addresses.eth_addresses[0],
  );

  console.log("users with addresses", usersWithAddresses.length);

  for (const user of usersWithAddresses) {
    const userWithAllocation = users.find((u) => u.id === user.fid);
    if (!userWithAllocation) {
      throw new Error(`User with address but no allocation ${user.fid}`);
    }
  }

  console.log("All users with addresses have allocations");
}

testTipDrop();
