/*
  Warnings:

  - Added the required column `tipMinimum` to the `TipMeta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TipMeta" ADD COLUMN     "tipMinimum" TEXT NOT NULL;
