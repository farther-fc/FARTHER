const fs = require("fs");
const path = require("path");

// This is a janky way of getting around not knowing how to set an environment variable
// for the endpoint in the GraphClient. It replaces the hardcoded endpoint with a reference.

const graphClientPath = path.join(__dirname, "..", ".graphclient/index.ts");

fs.readFile(graphClientPath, "utf8", (err, data) => {
  if (err) {
    throw err;
  }

  const result = data.replace(
    /"https:\/\/farther\.squids\.live\/farther-production\/graphql"/g,
    `process.env.NEXT_PUBLIC_INDEXER_URL`,
  );

  fs.writeFile(graphClientPath, result, "utf8", (err) => {
    if (err) {
      throw err;
    }
  });
});
