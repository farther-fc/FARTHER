import { TipMeta, User, prisma } from "@farther/backend";
import { getLatestTipAllowance } from "./getLatestTipAllowance";

describe("getLatestTipAllowance", () => {
  let tipMeta: TipMeta;
  let tipper: User;

  beforeEach(async () => {
    await prisma.tip.deleteMany();
    await prisma.tipAllowance.deleteMany();
    await prisma.tipMeta.deleteMany();
    await prisma.user.deleteMany();

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
        id: Math.round(Math.random() * 1000000),
      },
    });
  });

  it("returns the latest valid tip allowance for a given tipper", async () => {
    await prisma.tipAllowance.create({
      data: {
        userId: tipper.id,
        createdAt: new Date(0),
        invalidatedAmount: 0,
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

    expect(tipAllowance?.amount).toEqual(123);
  });

  it("doesn't return latest tip allowance if any amount has been invalidated", async () => {
    await prisma.tipAllowance.create({
      data: {
        userId: tipper.id,
        createdAt: new Date(0),
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
