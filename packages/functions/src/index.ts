import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { generateCronJob } from "./generateCronJob";

const ENV = defineString("NEXT_PUBLIC_ENVIRONMENT");

// exports.invalidateStaleAllocations = functions.pubsub
//   .schedule("0 2 * * *")
//   .onRun(generateCronJob("invalidateStaleAllocations"));

exports.distributeAllowances = functions
  .runWith({
    // 9 minutes (max)
    timeoutSeconds: 540,
  })
  .pubsub // Every day at 9pm UTC
  .schedule(ENV.value() === "production" ? "* * * * *" : "*/5 * * * *")

  .onRun(generateCronJob("admin.distributeAllowances"));
