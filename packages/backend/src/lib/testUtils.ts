import { pgClientPromise } from "./__tests__/pgClientPromise";

export function mockDate(isoDate: string) {
  jest
    .useFakeTimers({ doNotFake: ["nextTick"] })
    .setSystemTime(new Date(isoDate));
}

// Borrowed from sound.xyz code repo
export async function resetDatabase() {
  const query = [
    "OpenRankScore",
    "OpenRankSnapshot",
    "Tweet",
    "Airdrop",
    "EcosystemPayment",
    "Tip",
    "TipAllowance",
    "TipMeta",
    "TokenPrice",
    "TipScore",
    "Allocation",
    "User",
  ]
    .map((table) => `DELETE FROM "${table}"`)
    .join(";");

  return await (
    await pgClientPromise()
  ).client.query(`START TRANSACTION; ${query}; COMMIT;`);
}
