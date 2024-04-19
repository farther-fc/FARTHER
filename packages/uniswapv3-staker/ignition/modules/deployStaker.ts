import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Sepolia addresses
const UNISWAP_V3_FACTORY = "0x0227628f3F023bb0B980b67D528571c95c6DaC1c";
const NFT_POSITION_MNGR = "0x1238536071E1c677A632429e3655c799b22cDA52";

const MAX_UINT256 = BigInt(2) ** BigInt(256) - BigInt(1);

export default buildModule("UniswapV3Staker", (m) => {
  const staker = m.contract("UniswapV3Staker", [
    UNISWAP_V3_FACTORY,
    NFT_POSITION_MNGR,
    MAX_UINT256,
    MAX_UINT256,
  ]);

  return { staker };
});
