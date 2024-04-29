import { prisma } from "@farther/backend";
import {
  DEV_USER_TWITTER_ID,
  EVANGELIST_FOLLOWER_MINIMUM,
} from "@farther/common";
import { apiSchemas } from "@lib/types/apiSchemas";
import { TRPCError } from "@trpc/server";
import { getEvanglistAllocation } from "server/evangelize/getEvangelistAllocation";
import { publicProcedure } from "server/trpc";

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

    // let isValid: boolean;
    // let reason: string | undefined;
    let tweetAuthorId: string;
    let tweetText: string;

    // Check for exact match in database
    const existingTweet = await prisma.tweet.findFirst({
      where: {
        id: tweetId,
      },
    });

    // Get user's tweets from the past three days
    const pastTweets = await prisma.tweet.findMany({
      where: {
        allocation: {
          user: {
            fid,
          },
        },
        createdAt: {
          gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      },
    });

    if (pastTweets.length >= 1) {
      return {
        isValid: false,
        reason: `Your evangelism is commendable! However, please wait to submit until three days after your latest submission. ❤️`,
      };
    }

    if (existingTweet) {
      return { isValid: false, reason: "That tweet was already submitted 😉" };
    }

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

      console.log({ tweetAuthorId });

      const data = await response.json();

      followerCount = data.data.public_metrics.followers_count as number;

      if (
        followerCount < EVANGELIST_FOLLOWER_MINIMUM &&
        tweetAuthorId !== DEV_USER_TWITTER_ID
      ) {
        return {
          isValid: false,
          reason: `Sorry, your Twitter account must have at least ${EVANGELIST_FOLLOWER_MINIMUM} followers to qualify.`,
        };
      }

      const amount = getEvanglistAllocation({ followerCount });

      // Look for existing pending allocation
      const pendingAllocation = await prisma.allocation.findFirst({
        where: {
          userId: user.id,
          type: "EVANGELIST",
          airdropId: null,
        },
      });

      if (pendingAllocation) {
        // Create tweet
        await prisma.$transaction(async (tx) => {
          const tweet = await tx.tweet.create({
            data: {
              id: tweetId,
              reward: amount.toString(),
              allocationId: pendingAllocation.id,
            },
          });

          await tx.allocation.update({
            where: {
              id: pendingAllocation.id,
            },
            data: {
              amount: (BigInt(pendingAllocation.amount) + amount).toString(),
              tweets: {
                connect: {
                  id: tweet.id,
                },
              },
            },
          });
        });
      } else {
        // Store allocation
        await prisma.allocation.create({
          data: {
            type: "EVANGELIST",
            amount: amount.toString(),
            tweets: {
              create: {
                id: tweetId,
                reward: amount.toString(),
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
