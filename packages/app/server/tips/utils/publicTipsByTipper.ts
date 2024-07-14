import { prisma } from "@farther/backend";
import { API_BATCH_LIMIT } from "@farther/common";

export async function publicTipsByTipper({
  tipperId,
  cursor,
  from,
  order,
  limit,
}: {
  tipperId: number;
  cursor?: number | null;
  from?: number;
  order?: "asc" | "desc";
  limit?: number;
}) {
  const orderByCreatedAt = order ?? "desc";
  const batchSize = limit ?? API_BATCH_LIMIT;

  const createdAtWhereClause =
    orderByCreatedAt === "asc"
      ? cursor
        ? // If cursor is provided, it means the tip at
          // that timestamp was already sent, and we
          // can ignore the 'from' field.
          { gt: new Date(cursor) }
        : { gte: new Date(from ?? 0) }
      : cursor
        ? { lt: new Date(cursor) }
        : { lte: from ? new Date(from) : new Date() };

  const tipCount = await prisma.tip.count({});

  const tips = await prisma.tip.findMany({
    where: {
      tipperId,
      createdAt: createdAtWhereClause,
    },
    orderBy: {
      createdAt: orderByCreatedAt,
    },
    take: batchSize,
  });

  return {
    tips,
    nextCursor:
      tipCount > batchSize && tips.length
        ? tips[tips.length - 1]?.createdAt.getTime()
        : null,
  };
}