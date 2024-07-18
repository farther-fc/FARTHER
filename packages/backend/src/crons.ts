import { requireEnv } from "require-env-variable";
import { distributeAllowancesJob } from "./lib/distributeAllowancesWorker";
import { generateApiCallCron } from "./lib/generateApiCallCron";
import { syncUserData } from "./lib/syncUserData";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";
import { updateTipperScores } from "./lib/updateTipperScores";
import { prisma } from "./prisma";

const { CRON } = requireEnv("CRON");

switch (CRON) {
  case "syncUserData": {
    console.log("Running syncUserData on", process.env.NEXT_PUBLIC_ENVIRONMENT);
    syncUserData().then(disconnect);
    break;
  }
  case "updateTipperScores": {
    console.log(
      "Running updateTipperScores on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    updateTipperScores().then(disconnect);
    break;
  }
  case "takeOpenRankSnapshot": {
    console.log(
      "Running takeOpenRankSnapshot on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    takeOpenRankSnapshot().then(disconnect);
    break;
  }
  case "updateEligibleTippers": {
    console.log(
      "Running updateEligibleTippers on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    generateApiCallCron("admin.updateEligibleTippers")().then(disconnect);
    break;
  }
  case "distributeAllowances": {
    console.log(
      "Running distributeAllowances on",
      process.env.NEXT_PUBLIC_ENVIRONMENT,
    );
    distributeAllowancesJob().then(disconnect);
    break;
  }
  default: {
    console.error("Unknown cron");
  }
}

function disconnect() {
  prisma.$disconnect();
  process.exit(0);
}
