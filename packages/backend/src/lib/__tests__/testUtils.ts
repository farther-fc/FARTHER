import { Tables } from "../../prisma";
import { pgClientPromise } from "./pgClientPromise";

export function mockDate(isoDate: string) {
  jest.useFakeTimers().setSystemTime(new Date(isoDate));
}

// Borrowed from sound.xyz code repo
export async function resetDatabase(...tables: [Tables, ...Tables[]]) {
  const query = tables.map((table) => `DELETE FROM "${table}"`).join(";");

  return await (
    await pgClientPromise()
  ).client.query(`START TRANSACTION; ${query}; COMMIT;`);
}
