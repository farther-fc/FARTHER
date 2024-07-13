import { TipAllowance, prisma, resetDatabase } from "@farther/backend";
import { invalidateAllowance } from "../utils/invalidateAllowance";

describe("invalidateAllowance", () => {
  const USER_ID = 1730937;

  let allowance: TipAllowance;

  beforeEach(async () => {
    await resetDatabase();

    const tipMeta = await prisma.tipMeta.create({
      data: {
        tipMinimum: 100,
        carriedOver: 0,
        totalAllowance: 100,
        usdPrice: 1,
      },
    });

    allowance = await prisma.tipAllowance.create({
      data: {
        amount: 137037,
        userBalance: "123",
        tipMeta: {
          connect: {
            id: tipMeta.id,
          },
        },
        user: {
          connectOrCreate: {
            where: {
              id: USER_ID,
            },
            create: {
              id: USER_ID,
            },
          },
        },
      },
    });
  });

  it("should correctly calculate the invalidated amount when there are no tips", async () => {
    const updatedAllowance = await invalidateAllowance(allowance);

    expect(updatedAllowance.invalidatedAmount).toEqual(allowance.amount);
  });

  it("should correctly calculate the invalidated amount when there are tips", async () => {
    const tipAmount = 51;
    await prisma.tip.create({
      data: {
        amount: tipAmount,
        hash: "0x",
        tipper: {
          connectOrCreate: {
            where: { id: USER_ID },
            create: { id: USER_ID },
          },
        },
        tippee: {
          connectOrCreate: {
            where: { id: USER_ID },
            create: { id: USER_ID },
          },
        },
        tipAllowance: {
          connect: {
            id: allowance.id,
          },
        },
      },
    });

    const updatedAllowance = await invalidateAllowance(allowance);

    expect(updatedAllowance.invalidatedAmount).toEqual(
      allowance.amount - tipAmount,
    );
  });
});
