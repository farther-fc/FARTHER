import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-contract-sizer";
import { HardhatUserConfig } from "hardhat/config";
import { SolcUserConfig } from "hardhat/types";
import "solidity-coverage";

const DEFAULT_COMPILER_SETTINGS: SolcUserConfig = {
  version: "0.7.6",
  settings: {
    optimizer: {
      enabled: true,
      runs: 1_000_000,
    },
    metadata: {
      bytecodeHash: "none",
    },
  },
};

if (process.env.RUN_COVERAGE == "1") {
  /**
   * Updates the default compiler settings when running coverage.
   *
   * See https://github.com/sc-forks/solidity-coverage/issues/417#issuecomment-730526466
   */
  console.info("Using coverage compiler settings");
  DEFAULT_COMPILER_SETTINGS.settings.details = {
    yul: true,
    yulDetails: {
      stackAllocation: true,
    },
  };
}

const config: HardhatUserConfig = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/H1uLlNifQLgv-OY6BG-2DdmWYNVBxq3u`,
      accounts: [
        "0xca6df49a852da7d87388318831633832d01a4a9bd778bd16110d9595f78b062d",
      ],
    },
  },
  solidity: {
    compilers: [DEFAULT_COMPILER_SETTINGS],
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: true,
    runOnCompile: false,
  },
};

export default config;
