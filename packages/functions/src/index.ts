import * as functions from "firebase-functions";
import { generatePingFunction } from "./generatePingFunction";

// exports.invalidateStaleAllocations = functions.pubsub
//   .schedule("0 2 * * *")
//   .onRun(generatePingFunction("invalidateStaleAllocations"));

exports.distributeAllowances = functions.pubsub
  // Every day at 9pm UTC
  .schedule("0 22 * * *")
  .onRun(generatePingFunction("distributeAllowances"));
