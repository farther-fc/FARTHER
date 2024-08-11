import { retryWithExponentialBackoff } from "../utils";

describe("retryWithExponentialBackoff", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("should return result when function succeeds on first try", async () => {
    const mockFn = jest.fn().mockResolvedValue("success");
    const resultPromise = retryWithExponentialBackoff(mockFn);

    jest.runAllTimers();
    await Promise.resolve();

    const result = await resultPromise;
    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("should retry the specified number of times on failure", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValueOnce(new Error("fail1"))
      .mockRejectedValueOnce(new Error("fail2"))
      .mockResolvedValueOnce("success");

    const resultPromise = retryWithExponentialBackoff(mockFn, {
      retries: 3,
      delay: 1000,
    });

    jest.advanceTimersByTime(1000); // First retry delay
    await Promise.resolve();

    jest.advanceTimersByTime(2000); // Second retry delay (exponential backoff)
    await Promise.resolve();

    jest.advanceTimersByTime(4000);
    await Promise.resolve();

    jest.runAllTimers();

    const result = await resultPromise;
    expect(result).toBe("success");
    expect(mockFn).toHaveBeenCalledTimes(3);
  }, 999999);

  test("should throw an error after exhausting retries", async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error("fail"));
    const resultPromise = retryWithExponentialBackoff(mockFn, {
      retries: 3,
      delay: 1000,
    });

    jest.advanceTimersByTime(1000); // First retry delay
    await Promise.resolve();

    jest.advanceTimersByTime(2000); // Second retry delay (exponential backoff)
    await Promise.resolve(); // Ensure all promises are resolved

    jest.advanceTimersByTime(4000); // Third retry delay (exponential backoff)
    await Promise.resolve();

    jest.runAllTimers();

    await expect(resultPromise).rejects.toThrow("fail");
    expect(mockFn).toHaveBeenCalledTimes(3);
  }, 999999);

  afterAll(() => {
    jest.useRealTimers();
  });
});
