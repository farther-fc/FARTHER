import { extractTweetId, isValidTweetUrl } from "@lib/utils";

describe("tweet validation", () => {
  test("isValidTweetUrl", () => {
    // Test cases
    expect(
      isValidTweetUrl(
        "https://twitter.com/username/status/1234567890123456789",
      ) === true,
    );
    expect(
      isValidTweetUrl(
        "https://twitter.com/username/status/1234567890123456789?src=hashtag_click",
      ) === true,
    );
    expect(
      isValidTweetUrl(
        "https://twitter.com/geaux_eth/status/1785710293361823917?t=_NXAYvSBhoa3ruPFVt-36A",
      ) === true,
    );
    expect(
      isValidTweetUrl("https://x.com/username/status/1234567890") === true,
    );
    expect(isValidTweetUrl("https://twitter.com/username/status/") === false);
    expect(
      isValidTweetUrl("https://twitter.com/username/status/abc") === false,
    );
  });

  test("extractTweetId", () => {
    expect(
      extractTweetId(
        "https://twitter.com/username/status/1234567890123456789",
      ) === "1234567890123456789",
    ); // Should print '1234567890123456789'
    expect(
      extractTweetId(
        "https://twitter.com/geaux_eth/status/1785710293361823917?t=_NXAYvSBhoa3ruPFVt-36A",
      ) === "1785710293361823917",
    ); // Should print '1234567890123456789'
    expect(
      typeof extractTweetId(
        "https://twitter.com/username/status/abc?src=tag&ref=tweet",
      ) === null,
    ); // Should print null
  });
});
