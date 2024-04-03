const fs = require("fs");

export const writeFile = async (path: string, content: any) => {
  const pathArr = path.split("/");
  const dir = pathArr.slice(0, pathArr.length - 1).join("/");
  await fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path, content);
};
