import { formatEther } from "viem";

const fs = require("fs");

export const writeFile = async (path: string, content: any) => {
  const pathArr = path.split("/");
  const dir = pathArr.slice(0, pathArr.length - 1).join("/");
  await fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path, content);
};

export const formatNum = (n: string | bigint) => {
  return Number(formatEther(BigInt(n))).toLocaleString();
};
