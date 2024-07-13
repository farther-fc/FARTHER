import { TipMeta, User, prisma, resetDatabase } from "@farther/backend";
import { getLatestTipAllowance } from "../utils/getLatestTipAllowance";

describe("getLatestTipAllowance", () => {
  const USER_ID = 137093;

  let tipMeta: TipMeta;
  let tipper: User;

  beforeEach(async () => {
    await resetDatabase();

    tipMeta = await prisma.tipMeta.create({
      data: {
        tipMinimum: 123,
        totalAllowance: 123,
        carriedOver: 123,
        usdPrice: 123,
      },
    });

    tipper = await prisma.user.create({
      data: {
        id: USER_ID,
      },
    });
  });

  it("returns the latest valid tip allowance for a given tipper", async () => {
    await prisma.tipAllowance.create({
      data: {
        userId: tipper.id,
        amount: 123,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    const sinceWhen = new Date(0);
    const tipAllowance = await getLatestTipAllowance({
      tipperId: USER_ID,
      sinceWhen,
    });

    expect(tipAllowance?.amount).toEqual(123);
  });

  it("doesn't return latest tip allowance if any amount has been invalidated", async () => {
    await prisma.tipAllowance.create({
      data: {
        userId: tipper.id,
        invalidatedAmount: 1,
        amount: 123,
        userBalance: "123",
        tipMetaId: tipMeta.id,
      },
    });

    const tipperId = 0;
    const sinceWhen = new Date(0);
    const tipAllowance = await getLatestTipAllowance({
      tipperId,
      sinceWhen,
    });
    expect(tipAllowance).toBeNull();
  });
});
