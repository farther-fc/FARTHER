import "./assertLocalhost";

import { execSync } from "child_process";

execSync("prisma migrate reset --force --skip-seed", {
  env: {
    ...process.env,
    ENV: "development",
  },
  stdio: "inherit",
});
