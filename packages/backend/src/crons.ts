import { requireEnv } from "require-env-variable";
import { distributeAllowances } from "./lib/distributeAllowances";
import { createTipperScores } from "./lib/jobQueues/createTipperScores";
import { openRankSnapshot } from "./lib/jobQueues/openRankSnapshot";
import { syncTipperData } from "./lib/jobQueues/syncTipperData";
import { syncUserData } from "./lib/jobQueues/syncUserData";
import { updateEligibleTippers } from "./lib/updateEligibleTippers";

const { CRON } = requireEnv("CRON");

switch (CRON) {
  case "syncUserData": {
    console.log("Running syncUserData on", process.env.NEXT_PUBLIC_ENVIRONMENT);

    // Uses worker - disconnect is called in the worker
    syncUserData();
    break;
  }
  case "syncTipperData": {
    console.log(
      "Running syncTipperData on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );

    // Uses worker - disconnect is called in the worker
    syncTipperData();
    break;
  }
  case "createTipperScores": {
    console.log(
      "Running createTipperScores on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    createTipperScores();
    break;
  }
  case "openRankSnapshot": {
    console.log(
      "Running openRankSnapshot on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    openRankSnapshot();
    break;
  }
  case "updateEligibleTippers": {
    console.log(
      "Running updateEligibleTippers on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    updateEligibleTippers();
    break;
  }
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
