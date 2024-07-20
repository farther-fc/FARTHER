import { cache, cacheTypes } from "@lib/cache";
import kv from "@vercel/kv";

// Mock data for testing
const userKey = { address: "0x123" };
const userValue = { name: "Alice", age: 30 };
const tipMetaValue = { tips: ["Tip1", "Tip2"] };
const leaderboardValue = { leaders: ["User1", "User2"] };

describe("Cache System", () => {
  beforeAll(async () => {
    await kv.flushdb(); // Ensure the database is clean before tests
  });

  afterEach(async () => {
    await kv.flushdb(); // Clean up after each test
  });

  test("should set and get USER cache correctly", async () => {
    await cache.set({ type: cacheTypes.USER, key: userKey, value: userValue });

    const result = await cache.get({ type: cacheTypes.USER, key: userKey });
    expect(result).toEqual(userValue);
  });

  test("should set and get TIP_META cache correctly", async () => {
    await cache.set({ type: cacheTypes.TIP_META, value: tipMetaValue });

    const result = await cache.get({ type: cacheTypes.TIP_META });
    expect(result).toEqual(tipMetaValue);
  });

  test("should set and get LEADERBOARD cache correctly", async () => {
    await cache.set({ type: cacheTypes.LEADERBOARD, value: leaderboardValue });

    const result = await cache.get({ type: cacheTypes.LEADERBOARD });
    expect(result).toEqual(leaderboardValue);
  });

  test("should flush USER cache correctly", async () => {
    await cache.set({ type: cacheTypes.USER, key: userKey, value: userValue });

    await cache.flush(cacheTypes.USER);

    const result = await cache.get({ type: cacheTypes.USER, key: userKey });
    expect(result).toBeNull();
  });

  test("should flush TIP_META cache correctly", async () => {
    await cache.set({ type: cacheTypes.TIP_META, value: tipMetaValue });

    await cache.flush(cacheTypes.TIP_META);

    const result = await cache.get({ type: cacheTypes.TIP_META });
    expect(result).toBeNull();
  });

  test("should flush LEADERBOARD cache correctly", async () => {
    await cache.set({ type: cacheTypes.LEADERBOARD, value: leaderboardValue });

    await cache.flush(cacheTypes.LEADERBOARD);

    const result = await cache.get({ type: cacheTypes.LEADERBOARD });
    expect(result).toBeNull();
  });

  test("should throw an error when setting USER cache without a key", async () => {
    await expect(
      cache.set({ type: cacheTypes.USER, value: userValue }),
    ).rejects.toThrow("Key is required for USER type");
  });
