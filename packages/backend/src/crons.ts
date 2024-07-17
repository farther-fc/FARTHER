import { requireEnv } from "require-env-variable";
import { generateApiCallCron } from "./lib/generateApiCallCron";
import { takeOpenRankSnapshot } from "./lib/takeOpenRankSnapshot";
import { updateTipperScores } from "./lib/updateTipperScores";
import { prisma } from "./prisma";

const { CRON } = requireEnv("CRON");

switch (CRON) {
  case "updateTipperScores": {
    updateTipperScores().then(disconnect);
    break;
  }
  case "takeOpenRankSnapshot": {
    takeOpenRankSnapshot().then(disconnect);
    break;
  }
  case "updateEligibleTippers": {
    generateApiCallCron("admin.updateEligibleTippers")().then(disconnect);
    break;
  }
  case "distributeAllowances": {
    generateApiCallCron("admin.distributeAllowances")().then(disconnect);
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
