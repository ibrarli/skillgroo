/*
  Warnings:

  - Changed the type of `type` on the `PayoutMethod` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PayoutProvider" AS ENUM ('BANK', 'PAYPAL', 'STRIPE', 'WISE', 'PAYONEER');

-- AlterTable
ALTER TABLE "PayoutMethod" DROP COLUMN "type",
ADD COLUMN     "type" "PayoutProvider" NOT NULL;
