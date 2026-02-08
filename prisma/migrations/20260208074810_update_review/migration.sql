/*
  Warnings:

  - A unique constraint covering the columns `[orderId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `communication` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceQuality` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueForMoney` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isReviewed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "communication" INTEGER NOT NULL,
ADD COLUMN     "orderId" TEXT NOT NULL,
ADD COLUMN     "profileId" TEXT NOT NULL,
ADD COLUMN     "serviceQuality" INTEGER NOT NULL,
ADD COLUMN     "showcaseImage" TEXT,
ADD COLUMN     "valueForMoney" INTEGER NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- CreateIndex
CREATE UNIQUE INDEX "Review_orderId_key" ON "Review"("orderId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
