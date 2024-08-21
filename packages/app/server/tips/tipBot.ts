import { InvalidTipReason } from "@farther/backend";
import { ENVIRONMENT, TIP_MINIMUM } from "@farther/common";
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
  availableAllowance,
  invalidTipReason,
  amountTippedThisCycle,
  tipHash,
  allowableAmount,
}: {
  tipper: string;
  tippee: string;
  tipAmount: number;
  availableAllowance: number;
  invalidTipReason: InvalidTipReason | null;
  amountTippedThisCycle: number;
  tipHash: string;
  // Used for invalid tips where a smaller amount would make the current tip valid
  allowableAmount?: number;
}) {
  if (ENVIRONMENT !== "production") {
    console.error("TipBot is disabled in non-production environments");
    return;
  }

  const remainingAllowance = availableAllowance - amountTippedThisCycle;

  let message = ``;

  const amountAndRemaining = `\n\nTip amount: ${tipAmount} ✨\nRemaining: ${remainingAllowance} ✨`;

  if (invalidTipReason) {
    message += `🚫 Invalid tip from @${tipper} to @${tippee}`;

    const invalidMessage = invalidTipReasons[invalidTipReason];

    message += `\n\n${invalidMessage}`;

    if (allowableAmount) {
      message +=
        allowableAmount >= TIP_MINIMUM
          ? `. Reduce the amount to ${allowableAmount} for this tip to be valid.`
          : `. The allowed amount (${allowableAmount}) is below the tip minimum (${TIP_MINIMUM}).`;
    }

    message += amountAndRemaining;
  } else {
    message += `✅ Valid tip from @${tipper} to @${tippee}${amountAndRemaining}`;
  }

  const percentage = Math.round(
    (amountTippedThisCycle / availableAllowance) * 100,
  );

  if (!invalidTipReason) {
    const progressBar = createProgressBar({
      progress: amountTippedThisCycle,
      total: availableAllowance,
    });

    message += `\n\n${amountTippedThisCycle.toLocaleString()} ✨ / ${availableAllowance.toLocaleString()} ✨ (${percentage}%)\n`;
    message += progressBar;
  }

  await neynarClient.publishCast(TIP_BOT_UUID, message, {
    replyTo: tipHash,
    // embeds: [
    //   {
    //     url: "https://farther.social/tips",
    //   },
    // ],
  });
}
