import { InvalidTipReason } from "@farther/backend";
import { invalidTipReasons } from "@lib/constants";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { requireEnv } from "require-env-variable";

const { NEYNAR_TIP_BOT_API_KEY, TIP_BOT_UUID } = requireEnv(
  "NEYNAR_TIP_BOT_API_KEY",
  "TIP_BOT_UUID",
);

interface CastData {
  data: {
    parent_hash: string | null;
    hash: string;
    parent_author: { fid: number } | null;
    author: { fid: number };
    text: string;
  };
}

const neynarClient = new NeynarAPIClient(NEYNAR_TIP_BOT_API_KEY);

function parseCastData(cast: CastData) {
  if (!cast.data.parent_hash || !cast.data.parent_author) {
    return null;
  }

  const hash = cast.data.hash;

  const toFid = cast.data.parent_author.fid;
  const fromFid = cast.data.author.fid;

  const tipRegex =
    /(\d+(?:\.\d+)?)\s*(?:\$(f|F)(a|A)(r|R)(t|T)(h|H)(e|E)(r|R)|((f|F)(a|A)(r|R)(t|T)(h|H)(e|E)(r|R)))/;
  const match = cast.data.text.match(tipRegex);
  console.log(cast.data.text);

  if (!match) {
    return null;
  }

  const tipAmount = Math.round(parseFloat(match[1]));

  return {
    toFid,
    fromFid,
    tipAmount,
    hash,
  };
}

async function fartherByFid(fid: number) {
  // const baseUrl = "https://farther.social/api/v1/public.user.byFid";
  // const params = { fid: fid };
  // const queryString = encodeURIComponent(JSON.stringify(params));
  // const url = `${baseUrl}?input=${queryString}`;
  // try {
  //   const response = await axios.get(url);
  //   const data = response.data;
  //   console.log(`data fetched from farther api for fid ${fid}:`);
  //   const allowance = data.result.data.tips.currentCycle.allowance;
  //   let remainingAllowance =
  //     data.result.data.tips.currentCycle.remainingAllowance;
  //   if (
  //     remainingAllowance === null &&
  //     data.result.data.tips.currentCycle.givenAmount === 0
  //   ) {
  //     remainingAllowance = allowance;
  //   }
  //   const tipMinimum = data.result.data.tips.currentCycle.tipMinimum;
  //   return {
  //     allowance,
  //     remainingAllowance,
  //     tipMinimum,
  //   };
  // } catch (error) {
  //   console.error("Error fetching data:", error);
  //   return null;
  // }
}

const BAR_LENGTH = 10;

function createProgressBar({
  progress,
  total,
}: {
  progress: number;
  total: number;
  barLength?: number;
}) {
  if (total === 0 || progress > total) {
    progress = 100;
    total = 100;
  }

  const completedLength = Math.round((BAR_LENGTH * progress) / total);
  const remainingLength = BAR_LENGTH - completedLength;

  let completedEmoji = "🟩";
  if (completedLength >= 8) {
    completedEmoji = "🟧";
  } else if (completedLength > 6) {
    completedEmoji = "🟨";
  }

  const completedBar = completedEmoji.repeat(completedLength);
  const remainingBar = "⬜".repeat(remainingLength);

  const progressBar = completedBar + remainingBar;

  return progressBar;
}

export async function tipBot({
  tipper,
  tippee,
  tipAmount,
  allowance,
  invalidTipReason,
  amountTippedThisCycle,
}: {
  tipper: string;
  tippee: string;
  tipAmount: number;
  allowance: number;
  invalidTipReason: InvalidTipReason | null;
  amountTippedThisCycle: number;
}) {
  const remainingAllowance = allowance - amountTippedThisCycle;

  let message = ``;

  if (invalidTipReason) {
    message += `🚫 Invalid tip from @${tipper} to @${tippee}\n\nAmount: ${strikeThrough(tipAmount)} ✨\nRemaining: ${remainingAllowance} ✨`;

    const invalidMessage = invalidTipReasons[invalidTipReason];

    message += `\n\n🚫 ${invalidMessage}`;
  } else {
    message += `✅ Valid tip from @${tipper} to @${tippee}\n\nAmount: ${tipAmount} ✨\nRemaining: ${remainingAllowance} ✨`;
  }

  const percentage = Math.round((amountTippedThisCycle / allowance) * 100);

  message += `

${amountTippedThisCycle.toLocaleString()} / ${allowance.toLocaleString()} (${percentage}%)
`;

  // progress bar
  let progressBar;
  if (remainingAllowance === 0) {
    if (invalidTipReason) {
      progressBar = "🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑";
    } else {
      progressBar = "✅✅✅✅✅✅✅✅✅✅";
    }
  } else {
    progressBar = createProgressBar({
      progress: amountTippedThisCycle,
      total: allowance,
    });
  }

  message += progressBar;

  console.log(message);

  await neynarClient.publishCast(TIP_BOT_UUID, message, {
    // replyTo: replyData.tipData.hash,
    // embeds: [
    //   {
    //     url: "https://farther.social",
    //   },
    // ],
  });
}

function strikeThrough(text: string | number) {
  return text
    .toString()
    .split("")
    .map((char) => char + "\u0336")
    .join("");
}
