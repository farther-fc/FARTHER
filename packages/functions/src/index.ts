import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { generatePingFunction } from "./generatePingFunction";

const ENV = defineString("NEXT_PUBLIC_ENVIRONMENT");

// exports.invalidateStaleAllocations = functions.pubsub
//   .schedule("0 2 * * *")
//   .onRun(generatePingFunction("invalidateStaleAllocations"));

exports.distributeAllowances = functions
  .runWith({
    // 9 minutes (max)
    timeoutSeconds: 540,
  })
  .pubsub // Every day at 9pm UTC
  .schedule(ENV.value() === "production" ? "0 22 * * *" : "*/5 * * * *")

  .onRun(generatePingFunction("distributeAllowances"));
