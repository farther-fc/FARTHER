import { scaleLog } from "d3";

export const getHolderBalanceAdjustment = scaleLog()
  .domain([100_000, 1_000_000])
  .range([1, 1.5])
  .clamp(true);
