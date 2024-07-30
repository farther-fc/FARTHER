import { OPENRANK_HISTORY_FILE_NAME } from "@farther/common";
import Decimal from "decimal.js";
import * as fastcsv from "fast-csv";
import fs from "fs";
import path from "path";
import { downloadAndUnzipCsv } from "./downloadAndUnzipCsv";

const filePath = path.resolve(__dirname, OPENRANK_HISTORY_FILE_NAME);
const FID = "4378";

const scores: { date: string; score: Decimal }[] = [];

async function csvSearch() {
  // First check if file exists
  try {
    await fs.promises.access(filePath);
  } catch (error) {
    // Error means it likely doesn't exist
    await downloadAndUnzipCsv();
  }

  fs.createReadStream(filePath)
    .pipe(fastcsv.parse({ headers: true }))
    .on(
      "data",
      (data: { i: string; v: string; date: string; strategy_id: string }) => {
        // No need to process data rows if only printing headers
        if (data.i === FID && data.strategy_id === "3") {
          scores.push({ date: data.date, score: new Decimal(data.v) });
        }
      },
    )
    .on("end", () => {
      console.log(scores.sort((a, b) => a.date.localeCompare(b.date)));
    })
    .on("error", (error) => {
      console.error("Error reading the file:", error);
    });
}

csvSearch();
