import { NFTPositionMngrAbi } from "@farther/common";
import { AbiParametersToPrimitiveTypes, ExtractAbiFunction } from "abitype";

type PositionsReturnType = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof NFTPositionMngrAbi, "positions">["outputs"]
>;

export type Position = {
  nonce: PositionsReturnType[0];
  operator: PositionsReturnType[1];
  token0: PositionsReturnType[2];
  token1: PositionsReturnType[3];
  fee: PositionsReturnType[4];
  tickLower: PositionsReturnType[5];
  tickUpper: PositionsReturnType[6];
  liquidity: PositionsReturnType[7];
  feeGrowthInside0LastX128: PositionsReturnType[8];
  feeGrowthInside1LastX128: PositionsReturnType[9];
  tokensOwed0: PositionsReturnType[10];
  tokensOwed1: PositionsReturnType[11];
};
