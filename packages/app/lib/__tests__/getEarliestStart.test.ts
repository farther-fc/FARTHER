import { getEarliestStart } from "@lib/getEarliestStart";

// Mock type to match NonNullable<GetUserOuput>["allocations"]
type Allocation = {
  airdrop?: {
    startTime?: string;
  };
};

describe("getEarliestStart", () => {
  it("should return the earliest startTime from different days", () => {
    const allocations: Allocation[] = [
      { airdrop: { startTime: "2024-05-20T10:00:00Z" } },
      { airdrop: { startTime: "2024-05-18T08:00:00Z" } },
      { airdrop: { startTime: "2021-05-19T12:00:00Z" } },
    ];

    const result = getEarliestStart(allocations as any);
    expect(result).toBe(new Date("2021-05-19T12:00:00Z").getTime());
  });

  it("should return the earliest startTime from different times", () => {
    const allocations: Allocation[] = [
      { airdrop: { startTime: "2024-05-20T08:00:02Z" } },
      { airdrop: { startTime: "2024-05-20T08:00:00Z" } },
      { airdrop: { startTime: "2024-05-20T08:00:01Z" } },
    ];

    const result = getEarliestStart(allocations as any);
    expect(result).toBe(new Date("2024-05-20T08:00:00Z").getTime());
  });

  it("should handle allocations with some undefined startTime", () => {
    const allocations: Allocation[] = [
      { airdrop: { startTime: "2024-05-20T10:00:00Z" } },
      { airdrop: { startTime: undefined } },
      { airdrop: { startTime: "2024-05-19T12:00:00Z" } },
    ];

    const result = getEarliestStart(allocations as any);
    expect(result).toBe(new Date("2024-05-19T12:00:00Z").getTime());
  });

  it("should handle allocations with no airdrop object", () => {
    const allocations: Allocation[] = [
      { airdrop: { startTime: "2024-05-20T10:00:00Z" } },
      {},
      { airdrop: { startTime: "2024-05-19T12:00:00Z" } },
    ];

    const result = getEarliestStart(allocations as any);
    expect(result).toBe(new Date("2024-05-19T12:00:00Z").getTime());
  });

  it("should return null for an empty array", () => {
    const allocations: Allocation[] = [];

    const result = getEarliestStart(allocations as any);
    expect(result).toBe(null);
  });

  it("should return null if all startTimes are undefined or absent", () => {
    const allocations: Allocation[] = [
      { airdrop: { startTime: undefined } },
      {},
      { airdrop: {} },
    ];

    const result = getEarliestStart(allocations as any);
    expect(result).toBe(null);
  });
});
