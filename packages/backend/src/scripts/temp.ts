import { readFileSync } from "fs";

async function temp() {
  const jsonData = await readFileSync("../../airdrops/");
}

temp();
