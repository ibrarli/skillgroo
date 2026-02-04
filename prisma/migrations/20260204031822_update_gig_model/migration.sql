/*
  Warnings:

  - Added the required column `updatedAt` to the `Gig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "category" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "comment" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
