import { publicProcedure } from "server/trpc";
import { apiSchemas } from "@lib/types/apiSchemas";
import { TRPCError } from "@trpc/server";
import { prisma } from "@farther/backend";
import { BASE_TOKENS_PER_TWEET, WAD_SCALER } from "@farther/common";
import { scaleLog } from "d3-scale";

if (!process.env.TWITTER_BEARER_TOKEN) {
  throw new Error("TWITTER_BEARER_TOKEN not set");
}

const twitterConfig = {
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
  },
};

export const validateTweet = publicProcedure
  .input(apiSchemas.validateTweet.input)
  .mutation(async (opts) => {
    const { tweetId, fid } = opts.input;

    let tweetAuthorId: string;
    let tweetText: string;

    try {
      const response = await fetch(
        `https://api.twitter.com/2/tweets?ids=${tweetId}&tweet.fields=text,author_id`,
        twitterConfig,
      );

      const data = await response.json();

      if (!data.data.length) {
        throw new Error("No data returned from tweets api");
      }

      tweetText = data.data[0].text as string;
      tweetAuthorId = data.data[0].author_id as string;
    } catch (error) {
      // TODO: sentry
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Unable to retrieve tweet. Please check the URL and try again.`,
      });
    }

    // Get user
    const user = await prisma.user.findFirst({
      where: {
        fid,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `User not found`,
      });
    }

    const { isValid, reason } = verifyTweetText({ tweetText, fid: user.fid });

    if (isValid) {
      let followerCount;

      // Fetch user's follower count
      const response = await fetch(
        `https://api.twitter.com/2/users/${tweetAuthorId}?user.fields=public_metrics`,
        twitterConfig,
      );

      const data = await response.json();

      followerCount = data.data.public_metrics.followers_count as number;

      const allocation = getEvanglistAllocation({ followerCount });

      // Store allocation
      await prisma.allocation.create({
        data: {
          type: "EVANGELIST",
          amount: allocation.toString(),
          tweet: {
            create: {
              tweetId,
            },
          },
          user: {
            connect: {
              fid,
            },
          },
        },
      });
    }

    return { isValid, reason };
  });

function verifyTweetText({
  tweetText,
  fid,
}: {
  tweetText: string;
  fid: number;
}) {
  const hasFarcaster = /farcaster/i.test(tweetText);
  const fidPattern = new RegExp(`FID${fid}`, "i");
  const hasFID = fidPattern.test(tweetText);

  if (!hasFarcaster) {
    return {
      isValid: false,
      reason: `Tweet is missing "farcaster". Please check it and try again.`,
    };
  }
  if (!hasFID) {
    return {
      isValid: false,
      reason: `Tweet is missing FID<Farcaster ID> or ID is incorrect. Please check it and try again.`,
    };
  }
  return { isValid: true };
}

function getEvanglistAllocation({ followerCount }: { followerCount: number }) {
  const MINIMUM_FOLLOWER_COUNT = 100;
  const MAXIMUM_FOLLOWER_COUNT = 30_000_000;

  const scalingFn = scaleLog()
    .domain([MINIMUM_FOLLOWER_COUNT, MAXIMUM_FOLLOWER_COUNT])
    .range([BASE_TOKENS_PER_TWEET, BASE_TOKENS_PER_TWEET * 30])
    .clamp(true);

  return BigInt(BASE_TOKENS_PER_TWEET + scalingFn(followerCount)) * WAD_SCALER;
}
