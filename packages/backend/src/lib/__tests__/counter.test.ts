import { QueueName } from "../bullmq";
import { counter } from "../jobQueues/counter";

jest.mock("@sentry/node", () => ({
  captureException: jest.fn(),
}));

describe("Counter Tests", () => {
  const queueName = "testQueue" as QueueName;
  const total = 10;

  beforeEach(async () => {
    // Remove existing data to ensure a clean state
    await counter.remove(queueName);
    // Initialize the counter for each test
    await counter.init({ queueName, total });
  });

  afterEach(async () => {
    // Clean up after each test
    await counter.remove(queueName);
  });

  test("should initialize the counter and total", async () => {
    const { count, total: retrievedTotal } = await counter.get(queueName);

    expect(count).toBe(0);
    expect(retrievedTotal).toBe(total);
  });

  test("should increment the counter atomically", async () => {
    const { count, total: retrievedTotal } = await counter.increment(queueName);

    expect(count).toBe(1);
    expect(retrievedTotal).toBe(total);
  });

  test("should complete all increments and return allCompleted as true", async () => {
    let count, retrievedTotal;

    for (let i = 0; i < total; i++) {
      ({ count, total: retrievedTotal } = await counter.increment(queueName));

      console.log(`count: ${count}, total: ${retrievedTotal}`);

      expect(count).toBe(i + 1);
      expect(retrievedTotal).toBe(total);
    }

    // Ensure no further increments are possible
    const { count: finalCount, total: finalTotal } =
      await counter.increment(queueName);
    expect(finalCount).toBe(total);
    expect(finalTotal).toBe(total);
  });

  test("should handle existing counter data gracefully", async () => {
    // Simulate existing data
    await counter.init({ queueName, total });

    const { count, total: retrievedTotal } = await counter.get(queueName);
    expect(count).toBe(0);
    expect(retrievedTotal).toBe(total);
  });

  test("should remove the counter and total", async () => {
    await counter.remove(queueName);
    const { count, total: retrievedTotal } = await counter.get(queueName);

    expect(count).toBeNull();
    expect(retrievedTotal).toBeNull();
  });
});
