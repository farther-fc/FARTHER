import * as Sentry from "@sentry/node";
import { kv } from "@vercel/kv";
import { QueueName } from "../bullmq";

// One hour
const DEFAULT_EXPIRATION = 60 * 60;

async function init({
  queueName,
  total,
  ex,
}: {
  queueName: QueueName;
  total: number;
  ex?: number;
}) {
  const counterKey = getCounterKey(queueName);
  const totalKey = getTotalKey(queueName);

  const existingCounter = await kv.get(counterKey);
  const existingTotal = await kv.get(totalKey);

  if (existingCounter || existingTotal) {
    const error = new Error(
      `Counter data already exists for ${queueName}. existingCounter: ${existingCounter}, existingTotal: ${existingTotal}`,
    );

    Sentry.captureException(error);

    if (counterKey) {
      await kv.del(counterKey);
    }
    if (totalKey) {
      await kv.del(totalKey);
    }
  }

  await kv.set(counterKey, 0, { ex: ex || DEFAULT_EXPIRATION });
  await kv.set(getTotalKey(queueName), total, { ex: ex || DEFAULT_EXPIRATION });
}

async function increment(queueName: QueueName) {
  const counterKey = getCounterKey(queueName);
  const totalKey = getTotalKey(queueName);

  // Lua script for atomic increment and check
  const luaScript = `
    local total = tonumber(redis.call('GET', KEYS[2]))
    local count = tonumber(redis.call('GET', KEYS[1]) or '0')
    if count < total then
      count = count + 1
      redis.call('SET', KEYS[1], count)
    end
    return {count, total}
  `;

  // Execute the Lua script
  const result = (await kv.eval(luaScript, [counterKey, totalKey], [])) as [
    number,
    number,
  ];

  // Extract the results
  const count = result[0];
  const total = result[1];

  return { count, total };
}

async function get(queueName: QueueName) {
  const [count, total] = await Promise.all([
    kv.get(getCounterKey(queueName)),
    kv.get(getTotalKey(queueName)),
  ]);
  return { count: count as number, total: total as number };
}

async function remove(queueName: QueueName) {
  await Promise.all([
    kv.del(getCounterKey(queueName)),
    kv.del(getTotalKey(queueName)),
  ]);
}

const getCounterKey = (queueName: QueueName) =>
  `${queueName.toLowerCase()}_counter`;

const getTotalKey = (queueName: QueueName) =>
  `${queueName.toLowerCase()}_total`;

export const counter = {
  init,
  increment,
  get,
  remove,
};
