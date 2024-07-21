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
const user1Id = "123";
const user1Data = { ...dummyUser, fid: parseInt(user1Id) };
const user1TipsData = { ...dummyUserTips, fid: parseInt(user1Id) };
const user2Id = "456";
const user2Data = { ...dummyUser, fid: parseInt(user2Id) };
const user2TipsData = { ...dummyUserTips, fid: parseInt(user2Id) };
const userTipsId = "789";

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

    await cache.flush({ type: cacheTypes.USER, id: user1Id });

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

    await cache.flush({ type: cacheTypes.USER, id: user1Id });

    const result1 = await cache.get({ type: cacheTypes.USER, id: user1Id });
    const result2 = await cache.get({ type: cacheTypes.USER, id: user2Id });

    expect(result1).toBeNull();
    expect(result2).toEqual(user2Data);
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

    await cache.flush({ type: cacheTypes.USER_TIPS, id: userTipsId });

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

  test("should flush all USER_TIPS for a given FID correctly", async () => {
    const alteredTipsData = {
      fid: parseInt(user1Id),
      tips: user1TipsData.tips.map((tip) => ({
        ...tip,
        createdAt: new Date().toISOString(),
      })),
      nextCursor: 197303,
    };

    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      value: user1TipsData,
    });

    await cache.set({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
      value: alteredTipsData,
    });

    await cache.flush({ type: cacheTypes.USER_TIPS, id: user1Id });

    const result1 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: user1Id,
    });

    const result2 = await cache.get({
      type: cacheTypes.USER_TIPS,
      id: `FID:${user1Id}${alteredTipsData.nextCursor}`,
    });

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
