import { prisma } from "@farther/backend";

export async function getLatestTipAllowance({
  tipperId,
  sinceWhen,
}: {
  tipperId: number;
  sinceWhen: Date;
}) {
  const tipAllowance = await prisma.tipAllowance.findFirst({
    where: {
      userId: tipperId,
      createdAt: {
        gte: sinceWhen,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!tipAllowance || (tipAllowance.invalidatedAmount ?? 0) > 0) {
    return null;
  }

  return tipAllowance;
}
