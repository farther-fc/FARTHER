import Chance from "chance";

const chance = new Chance(1);

const getIds = (length: number) => {
  return Array.from({ length }, () => chance.integer({ min: 1, max: 5000 }));
};
/**
 * spendRatios == array of ratios of the user's total daily allowance
 * tipAmountRatios == array of ratios of the daily tip minimum
 */
export const behaviors = [
  // extreme degen
  {
    portionOfTippers: 0.1,
    spendRatios: [1],
    tippeeIds: [getIds(100)],
  },
  // aggressive
  {
    portionOfTippers: 0.9,
    spendRatios: [
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    tippeeIds: [getIds(100)],
  },
  // // mid fan
  // {
  //   portionOfTippers: 0.45,
  //   spendRatios: [0.5, 1, 0.8, 0, 1],
  //   tippeeIds: [getIds(30), getIds(10)],
  // },
  // // casual
  // {
  //   portionOfTippers: 0.4,
  //   spendRatios: [0.3, 0, 1, 0, 0.5],
  //   tippeeIds: [getIds(15), getIds(5), getIds(1)],
  // },
];
