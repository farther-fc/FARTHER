// import { log } from '@graphprotocol/graph-ts'
import { PoolCreated } from "../../generated/Factory/Factory";
import { NetworkConfigs } from "../../configurations/configure";
import { createPool } from "../common/entities/pool";
import { getOrCreateProtocol } from "../common/entities/protocol";
import { Network } from "../common/constants";
import { populateEmptyPools } from "../common/utils/backfill";
import { log } from "@graphprotocol/graph-ts";

// Liquidity pool is created from the Factory contract.
// Create a pool entity and start monitoring events from the newly deployed pool contract specified in the subgraph.yaml.
export function handlePoolCreated(event: PoolCreated): void {
  if (NetworkConfigs.getUntrackedPairs().includes(event.params.pool)) {
    return;
  }

  log.info("Creating liquidity pool: ", [event.params.pool.toHexString()]);

  createPool(
    event,
    event.params.pool,
    event.params.token0,
    event.params.token1,
    event.params.fee
  );

  log.info("Pool created",[]);

  const protocol = getOrCreateProtocol();
  // populate pre-regenesis pools if needed
  if (
    NetworkConfigs.getNetwork() == Network.OPTIMISM &&
    protocol._regenesis == false
  ) {
    populateEmptyPools(event);
  }
}
