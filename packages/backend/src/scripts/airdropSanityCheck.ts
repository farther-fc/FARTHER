import { ENVIRONMENT, NETWORK, NEXT_AIRDROP_START_TIME } from "@farther/common";
import { prompt } from "enquirer";
import numeral from "numeral";

type Response = {
  answer: string;
};

export async function airdropSanityCheck({
  totalAllocation,
  ratio,
}: {
  totalAllocation?: number;
  ratio?: number;
} = {}) {
  const response1: Response = await prompt({
    type: "input",
    name: "answer",
    message: `The airdrop will be prepared for ${NEXT_AIRDROP_START_TIME.toUTCString()}. Correct? (y/n)`,
  });

  const response2: Response = await prompt({
    type: "input",
    name: "answer",
    message: `The airdrop will be deployed on ${NETWORK} and this is the ${ENVIRONMENT} environment. Correct? (y/n)`,
  });

  let response3: Response = { answer: "n" };
  if (totalAllocation || ratio) {
    const response: Response = await prompt({
      type: "input",
      name: "answer",
      message: `The airdrop will have ${numeral(totalAllocation).format("0,0")} tokens (${ratio * 100}% of the total airdrop supply). Correct? (y/n)`,
    });

    response3 = response;
  }

  if (
    response1.answer !== "y" ||
    response2.answer !== "y" ||
    response3.answer !== "y"
  ) {
    console.info("Exiting script...");
    process.exit(1);
  }
}
