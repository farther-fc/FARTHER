import { allocateTokens } from "../src/utils/allocateTokens";

function randomInt() {
  return Math.floor(Math.random() * 10000);
}

describe("Token Allocation Tests", () => {
  // Define users and total supply
  const users = [
    { fid: 1, followers: randomInt() },
    { fid: 2, followers: randomInt() },
    { fid: 3, followers: randomInt() },
    { fid: 4, followers: randomInt() },
    { fid: 5, followers: randomInt() },
    { fid: 5, followers: randomInt() },
    { fid: 5, followers: randomInt() },
    { fid: 5, followers: randomInt() },
    { fid: 5, followers: randomInt() },
  ];

  const totalSupply = randomInt() * randomInt();

  // Allocate tokens
  const updatedUsers = allocateTokens(users, totalSupply);

  // Calculate the sum of all allocated tokens
  const totalAllocatedTokens = updatedUsers.reduce(
    (sum, user) => sum + user.allocation,
    0,
  );

  test("Total supply of tokens should not be exceeded", () => {
    // Assert that total allocated tokens does not exceed the total supply
    expect(totalAllocatedTokens).toBeLessThanOrEqual(totalSupply);
  });

  test("Users don't all have the same number of tokens", () => {
    const uniqueAllocations = new Set(
      updatedUsers.map((user) => user.allocation),
    );

    expect(uniqueAllocations.size).toBeGreaterThan(1);
  });

  test("The number of token allocated doesn't deviate from the total supply by more than 1", () => {
    const deviation = Math.abs(totalSupply - totalAllocatedTokens);
    expect(deviation).toBeLessThanOrEqual(1);
  });
});
