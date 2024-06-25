import "dotenv/config";

import assert from "assert";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const DATABASE_URL = new URL(process.env.DATABASE_URL);

assert(
  DATABASE_URL.hostname === "localhost" ||
    DATABASE_URL.hostname === "127.0.0.1",
  "This can only be executed on a localhost database",
);
