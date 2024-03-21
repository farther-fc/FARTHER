import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export const WALLET_CONNECT_PROJECT_ID = "4861dc911064227b7cf8377990e49577";

const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create wagmiConfig
const chains = [mainnet, sepolia] as const;
export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: WALLET_CONNECT_PROJECT_ID,
  metadata,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  // ...wagmiOptions // Optional - Override createConfig parameters
});
