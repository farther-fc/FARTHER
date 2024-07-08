import { fetchQuery } from "@airstack/node";
import { ENVIRONMENT, dummyHolders, neynarLimiter } from "@farther/common";
import { getAllLiqProviderBalances } from "server/liquidity/getAllLiqProviderBalances";

/**
 *
 * @returns all holders in descending order of their balance
 */
export async function getHolders({
  includeLPs,
}: { includeLPs?: boolean } = {}) {
  if (ENVIRONMENT === "development") {
    return dummyHolders.map((h) => ({
      fid: h.fid,
      totalBalance: BigInt(h.totalBalance),
      balances: h.balances.map((b) => ({
        address: b.address,
        balance: BigInt(b.balance),
      })),
    }));
  }

  if (!process.env.NEXT_PUBLIC_AIRSTACK_API_KEY) {
    throw new Error("NEXT_PUBLIC_AIRSTACK_API_KEY is not set");
  }

  // init(process.env.NEXT_PUBLIC_AIRSTACK_API_KEY);

  const balances: { address: string; balance: bigint }[] = [];

  let hasNextPage = true;
  let cursor: string | undefined = undefined;

  while (hasNextPage) {
    const { data, error } = await fetchQuery(airstackQuery(cursor));

    if (error) throw error;

    hasNextPage = data.TokenBalances.pageInfo.hasNextPage;
    cursor = data.TokenBalances.pageInfo.nextCursor;

    for (const balanceData of data.TokenBalances.TokenBalance) {
      if (balanceData.owner.addresses.length > 1) {
        console.warn(
          "Multiple addresses found for a single owner",
          balanceData.owner,
        );
      }

      const address = balanceData.owner.addresses[0];

      const balance = BigInt(balanceData.amount);

      balances.push({
        address,
        balance,
      });
    }
  }

  if (includeLPs) {
    const lpHolderBalances = await getAllLiqProviderBalances();

    // Merge LP holders with the rest
    for (const lpHolderBalance of lpHolderBalances) {
      const existingHolder = balances.find(
        (h) =>
          h.address.toLowerCase() === lpHolderBalance.address.toLowerCase(),
      );

      if (existingHolder) {
        existingHolder.balance += lpHolderBalance.balance;
      } else {
        balances.push(lpHolderBalance);
      }
    }
  }

  const holders = await attachFids(balances);

  holders.sort((a, b) => {
    const aBalance = a.balances.reduce(
      (acc, bal) => bal.balance + acc,
      BigInt(0),
    );
    const bBalance = b.balances.reduce(
      (acc, bal) => bal.balance + acc,
      BigInt(0),
    );

    if (aBalance < bBalance) {
      return 1;
    } else if (aBalance > bBalance) {
      return -1;
    } else {
      return 0;
    }
  });

  return holders;
}

async function attachFids(
  addressBalances: { address: string; balance: bigint }[],
) {
  const neynarResponse = await neynarLimiter.getUsersByAddress(
    addressBalances.map((h) => h.address),
  );

  const holders: {
    fid: number;
    totalBalance: bigint;
    balances: { address: string; balance: bigint }[];
  }[] = [];

  let noFidCount = 0;

  for (const addressBalance of addressBalances) {
    const { address, balance } = addressBalance;

    const users = neynarResponse[address];

    if (!users) {
      noFidCount++;
      continue;
    }

    // If multiple users are returned, use the one with the most followers
    const user = Array.isArray(users)
      ? users.sort((a, b) => b.follower_count - a.follower_count)[0]
      : users;

    if (!user) {
      noFidCount++;
      continue;
    }

    const existingHolder = holders.find((r) => r.fid === user.fid);

    if (existingHolder) {
      existingHolder.totalBalance = existingHolder.totalBalance + balance;

      existingHolder.balances.push({ address, balance });
      continue;
    }

    holders.push({
      fid: user.fid,
      totalBalance: balance,
      balances: [{ address, balance }],
    });
  }

  console.log(
    `Holders: ${addressBalances.length}, with fids: ${holders.length}`,
  );
  console.warn("No FID found for", noFidCount, "holders");

  return holders;
}

const airstackQuery = (cursor?: string) => `query TokenBalances {
  TokenBalances(
    input: {
      filter: {
        tokenAddress: 
        { _eq: "0x8ad5b9007556749de59e088c88801a3aaa87134b" },
        formattedAmount: { _gt: 1 }
      }, 
      blockchain: 
      base, 
      limit: 200 
      ${cursor ? `, cursor: "${cursor}"` : ""} 
    }
  ) {
    TokenBalance {
      amount
      owner {
        addresses
      }
    }
    pageInfo {
      hasNextPage 
      hasPrevPage
      nextCursor
      prevCursor
    }
  }
}`;

// getHolders({ includeLPs: true })
//   .then((holders) => {
//     writeFileSync(
//       "holders.json",
//       JSON.stringify(
//         holders.map((h) => ({
//           fid: h.fid,
//           totalBalance: h.totalBalance.toString(),
//           balances: h.balances.map((b) => ({
//             address: b.address,
//             balance: b.balance.toString(),
//           })),
//         })),
//         null,
//         2,
//       ),
//     );
//   })
//   .catch(console.error);
