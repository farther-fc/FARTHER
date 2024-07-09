import { OPENRANK_BATCH_LIMIT, OPENRANK_URL } from "@farther/common";
import Bottleneck from "bottleneck";
import * as dotenv from "dotenv";
import cron from "node-cron";
import { Client } from "pg"; // Example with PostgreSQL, adjust for your DB
import { chunk } from "underscore";
import { axios } from "./axios";

dotenv.config();

// Rate limit == 100 req/sec with API key (10 req/sec without key)
const RATE_LIMIT = 100;

const scheduler = new Bottleneck({
  maxConcurrent: 50,
  minTime: 1000 / RATE_LIMIT,
});

const fetchScores = async (fids: string[]) => {
  const fidChunks = chunk(fids, OPENRANK_BATCH_LIMIT);

  await Promise.all(
    fidChunks.map((fids) => {
      const response = scheduler.schedule(() => axios.post(OPENRANK_URL, fids));

      console.log(response);
    }),
  );
};

const storeData = async (data: any[]) => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432"),
  });

  try {
    await client.connect();
    const query =
      "INSERT INTO your_table (column1, column2) VALUES ($1, $2) ON CONFLICT DO NOTHING";
    const promises = data.map((item: any) =>
      client.query(query, [item.field1, item.field2]),
    );
    await Promise.all(promises);
  } catch (error) {
    console.error(`Error storing data: ${error}`);
    throw error;
  } finally {
    await client.end();
  }
};

const runJob = async () => {
  const time = new Date();
  console.log(`Job started at ${time.toISOString()}`);

  const ids = await getIdsToFetch(); // Implement this function to retrieve the list of IDs you need to process
  try {
    const data = await fetchChunkedData(ids);
    await storeData(data);
    console.log(`Data stored successfully at ${time.toISOString()}`);
  } catch (error) {
    console.error(`Job failed at ${time.toISOString()}: ${error}`);
  }
};

const getIdsToFetch = async (): Promise<string[]> => {
  // Fetch or generate the list of IDs to process
  // This can be from a database, file, or any other source
  return ["id1", "id2", "id3" /* ... more IDs ... */];
};

cron.schedule("0 0,12 * * *", runJob, {
  scheduled: true,
  timezone: "UTC",
});
