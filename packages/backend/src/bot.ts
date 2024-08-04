import { axios } from "@farther/common";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import express from "express";
import { requireEnv } from "require-env-variable";

// TODO: DELETE THIS AFTER tipBot.ts is live

const { NEYNAR_TIP_BOT_API_KEY, TIP_BOT_UUID } = requireEnv(
  "NEYNAR_TIP_BOT_API_KEY",
  "TIP_BOT_UUID",
);

const neynarClient = new NeynarAPIClient(NEYNAR_TIP_BOT_API_KEY);

const app = express();
const PORT = process.env.PORT || 3100;

app.use(express.json());

interface CastData {
  data: {
    parent_hash: string | null;
    hash: string;
    parent_author: { fid: number } | null;
    author: { fid: number };
    text: string;
  };
}

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
  const baseUrl = "https://farther.social/api/v1/public.user.byFid";
  const params = { fid: fid };
  const queryString = encodeURIComponent(JSON.stringify(params));
  const url = `${baseUrl}?input=${queryString}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(`data fetched from farther api for fid ${fid}:`);
    const allowance = data.result.data.tips.currentCycle.allowance;
    let remainingAllowance =
      data.result.data.tips.currentCycle.remainingAllowance;
    if (
      remainingAllowance === null &&
      data.result.data.tips.currentCycle.givenAmount === 0
    ) {
      remainingAllowance = allowance;
    }
    const tipMinimum = data.result.data.tips.currentCycle.tipMinimum;
    return {
      allowance,
      remainingAllowance,
      tipMinimum,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function createProgressBar(progress: number, total: number, barLength = 10) {
  if (total === 0 || progress > total) {
    progress = 100;
    total = 100;
  }

  const completedLength = Math.round((barLength * progress) / total);
  const remainingLength = barLength - completedLength;

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

async function sendReply(replyData: any) {
  console.log(replyData);

  const percentage = Math.round(
    (replyData.tippedAllowance / replyData.allowance) * 100,
  );

  let reply;

  if (replyData.meetsMinimum) {
    if (replyData.isValid) {
      reply = `✅ ${replyData.tipData.tipAmount}`;
    } else {
      reply = "🚫 0";
    }
    reply += ` tipped ✨ ${replyData.remainingAllowance} remaining`;
  } else {
    reply = `🚫 tip does not meet minumum of ${replyData.tipMinimum}`;
  }

  reply += `

${replyData.tippedAllowance} / ${replyData.allowance} (${percentage}%)
`;

  // progress bar
  let progressBar;
  if (replyData.remainingAllowance === 0) {
    if (replyData.isValid) {
      progressBar = "✅✅✅✅✅✅✅✅✅✅";
    } else {
      progressBar = "🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑";
    }
  } else {
    progressBar = createProgressBar(
      replyData.tippedAllowance,
      replyData.allowance,
    );
  }

  reply += progressBar;

  reply += `\n\nMinimum tip amount: ${replyData.tipMinimum}`;

  console.log(reply);

  if (
    replyData.tipData.fromFid == 243719 ||
    replyData.tipData.fromFid == 4378 ||
    replyData.tipData.fromFid == 429188
  ) {
    // @downshift.eth
    console.log("send...");
    await neynarClient.publishCast(TIP_BOT_UUID, reply, {
      replyTo: replyData.tipData.hash,
      embeds: [
        {
          url: "https://farther.social",
        },
      ],
    });
  }
}

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  const castData = req.body as CastData;
  const tipData = parseCastData(castData);

  if (tipData && tipData.tipAmount > 0) {
    console.log("parsed tip:", tipData);
    const fartherData = await fartherByFid(tipData.fromFid);
    if (fartherData) {
      console.log(fartherData);
      let isValid = false;
      let meetsMinimum = false;
      let remainingAllowance = fartherData.remainingAllowance;
      if (tipData.tipAmount >= fartherData.tipMinimum) {
        meetsMinimum = true;
        remainingAllowance -= tipData.tipAmount;
        if (remainingAllowance > 0) {
          isValid = true;
        } else if (remainingAllowance < 0) {
          remainingAllowance = 0;
        }
      } else {
        // didn't meet minimum amount, no tip sent.
        tipData.tipAmount = 0;
      }

      sendReply({
        tipData,
        isValid,
        allowance: fartherData.allowance,
        tippedAllowance: remainingAllowance
          ? fartherData.allowance - remainingAllowance
          : null,
        remainingAllowance,
        tipMinimum: fartherData.tipMinimum,
        meetsMinimum,
      });
    } else {
      console.log("no data from farther api...");
    }
  } else {
    console.log("not a valid tip cast...");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
