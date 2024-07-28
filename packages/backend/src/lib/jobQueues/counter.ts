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
  const [count, total] = await Promise.all([
    kv.incr(getCounterKey(queueName)),
    kv.get(getTotalKey(queueName)),
  ]);
  return { count, total: total as number };
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
