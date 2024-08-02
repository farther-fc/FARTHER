import { HANDLE_TIP_REGEX_PROD } from "@farther/common";

describe("Regex Tests", () => {
  const testCases = [
    { input: "420 farther", expected: true },
    { input: "43   FARTHER", expected: true },
    { input: "100$farther", expected: true },
    { input: "2999$FArThER", expected: true },
    { input: "2999 farther$", expected: true },
    { input: "farther 420", expected: false },
    { input: "100farther", expected: true },
    { input: "2999$farther123", expected: true },
    { input: "farther", expected: false },
    { input: "90 $ farther", expected: false },
  ];

  testCases.forEach(({ input, expected }, index) => {
    test(`Test case ${index + 1}: "${input}"`, () => {
      expect(HANDLE_TIP_REGEX_PROD.test(input)).toBe(expected);
    });
  });
});
