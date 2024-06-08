/*
  Warnings:

  - The `spent` column on the `TipAllowance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `amount` on the `Tip` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `amount` on the `TipAllowance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `carriedOver` on the `TipMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipMinimum` on the `TipMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `totalAllowance` on the `TipMeta` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "TipAllowance" DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
DROP COLUMN "spent",
ADD COLUMN     "spent" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "TipMeta" DROP COLUMN "carriedOver",
ADD COLUMN     "carriedOver" DOUBLE PRECISION NOT NULL,
DROP COLUMN "tipMinimum",
ADD COLUMN     "tipMinimum" DOUBLE PRECISION NOT NULL,
DROP COLUMN "totalAllowance",
ADD COLUMN     "totalAllowance" DOUBLE PRECISION NOT NULL;
