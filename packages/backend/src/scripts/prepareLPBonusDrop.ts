import {
  ENVIRONMENT,
  UniswapV3StakerAbi,
  WAD_SCALER,
  contractAddresses,
  incentivePrograms,
  tokenAllocations,
  viemPublicClient,
} from "@farther/common";
import axios from "axios";
import { formatEther, keccak256 } from "ethers";

type Account = {
  id: string;
  rewardsClaimed: string;
};

const format = (n: string | bigint) => Number(formatEther(n)).toLocaleString();

const totalIncentiveAllocation =
  BigInt(tokenAllocations.liquidityRewards / 3) * WAD_SCALER;

async function prepareLPBonusDrop() {
  // await airdropSanityCheck();

  // Get all liquidity providers who have claimed rewards
  const query = await axios({
    url: `https://farther.squids.live/farther-${ENVIRONMENT}/graphql`,
    method: "post",
    data: {
      query: `
      query LPRewardClaimers {
        accounts(where: { rewardsClaimed_gt: 0 }) {
          id
          rewardsClaimed
        }
      }
    `,
    },
  });

  const accounts: Account[] = query.data.data.accounts;

  for (const account of accounts) {
    console.log(account.id, format(account.rewardsClaimed));
  }

  const totalRewards = accounts.reduce(
    (acc, a) => acc + BigInt(a.rewardsClaimed),
    BigInt(0),
  );

  const [totalRewardsUnclaimed] = await viemPublicClient.readContract({
    abi: UniswapV3StakerAbi,
    address: contractAddresses.UNISWAP_V3_STAKER,
    functionName: "incentives",
    args: [
      keccak256(
        incentivePrograms[1].incentiveKey as `0x${string}`,
      ) as `0x${string}`,
    ],
  });

  const totalClaimed = totalIncentiveAllocation - totalRewardsUnclaimed;
  const diff = totalRewards - totalClaimed;

  console.log({
    totalIncentiveAllocation: format(totalIncentiveAllocation),
    totalRewardsUnclaimed: format(totalRewardsUnclaimed),
    totalClaimed: format(totalClaimed),
    totalRewards: format(totalRewards),
    diff: format(diff),
  });

  // for (const recipient of dbRecipients) {
  //   if (recipient.allocations.length > 1) {
  //     throw new Error(`User ${recipient.id} has multiple allocations`);
  //   }
  // }

  // const recipients = dbRecipients.map(({ allocations, ...rest }) => ({
  //   ...rest,
  //   allocation: allocations[0],
  // }));

  // // Get their addresses from Neynar
  // const userData = await getUserData(recipients.map((r) => r.id));

  // const combinedData = recipients.map((r) => ({
  //   ...r,
  //   address: userData.find((u) => u.fid === r.id)?.address,
  // }));

  // const recipientsWithAddress = combinedData.filter((r) => r.address);
  // const recipientsWithoutAddress = combinedData.filter((r) => !r.address);

  // if (recipientsWithoutAddress.length > 0) {
  //   await writeFile(
  //     `airdrops/${ENVIRONMENT}/${AllocationType.EVANGELIST.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}-null-addresses.json`,
  //     JSON.stringify(
  //       recipientsWithoutAddress.map((r) => ({
  //         fid: r.id,
  //         amount: r.allocation.amount.toString(),
  //       })),
  //       null,
  //       2,
  //     ),
  //   );
  // }
  // const allocationSum = recipientsWithAddress
  //   .map((r) => r.allocation)
  //   .reduce((acc, a) => acc + BigInt(a.amount), BigInt(0));

  // // Create a merkle tree with the above recipients
  // const rawLeafData = recipientsWithAddress.map((r, i) => ({
  //   index: i,
  //   address: r.address as `0x${string}`,
  //   amount: r.allocation.amount.toString(), // Amount is not needed in the merkle proof
  // }));

  // const root = getMerkleRoot(rawLeafData);

  // // Create Airdrop
  // const airdrop = await prisma.airdrop.create({
  //   data: {
  //     chainId: CHAIN_ID,
  //     amount: allocationSum.toString(),
  //     root,
  //     address:
  //       ENVIRONMENT === "development" ? ANVIL_AIRDROP_ADDRESS : undefined,
  //     startTime: NEXT_AIRDROP_START_TIME,
  //     endTime: NEXT_AIRDROP_END_TIME,
  //   },
  // });

  // // Add allocations to db
  // await prisma.allocation.updateMany({
  //   data: recipientsWithAddress.map((r, i) => ({
  //     id: uuidv4(),
  //     index: i,
  //     airdropId: airdrop.id,
  //     userId: r.id,
  //     type: AllocationType.EVANGELIST,
  //     address: r.address.toLowerCase(),
  //   })),
  // });

  // await writeFile(
  //   `airdrops/${NETWORK}/${AllocationType.EVANGELIST.toLowerCase()}-${NEXT_AIRDROP_START_TIME.toISOString()}.json`,
  //   JSON.stringify(
  //     {
  //       root,
  //       amount: allocationSum.toString(),
  //       rawLeafData,
  //     },
  //     null,
  //     2,
  //   ),
  // );

  // console.info({
  //   root,
  //   amount: allocationSum,
  //   recipients: recipientsWithAddress.length,
  // });

  // console.warn(
  //   `\n\nFOLLOW NEXT STEPS IN RUNBOOK!: \n https://www.notion.so/Airdrop-runbook-ad7d4c7116444d35ab76705eca2d6c98\n\n`,
  // );
}

prepareLPBonusDrop().catch(console.error);
