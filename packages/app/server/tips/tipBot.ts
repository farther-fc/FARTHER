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
  if (completedLength === BAR_LENGTH) {
    completedEmoji = "🟩";
  } else if (completedLength >= 8) {
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

  const amountAndRemaining = `\n\nTip amount: ${tipAmount} ✨\nRemaining: ${remainingAllowance} ✨`;

  if (invalidTipReason) {
    message += `🚫 Invalid tip from @${tipper} to @${tippee}`;

    const invalidMessage = invalidTipReasons[invalidTipReason];

    message += `\n\nReason: ${invalidMessage}${amountAndRemaining}`;
  } else {
    message += `✅ Valid tip from @${tipper} to @${tippee}${amountAndRemaining}`;
  }

  const percentage = Math.round((amountTippedThisCycle / allowance) * 100);

  if (!invalidTipReason) {
    const progressBar = createProgressBar({
      progress: amountTippedThisCycle,
      total: allowance,
    });

    message += `\n\n${amountTippedThisCycle.toLocaleString()} ✨ / ${allowance.toLocaleString()} ✨ (${percentage}%)\n`;
    message += progressBar;
  }

  console.log(message);

  await neynarClient.publishCast(TIP_BOT_UUID, message, {
    embeds: [
      {
        url: "https://farther.social/tips",
      },
    ],
  });
}
