import { prisma } from "../../prisma";

export function mockDate(isoDate: string) {
  jest
    .useFakeTimers({ doNotFake: ["nextTick"] })
    .setSystemTime(new Date(isoDate));
}

export async function clearDatabase() {
  const tables: { tablename: string }[] = await prisma.$queryRaw`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname='public'`;

  const tableNames = tables
    .map(({ tablename }) => `"public"."${tablename}"`)
    .join(", ");

  if (tableNames.length) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE`,
    );
  }
}
