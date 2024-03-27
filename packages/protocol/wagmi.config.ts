import { defineConfig } from "@wagmi/cli";
import { foundry, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [],
  plugins: [
    foundry({
      artifacts: "out/",
      include: ["FartherToken.sol/**", "FartherAirdrop.sol/**"],
    }),
    react(),
  ],
});
