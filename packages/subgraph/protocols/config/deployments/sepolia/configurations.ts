import {
  Address,
  BigInt,
  BigDecimal,
  Bytes,
  log,
} from "@graphprotocol/graph-ts";
import { Factory } from "../../../../generated/Factory/Factory";
import {
  BIGDECIMAL_ONE,
  BIGDECIMAL_ZERO,
  FeeSwitch,
  Network,
  RewardIntervalType,
} from "../../../../src/common/constants";
import { Configurations } from "../../../../configurations/configurations/interface";
import { PROTOCOL_NAME, PROTOCOL_SLUG } from "../../../src/common/constants";
import { stringToBytesList } from "../../../../src/common/utils/utils";

export class UniswapV3SepoliaConfigurations implements Configurations {
  getNetwork(): string {
    return Network.SEPOLIA;
  }
  getProtocolName(): string {
    return PROTOCOL_NAME;
  }
  getProtocolSlug(): string {
    return PROTOCOL_SLUG;
  }
  getFactoryAddress(): Bytes {
    return Bytes.fromHexString("0x0227628f3F023bb0B980b67D528571c95c6DaC1c");
  }
  getFactoryContract(): Factory {
    return Factory.bind(
      Address.fromString("0x0227628f3F023bb0B980b67D528571c95c6DaC1c"),
    );
  }
  getV3StakerAddress(): Bytes {
    return Bytes.fromHexString("0x52a941cd52f48a1a7d73d7a07df1e23dd51a699e");
  }
  getProtocolFeeOnOff(): string {
    return FeeSwitch.OFF;
  }
  getInitialProtocolFeeProportion(fee: i64): BigDecimal {
    log.warning("getProtocolFeeRatio is not implemented: {}", [fee.toString()]);
    return BIGDECIMAL_ZERO;
  }
  getProtocolFeeProportion(protocolFee: BigInt): BigDecimal {
    return BIGDECIMAL_ONE.div(protocolFee.toBigDecimal());
  }
  getRewardIntervalType(): string {
    return RewardIntervalType.NONE;
  }
  getReferenceToken(): Bytes {
    return Bytes.fromHexString("0x7b79995e5f793a07bc00c21412e50ecae098e7f9");
  }
  getRewardToken(): Bytes {
    return Bytes.fromHexString("");
  }
  getWhitelistTokens(): Bytes[] {
    return stringToBytesList([
      "0x7b79995e5f793a07bc00c21412e50ecae098e7f9", // weth
      "0xf08a50178dfcde18524640ea6618a1f965821715", // usdc
    ]);
  }
  getStableCoins(): Bytes[] {
    return stringToBytesList([
      "0xf08a50178dfcde18524640ea6618a1f965821715", // usdc
    ]);
  }
  getStableOraclePools(): Bytes[] {
    return stringToBytesList([
      // Don't think this is needed for sepolia
      "0x4c36388be6f416a29c8d8eee81c771ce6be14b18", // usdc-weth 0.05%
      "0x3ddf264ac95d19e81f8c25f4c300c4e59e424d43", // usdc-weth 0.3%
      "0xe584fe0c7505025c3819c82c99944b79a7cc009d", // usdc-weth 1%
    ]);
  }
  getUntrackedPairs(): Bytes[] {
    return stringToBytesList([]);
  }
  getUntrackedTokens(): Bytes[] {
    return stringToBytesList([]);
  }
  getMinimumLiquidityThreshold(): BigDecimal {
    return BigDecimal.fromString("10000");
  }
  getBrokenERC20Tokens(): Bytes[] {
    return stringToBytesList([]);
  }
}
