import { OPENRANK_SNAPSHOT_CRON } from "@farther/common";
import { getLatestCronTime } from "../getLatestCronTime";

describe("getLatestCronTime", () => {
  test("returns 3am of the same day if the current time is between 3am and 3pm", () => {
    mockDate("2024-07-08T05:05:00Z");
    const latestCronTime = getLatestCronTime(OPENRANK_SNAPSHOT_CRON);
    jest.useRealTimers();
    expect(latestCronTime).toEqual(new Date("2024-07-08T03:00:00Z"));
  });

  test("returns 3pm of the same day if the current time is after 3pm", () => {
    mockDate("2024-07-08T20:00:00Z"); // 8pm UTC (example)
    const latestCronTime = getLatestCronTime(OPENRANK_SNAPSHOT_CRON);
    jest.useRealTimers();
    expect(latestCronTime).toEqual(new Date("2024-07-08T15:00:00Z"));
  });

  test("returns 3pm of the previous day if the current time is before 3am", () => {
    mockDate("2024-07-08T01:00:00Z"); // 1am UTC (example)
    const latestCronTime = getLatestCronTime(OPENRANK_SNAPSHOT_CRON);
    jest.useRealTimers();
    expect(latestCronTime).toEqual(new Date("2024-07-07T21:00:00Z"));
  });

  test("handles multiple cron hours correctly", () => {
    mockDate("2024-07-08T06:01:00Z");
    const cron = "0 2,4,6,8 * * *";
    const time1 = getLatestCronTime(cron);
    jest.useRealTimers();
    expect(time1).toEqual(new Date("2024-07-08T06:00:00Z"));

    mockDate("2024-07-08T11:15:00Z");
    const time2 = getLatestCronTime(cron);
    jest.useRealTimers();
    expect(time2).toEqual(new Date("2024-07-08T08:00:00Z"));
  });
});

function mockDate(isoDate: string) {
  jest.useFakeTimers().setSystemTime(new Date(isoDate));
}