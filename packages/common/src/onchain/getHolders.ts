import { fetchQuery, init } from "@airstack/node";
import { writeFileSync } from "fs";
import { ENVIRONMENT, NEXT_PUBLIC_AIRSTACK_API_KEY } from "../env";
import { neynarLimiter } from "../neynar";
import { dummyHolders } from "./dummyHolders";

init(NEXT_PUBLIC_AIRSTACK_API_KEY);

/**
 *
 * @returns all holders in descending order of their balance
 */
export async function getHolders({
  includeLPs,
}: { includeLPs?: boolean } = {}) {
  if (ENVIRONMENT === "development") {
    return dummyHolders;
  }

  const balances: { address: string; balance: number }[] = [];

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
      const balance = Number(balanceData.amount);

      balances.push({
        address,
        balance,
      });
    }
  }

  if (includeLPs) {
    /**
     * TODO: Integrate liquidity positions data
     * 1. Fetch accounts that have positions IDs with positive liquidity
     * 2. Use position IDs to call nfpmContract.positions(id)
     * 3. Use tokensOwed
     * 4. Add to balances
     */
  }

  const holders = await attachFids(balances);

  holders.sort(
    (a, b) =>
      b.balances.reduce((acc, bal) => bal.balance + acc, 0) -
      a.balances.reduce((acc, bal) => bal.balance + acc, 0),
  );

  return holders;
}

async function attachFids(
  addressBalances: { address: string; balance: number }[],
) {
  const neynarResponse = await neynarLimiter.getUsersByAddress(
    addressBalances.map((h) => h.address),
  );

  const holders: {
    fid: number;
    balances: { address: string; balance: number }[];
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
      existingHolder.balances.push({ address, balance });
      continue;
    }

    holders.push({
      fid: user.fid,
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
        { _eq: "0x8ad5b9007556749de59e088c88801a3aaa87134b" }
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

getHolders()
  .then((data) => {
    writeFileSync("holders.json", JSON.stringify(data, null, 2));
  })
  .catch(console.error);
