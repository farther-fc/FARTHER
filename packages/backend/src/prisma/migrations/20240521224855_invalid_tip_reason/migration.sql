-- CreateEnum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'InvalidTipReason') THEN
      CREATE TYPE "InvalidTipReason" AS ENUM ('BELOW_MINIMUM', 'INSUFFICIENT_ALLOWANCE', 'NULL_ALLOWANCE');
    END IF;
END$$;

-- AlterTable
ALTER TABLE "Tip" ADD COLUMN IF NOT EXISTS "invalidTipReason" "InvalidTipReason";
