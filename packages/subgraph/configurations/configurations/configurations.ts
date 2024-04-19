import { UniswapV3BaseConfigurations } from "../../protocols/config/deployments/base/configurations";
import { UniswapV3SepoliaConfigurations } from "../../protocols/config/deployments/sepolia/configurations";
import { Configurations } from "./interface";
import { Deploy } from "./deploy";
import { log } from "@graphprotocol/graph-ts";

export function getNetworkConfigurations(deploy: i32): Configurations {
  switch (deploy) {
    case Deploy.UNISWAP_V3_SEPOLIA: {
      return new UniswapV3SepoliaConfigurations();
    }
    case Deploy.UNISWAP_V3_BASE: {
      return new UniswapV3BaseConfigurations();
    }
    default: {
      log.critical(
        "No configurations found for deployment protocol/network",
        [],
      );
      return new UniswapV3BaseConfigurations();
    }
  }
}
