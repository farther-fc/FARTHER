import {
  ACTIVE_TIP_DAYS_REQUIRED,
  FARTHER_OWNER_FID,
  OPENRANK_SNAPSHOT_INTERVAL,
  TIPPER_OPENRANK_THRESHOLD_REQUIREMENT,
  dayUTC,
  getOpenRankScores,
  getStartOfMonthUTC,
} from "@farther/common";
import Decimal from "decimal.js";
import { writeFile } from "fs/promises";
import { getLatestOpenRankScores } from "../lib/getLatestOpenRankScores";
import { getTipScores } from "../lib/utils/getTipScores";
import { dbScheduler } from "../lib/utils/helpers";
import { prisma } from "../prisma";

export const activeTipDaysRulesStartTime = dayUTC("2024-08-08");

export async function getRawLeaderboard(now = dayUTC()) {
  return await prisma.user.findMany({
    where: {
      id: {
        not: FARTHER_OWNER_FID,
      },
      tipsGiven: {
        some: {
          invalidTipReason: null,
          createdAt: {
            // TODO: change this to whenever snapshot happens!
            gte: getStartOfMonthUTC(0),
            lt: now.toDate(),
          },
        },
      },
      isBanned: false,
    },
    select: {
      id: true,
      username: true,
      displayName: true,
      pfpUrl: true,
      powerBadge: true,
      tipperScores: {
        where: {
          createdAt: {
            // TODO: change this to whenever snapshot happens!
            gte: getStartOfMonthUTC(0),
            lt: now.toDate(),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      tipsGiven: {
        where: {
          invalidTipReason: null,
          createdAt: {
            gte: getStartOfMonthUTC(0),
            lt: now.toDate(),
          },
        },
      },
      tipAllowances: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
          amount: true,
          tipMetaId: true,
          tips: {
            where: {
              invalidTipReason: null,
            },
            select: {
              amount: true,
            },
          },
        },
      },
    },
  });
}

export async function getFilteredTippers(
  tippers: Awaited<ReturnType<typeof getRawLeaderboard>>,
  now = dayUTC(),
) {
  // TODO: Remove after 8/13/2024 (will no longer be needed then)
  const openRankData = (
    await getOpenRankScores({
      fids: tippers.map((t) => t.id),
      type: "FOLLOWING",
      rateLimit: 10,
    })
  ).filter((score) => score.rank < TIPPER_OPENRANK_THRESHOLD_REQUIREMENT);

  const openRankFids = openRankData.map((data) => data.fid);

  const orFollowingRankMap = new Map(
    openRankData.map((data) => [data.fid, data.rank]),
  );

  return tippers
    .map((user) => ({
      user,
      orFollowingRank: orFollowingRankMap.get(user.id),
    }))
    .filter((tipper) => {
      const totalActiveDays = new Set(
        tipper.user.tipsGiven.map((t) => t.tipAllowanceId),
      ).size;

      const firstTip = tipper.user.tipsGiven.reduce((acc, t) => {
        if (t.createdAt < acc) {
          return t.createdAt;
        }
        return acc;
      }, tipper.user.tipsGiven[0].createdAt);

      // Must meet threshold if they started tipping more than ACTIVE_TIP_DAYS_REQUIRED days ago
      const requireActiveDaysThreshold =
        dayUTC(now).diff(firstTip, "day", true) > ACTIVE_TIP_DAYS_REQUIRED;

      return (
        openRankFids.includes(tipper.user.id) &&
        (requireActiveDaysThreshold
          ? totalActiveDays >= ACTIVE_TIP_DAYS_REQUIRED
          : true)
      );
    });
}

export async function getTippersForLeaderboard() {
  const rawTippers = await getRawLeaderboard();
  const tippers = await getFilteredTippers(rawTippers);

  return tippers;
}

async function getTipperAltScore({
  fid,
  username,
}: {
  fid: number;
  username: string | null;
}) {
  const tipperData = await prisma.user.findUnique({
    where: { id: fid },
    include: {
      tipsGiven: {
        where: {
          invalidTipReason: null,
          tippeeOpenRankScore: {
            not: null,
          },
          createdAt: {
            gte: getStartOfMonthUTC(0),
            lt: dayUTC().subtract(OPENRANK_SNAPSHOT_INTERVAL, "hours").toDate(),
          },
        },
      },
    },
  });

  if (!tipperData) {
    throw new Error(`No tipper data found for fid: ${fid}`);
  }

  const tips = tipperData.tipsGiven;

  const tipees = new Set(tips.map((tip) => tip.tippeeId));
  const endScores = await getLatestOpenRankScores(Array.from(tipees));

  const tipScores = getTipScores({
    tips,
    endScores,
  });

  const totalScore = tipScores.reduce(
    (acc, score) => acc.add(score.changePerToken),
    new Decimal(0),
  );

  // Return average
  const tipperScore = totalScore.div(tips.length);

  console.log(`Processed ${username} (${fid})`);

  return {
    fid,
    username,
    tipperScore,
  };
}

(async () => {
  const tippers = await getTippersForLeaderboard();

  const promises = tippers.map(({ user: { id, username } }) =>
    dbScheduler.schedule(() => getTipperAltScore({ fid: id, username })),
  );

  const results = await Promise.all(promises);

  const altScores = results
    .filter((d) => !isNaN(d.tipperScore.toNumber()))
    .sort((a, b) => b.tipperScore.comparedTo(a.tipperScore))
    .map((d, i) => ({ ...d, rank: i + 1 }))
    .map((d, i) => ({ ...d, altRank: i + 1 }));

  await writeFile("altScores.json", JSON.stringify(altScores, null, 2));
})();
