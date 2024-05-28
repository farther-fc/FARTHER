import { NEXT_PUBLIC_BASE_RPC_URL } from "@farther/common";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import {
  coinbaseWallet,
  metaMaskWallet,
  phantomWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, http } from "wagmi";
import { anvil, base, sepolia } from "wagmi/chains";

export const WALLET_CONNECT_PROJECT_ID = "4861dc911064227b7cf8377990e49577";

export const wagmiConfig = createConfig({
  connectors: connectorsForWallets(
    [
      {
        groupName: "Recommended",
        wallets: [
          metaMaskWallet,
          coinbaseWallet,
          safeWallet,
          phantomWallet,
          walletConnectWallet,
        ],
      },
    ],
    { appName: "Farther", projectId: WALLET_CONNECT_PROJECT_ID },
  ),
  transports: {
    [base.id]: http(NEXT_PUBLIC_BASE_RPC_URL),
    [sepolia.id]: http(),
    [anvil.id]: http(),
  },
  chains: [base, sepolia, anvil],
  ssr: true,
});
