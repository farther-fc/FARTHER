import { requireEnv } from "require-env-variable";
import { distributeAllowancesJob } from "./lib/distributeAllowancesWorker";
import { generateApiCallCron } from "./lib/generateApiCallCron";
import { syncTipperData } from "./lib/syncTipperData";
import { syncUserData } from "./lib/syncUserData";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";
import { updateTipperScores } from "./lib/updateTipperScores";
import { prisma } from "./prisma";

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
  case "updateTipperScores": {
    console.log(
      "Running updateTipperScores on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    updateTipperScores().then(disconnectCron);
    break;
  }
  case "takeOpenRankSnapshot": {
    console.log(
      "Running takeOpenRankSnapshot on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    takeOpenRankSnapshot().then(disconnectCron);
    break;
  }
  case "updateEligibleTippers": {
    console.log(
      "Running updateEligibleTippers on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    generateApiCallCron("admin.updateEligibleTippers")().then(disconnectCron);
    break;
  }
  case "distributeAllowances": {
    console.log(
      "Running distributeAllowances on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );

    // Uses worker - disconnect is called in the worker
    distributeAllowancesJob();
    break;
  }
  default: {
    console.error("Unknown cron");
  }
}

export async function disconnectCron() {
  prisma.$disconnect();
  process.exit(0);
}
