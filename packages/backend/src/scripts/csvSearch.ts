import { OPENRANK_HISTORY_FILE_NAME } from "@farther/common";
import * as fastcsv from "fast-csv";
import fs from "fs";
import path from "path";

const filePath = path.resolve(__dirname, OPENRANK_HISTORY_FILE_NAME);
const FID = "158";

fs.createReadStream(filePath)
  .pipe(fastcsv.parse({ headers: true }))
  .on(
    "data",
    (data: { i: string; v: string; date: string; strategy_id: string }) => {
      // No need to process data rows if only printing headers
      if (data.i === FID && data.strategy_id === "3") {
        console.log(data.date, data.v);
      }
    },
  )
  .on("end", () => {
    console.log("Finished reading the file");
  })
  .on("error", (error) => {
    console.error("Error reading the file:", error);
  });
