import { cacheTypes } from "@farther/common";
import {
  dummyLeaderBoard,
  dummyUser,
  dummyUserTips,
  dummyUserTipsMeta,
} from "@lib/__tests__/testData";
import { cache } from "@lib/cache";
import kv from "@vercel/kv";

// Mock data for testing
const user1Id = 123;
const user1Data = { ...dummyUser, fid: user1Id };
const user1TipsData = { ...dummyUserTips, fid: user1Id };
const user2Id = 456;
const user2Data = { ...dummyUser, fid: user2Id };
const userTipsId = 789;

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
      id: user1Id,
      value: user1Data,
    });

    const result = await cache.get({ type: cacheTypes.USER, id: user1Id });
    expect(result).toEqual(user1Data);
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
      id: user1Id,
      value: user1Data,
    });

    await cache.flush({ type: cacheTypes.USER, ids: [user1Id] });

    const result = await cache.get({ type: cacheTypes.USER, id: user1Id });
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
      id: user1Id,
      value: user1Data,
    });
    await cache.set({
      type: cacheTypes.USER,
      id: user2Id,
      value: user2Data,
    });

    await cache.flush({ type: cacheTypes.USER });

    const result1 = await cache.get({ type: cacheTypes.USER, id: user1Id });
    const result2 = await cache.get({ type: cacheTypes.USER, id: user2Id });
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  test("should selectively flush USER cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER,
      id: user1Id,
      value: user1Data,
    });
    await cache.set({
      type: cacheTypes.USER,
      id: user2Id,
      value: user2Data,
    });

    const preFlushResult1 = await cache.get({
      type: cacheTypes.USER,
      id: user1Id,
    });
    const preFlushResult2 = await cache.get({
      type: cacheTypes.USER,
      id: user2Id,
    });

    expect(preFlushResult1).toEqual(user1Data);
    expect(preFlushResult2).toEqual(user2Data);

    await cache.flush({ type: cacheTypes.USER, ids: [user1Id] });

    const postFlushResult1 = await cache.get({
      type: cacheTypes.USER,
      id: user1Id,
    });
    const postFlushResult2 = await cache.get({
      type: cacheTypes.USER,
      id: user2Id,
    });

    expect(postFlushResult1).toBeNull();
    expect(postFlushResult2).toEqual(user2Data);
  });

  test("should set and get USER_TIPS cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: userTipsId,
      value: user1TipsData,
    });

    const result = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: userTipsId,
    });
    expect(result).toEqual(user1TipsData);
  });

  test("should flush USER_TIPS cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: userTipsId,
      value: user1TipsData,
    });

    await cache.flush({ type: cacheTypes.USER_TIPS, ids: [userTipsId] });

    const result = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: userTipsId,
    });
    expect(result).toBeNull();
  });

  test("should flush all USER_TIPS cache correctly", async () => {
    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: userTipsId,
      value: user1TipsData,
    });
    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: userTipsId + 1,
      value: user1TipsData,
    });

    await cache.flush({ type: cacheTypes.USER_TIPS });

    const result1 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: userTipsId,
    });

    const result2 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: userTipsId + 1,
    });

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  test("should selectively flush USER cache when context is supplied", async () => {
    const context1 = [1, 5, null, "hello"];
    const context2 = [3, "world"];

    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      value: user1TipsData,
      context: context1,
    });

    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      value: user1TipsData,
      context: context2,
    });

    // Flush the first context
    await cache.flush({
      type: cacheTypes.USER_TIPS,
      ids: [user1Id],
      context: context1,
    });

    const result1 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      context: context1,
    });

    const result2 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      context: context2,
    });

    expect(result1).toBeNull();

    // Context 2 should still be present
    expect(result2).toBeTruthy();
  });

  test("should flush all USER_TIPS for a given FID correctly", async () => {
    const context1 = [1, 5, null, "hello"];
    const context2 = [5, 1, "hello", null];
    const context3 = [8, 3, null, "world"];

    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      value: user1TipsData,
      context: context1,
    });

    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      value: user1TipsData,
      context: context2,
    });

    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      value: user1TipsData,
      context: context3,
    });

    await cache.flush({ type: cacheTypes.USER_TIPS, ids: [user1Id] });

    const result1 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      context: context1,
    });

    const result2 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      context: context2,
    });

    const result3 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      context: context3,
    });

    expect(result1).toBeNull();
    expect(result2).toBeNull();
    expect(result3).toBeNull();
  });

  test("should flush a large number of USER cache keys using SCAN correctly", async () => {
    const largeNumberOfKeys = 1000;
    const promises = [];

    for (let i = 0; i < largeNumberOfKeys; i++) {
      promises.push(
        cache.set({
          type: cacheTypes.USER,
          id: i,
          value: { ...user1Data, fid: i },
        }),
      );
    }
    await Promise.all(promises);

    // Ensure the keys are set correctly
    for (let i = 0; i < largeNumberOfKeys; i++) {
      const result = await cache.get({ type: cacheTypes.USER, id: i });
      expect(result).toEqual({ ...user1Data, fid: i });
    }

    // Flush all USER cache keys
    await cache.flush({ type: cacheTypes.USER });

    // Ensure all USER cache keys are flushed
    for (let i = 0; i < largeNumberOfKeys; i++) {
      const result = await cache.get({ type: cacheTypes.USER, id: i });
      expect(result).toBeNull();
    }
  }, 30_000);

  test("should flush a list of ids", async () => {
    await cache.set({
      type: cacheTypes.USER,
      id: user1Id,
      value: user1Data,
    });
    await cache.set({
      type: cacheTypes.USER,
      id: user2Id,
      value: user2Data,
    });

    await cache.flush({ type: cacheTypes.USER, ids: [user1Id, user2Id] });

    const result1 = await cache.get({ type: cacheTypes.USER, id: user1Id });
    const result2 = await cache.get({ type: cacheTypes.USER, id: user2Id });
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  test("flush doesn't throw error when no keys are present", async () => {
    await expect(
      cache.flush({ type: cacheTypes.USER, ids: [1309712] }),
    ).resolves.not.toThrow();
  });
});
