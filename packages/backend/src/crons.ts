import { requireEnv } from "require-env-variable";
import { distributeAllowances } from "./lib/distributeAllowances";
import { syncUserData } from "./lib/syncUserData";

const { CRON } = requireEnv("CRON");

switch (CRON) {
  case "syncUserData": {
    console.log("Running syncUserData on", process.env.NEXT_PUBLIC_ENVIRONMENT);

    syncUserData();
    break;
  }
  // case "syncTipperData": {
  //   console.log(
  //     "Running syncTipperData on",
  //     process.env.NEXT_PUBLIC_ENVIRONMENT,
  //   );

  //   syncTipperData();
  //   break;
  // }
  // case "updateTipperScores": {
  //   console.log(
  //     "Running updateTipperScores on",
  //     process.env.NEXT_PUBLIC_ENVIRONMENT,
  //   );
  //   updateTipperScores();
  //   break;
  // }
  // case "takeOpenRankSnapshot": {
  //   console.log(
  //     "Running takeOpenRankSnapshot on",
  //     process.env.NEXT_PUBLIC_ENVIRONMENT,
  //   );
  //   takeOpenRankSnapshot();
  //   break;
  // }
  // case "updateEligibleTippers": {
  //   console.log(
  //     "Running updateEligibleTippers on",
  //     process.env.NEXT_PUBLIC_ENVIRONMENT,
  //   );
  //   updateEligibleTippers();
  //   break;
  // }
  case "distributeAllowances": {
    console.log(
      "Running distributeAllowances on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    distributeAllowances();
    break;
  }
  default: {
    console.error("Unknown cron");
  }
}
