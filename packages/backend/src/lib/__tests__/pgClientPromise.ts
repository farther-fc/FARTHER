import * as pgPackage from "pg";
import { requireEnv } from "require-env-variable";

const { DATABASE_URL } = requireEnv("DATABASE_URL");

// Borrowed from sound.xyz code repo
export const pgClientPromise = async () => {
  const pgDatabaseUrl = new URL(DATABASE_URL);

  const useSsl = pgDatabaseUrl.searchParams.has("sslmode");

  if (useSsl) {
    // https://github.com/brianc/node-postgres/issues/2375
    pgDatabaseUrl.searchParams.delete("sslmode");
  }

  const pool = new pgPackage.Pool({
    connectionString: pgDatabaseUrl.href,
    ssl: useSsl
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
  });

  const client = await pool.connect();

  return { client, pool };
};
