import { Bytes, log } from "@graphprotocol/graph-ts";
import {
  RewardClaimed,
  TokenStaked,
  TokenUnstaked,
} from "../../generated/UniswapV3Staker/UniswapV3Staker";
import { Reward } from "../../generated/schema";
import { getOrCreateAccount } from "../common/entities/account";
import { getOrCreatePosition } from "../common/entities/position";

export function handleTokenStaked(event: TokenStaked): void {
  const position = getOrCreatePosition(event, event.params.tokenId);

  if (!position) {
    log.error("Position not found for TokenStaked event: {}, position: {}", [
      event.transaction.hash.toHexString(),
      event.params.tokenId.toString(),
    ]);
    return;
  }

  position.isStaked = true;

  position.save();
}

export function handleTokenUnstaked(event: TokenUnstaked): void {
  const position = getOrCreatePosition(event, event.params.tokenId);

  if (!position) {
    log.error("Position not found for TokenUnstaked event: {}, position: {}", [
      event.transaction.hash.toHexString(),
      event.params.tokenId.toString(),
    ]);
    return;
  }

  position.isStaked = false;

  position.save();
}

export function handleRewardClaimed(event: RewardClaimed): void {
  const recipient = getOrCreateAccount(event.transaction.from);
  const reward = new Reward(event.transaction.hash);

  const extractedTokenAddress = event.transaction.input
    .toHexString()
    .slice(34, 74);
  reward.token = Bytes.fromHexString(`0x${extractedTokenAddress}`);

  reward.createdTimestamp = event.block.timestamp;
  reward.createdBlockNumber = event.block.number;
  reward.amount = event.params.reward;
  reward.account = recipient.id;

  reward.save();
}
