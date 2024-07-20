import {
  dummyLeaderBoard,
  dummyTipsMeta,
  dummyUser,
} from "@lib/__tests__/testData";
import { cache, cacheTypes } from "@lib/cache";
import kv from "@vercel/kv";

// Mock data for testing
const userKey = { address: "0x123" };

describe("KV Cache", () => {
  beforeAll(async () => {
    await kv.flushdb(); // Ensure the database is clean before tests
  });

  afterEach(async () => {
    await kv.flushdb(); // Clean up after each test
  });

  test("should set and get USER cache correctly", async () => {
    await cache.set({ type: cacheTypes.USER, key: userKey, value: dummyUser });

    const result = await cache.get({ type: cacheTypes.USER, key: userKey });
    expect(result).toEqual(dummyUser);
  });

  test("should set and get TIP_META cache correctly", async () => {
    await cache.set({ type: cacheTypes.TIP_META, value: dummyTipsMeta });

    const result = await cache.get({ type: cacheTypes.TIP_META });
    expect(result).toEqual(dummyTipsMeta);
  });

  test("should set and get LEADERBOARD cache correctly", async () => {
    await cache.set({ type: cacheTypes.LEADERBOARD, value: dummyLeaderBoard });

    const result = await cache.get({ type: cacheTypes.LEADERBOARD });
    expect(result).toEqual(dummyLeaderBoard);
  });

  test("should flush USER cache correctly", async () => {
    await cache.set({ type: cacheTypes.USER, key: userKey, value: dummyUser });

    await cache.flush(cacheTypes.USER);

    const result = await cache.get({ type: cacheTypes.USER, key: userKey });
    expect(result).toBeNull();
  });

  test("should flush TIP_META cache correctly", async () => {
    await cache.set({ type: cacheTypes.TIP_META, value: dummyTipsMeta });

    await cache.flush(cacheTypes.TIP_META);

    const result = await cache.get({ type: cacheTypes.TIP_META });
    expect(result).toBeNull();
  });

  test("should flush LEADERBOARD cache correctly", async () => {
    await cache.set({ type: cacheTypes.LEADERBOARD, value: dummyLeaderBoard });

    await cache.flush(cacheTypes.LEADERBOARD);

    const result = await cache.get({ type: cacheTypes.LEADERBOARD });
    expect(result).toBeNull();
  });
});
