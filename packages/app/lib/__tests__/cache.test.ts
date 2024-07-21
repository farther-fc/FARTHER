import {
  dummyLeaderBoard,
  dummyUser,
  dummyUserTips,
  dummyUserTipsMeta,
} from "@lib/__tests__/testData";
import { cache, cacheTypes } from "@lib/cache";
import kv from "@vercel/kv";

// Mock data for testing
const userKey1 = { fid: 123 };
const dummyUser1 = { ...dummyUser, fid: 123 };
const userKey2 = { fid: 456 };
const dummyUser2 = { ...dummyUser, fid: 456 };
const userTipsKey = 789;

describe("KV Cache", () => {
  beforeAll(async () => {
    await kv.flushdb(); // Ensure the database is clean before tests
  });

  afterEach(async () => {
    await kv.flushdb(); // Clean up after each test
  });

  test("should set and get USER cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER,
      key: userKey1,
      value: dummyUser1,
    });

    const result = await cache.get({ type: cacheTypes.USER, key: userKey1 });
    expect(result).toEqual(dummyUser1);
  });

  test("should set and get TIP_META cache correctly", async () => {
    await cache.set({ type: cacheTypes.TIP_META, value: dummyUserTipsMeta });

    const result = await cache.get({ type: cacheTypes.TIP_META });
    expect(result).toEqual(dummyUserTipsMeta);
  });

  test("should set and get LEADERBOARD cache correctly", async () => {
    await cache.set({ type: cacheTypes.LEADERBOARD, value: dummyLeaderBoard });

    const result = await cache.get({ type: cacheTypes.LEADERBOARD });
    expect(result).toEqual(dummyLeaderBoard);
  });

  test("should flush USER cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER,
      key: userKey1,
      value: dummyUser1,
    });

    await cache.flush({ type: cacheTypes.USER, key: userKey1 });

    const result = await cache.get({ type: cacheTypes.USER, key: userKey1 });
    expect(result).toBeNull();
  });

  test("should flush TIP_META cache correctly", async () => {
    await cache.set({ type: cacheTypes.TIP_META, value: dummyUserTipsMeta });

    await cache.flush({ type: cacheTypes.TIP_META });

    const result = await cache.get({ type: cacheTypes.TIP_META });
    expect(result).toBeNull();
  });

  test("should flush LEADERBOARD cache correctly", async () => {
    await cache.set({ type: cacheTypes.LEADERBOARD, value: dummyLeaderBoard });

    await cache.flush({ type: cacheTypes.LEADERBOARD });

    const result = await cache.get({ type: cacheTypes.LEADERBOARD });
    expect(result).toBeNull();
  });

  test("should flush all USER cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER,
      key: userKey1,
      value: dummyUser1,
    });
    await cache.set({
      type: cacheTypes.USER,
      key: userKey2,
      value: dummyUser2,
    });

    await cache.flush({ type: cacheTypes.USER });

    const result1 = await cache.get({ type: cacheTypes.USER, key: userKey1 });
    const result2 = await cache.get({ type: cacheTypes.USER, key: userKey2 });
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  test("should selectively flush USER cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER,
      key: userKey1,
      value: dummyUser1,
    });
    await cache.set({
      type: cacheTypes.USER,
      key: userKey2,
      value: dummyUser2,
    });

    await cache.flush({ type: cacheTypes.USER, key: userKey1 });

    const result1 = await cache.get({ type: cacheTypes.USER, key: userKey1 });
    const result2 = await cache.get({ type: cacheTypes.USER, key: userKey2 });

    expect(result1).toBeNull();
    expect(result2).toEqual(dummyUser2);
  });

  test("should set and get USER_TIPS cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER_TIPS,
      key: userTipsKey,
      value: dummyUserTips,
    });

    const result = await cache.get({
      type: cacheTypes.USER_TIPS,
      key: userTipsKey,
    });
    expect(result).toEqual(dummyUserTips);
  });

  test("should flush USER_TIPS cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER_TIPS,
      key: userTipsKey,
      value: dummyUserTips,
    });

    await cache.flush({ type: cacheTypes.USER_TIPS, key: userTipsKey });

    const result = await cache.get({
      type: cacheTypes.USER_TIPS,
      key: userTipsKey,
    });
    expect(result).toBeNull();
  });

  test("should flush all USER_TIPS cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER_TIPS,
      key: userTipsKey,
      value: dummyUserTips,
    });
    await cache.set({
      type: cacheTypes.USER_TIPS,
      key: userTipsKey + 1,
      value: dummyUserTips,
    });

    await cache.flush({ type: cacheTypes.USER_TIPS });

    const result1 = await cache.get({
      type: cacheTypes.USER_TIPS,
      key: userTipsKey,
    });

    const result2 = await cache.get({
      type: cacheTypes.USER_TIPS,
      key: userTipsKey + 1,
    });

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
