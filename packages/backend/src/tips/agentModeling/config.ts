import { DEV_USER_FID } from "@farther/common";

const TIPPEE_ID_START = DEV_USER_FID;
const generateIds = (length: number) =>
  Array.from({ length }, (_, id) => id + TIPPEE_ID_START);

/**
 * spendRatios == array of ratios of the user's total daily allowance
 * tipAmountRatios == array of ratios of the daily tip minimum
 */
export const behaviors = [
  // extreme degen
  {
    portionOfTippers: 0.05,
    spendRatios: [1, 0.9, 0.8, 1, 0.5, 1],
    tippeeIds: [
      generateIds(100),
      generateIds(50),
      generateIds(20),
      generateIds(5),
      generateIds(1),
    ],
  },
  // aggressive
  {
    portionOfTippers: 0.1,
    spendRatios: [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    tippeeIds: [generateIds(100), generateIds(20)],
  },
  // mid fan
  {
    portionOfTippers: 0.45,
    spendRatios: [0.5, 1, 0.8, 0, 1],
    tippeeIds: [generateIds(30), generateIds(10)],
  },
  // casual
  {
    portionOfTippers: 0.4,
    spendRatios: [0.3, 0, 1, 0, 0.5],
    tippeeIds: [generateIds(15), generateIds(5), generateIds(1)],
  },
];

// export const behaviors = [
//   {
//     portionOfTippers: 0.5,
//     spendRatios: [0.5],
//     tippeeIds: Array.from({ length: 100 }, (_, id) => id + TIPPEE_ID_START),
//   },
//   {
//     portionOfTippers: 0.5,
//     spendRatios: [
//       1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
//       1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
//     ],
//     tippeeIds: Array.from({ length: 100 }, (_, id) => id + TIPPEE_ID_START),
//   },
// ];

export const FIDS_TO_WATCH = [
  429188, 3741, 283056, 364017, 403573, 407112, 344029, 326433,
];
