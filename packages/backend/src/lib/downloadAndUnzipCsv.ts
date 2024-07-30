import {
  OPENRANK_HISTORY_FILE_NAME,
  OPENRANK_HISTORY_FILE_URL,
  axios,
} from "@farther/common";
import * as fs from "fs";
import * as path from "path";
import { pipeline } from "stream";
import * as zlib from "zlib";

// Path to save the downloaded gzipped file
const gzippedFilePath = path.resolve(
  __dirname,
  `${OPENRANK_HISTORY_FILE_NAME}.gz`,
);

// Path to save the unzipped CSV file
const csvFilePath = path.resolve(__dirname, OPENRANK_HISTORY_FILE_NAME);

// Function to download and unzip the CSV file
export async function downloadAndUnzipCsv(): Promise<void> {
  try {
    console.info("Downloading and unzipping the CSV file...");
    // Download the gzipped file
    const response = await axios({
      url: OPENRANK_HISTORY_FILE_URL,
      method: "GET",
      responseType: "stream",
    });

    // Create a writable stream for the gzipped file
    const gzippedFileWriter = fs.createWriteStream(gzippedFilePath);

    // Pipe the response data to the gzipped file
    response.data.pipe(gzippedFileWriter);

    // Wait for the download to finish
    await new Promise<void>((resolve, reject) => {
      gzippedFileWriter.on("finish", resolve);
      gzippedFileWriter.on("error", reject);
    });

    // Create a readable stream from the gzipped file
    const gzippedFileReader = fs.createReadStream(gzippedFilePath);

    // Create a writable stream for the unzipped CSV file
    const csvFileWriter = fs.createWriteStream(csvFilePath);

    // Unzip the gzipped file and save the result to the CSV file
    await new Promise<void>((resolve, reject) => {
      pipeline(gzippedFileReader, zlib.createGunzip(), csvFileWriter, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    console.log("CSV file downloaded and unzipped successfully.");
  } catch (error) {
    console.error("Error downloading or unzipping the file:", error);
  }
}

export function cleanupFiles(): void {
  try {
    if (fs.existsSync(gzippedFilePath)) {
      fs.unlinkSync(gzippedFilePath);
      console.log(`Deleted file: ${gzippedFilePath}`);
    }
    if (fs.existsSync(csvFilePath)) {
      fs.unlinkSync(csvFilePath);
      console.log(`Deleted file: ${csvFilePath}`);
    }
  } catch (error) {
    console.error("Error deleting files:", error);
  }
}
