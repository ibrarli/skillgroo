/*
  Warnings:

  - You are about to drop the column `from` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `present` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `from` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `present` on the `Experience` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Experience` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Experience" DROP CONSTRAINT "Experience_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_profileId_fkey";

-- DropForeignKey
ALTER TABLE "Skill" DROP CONSTRAINT "Skill_profileId_fkey";

-- AlterTable
ALTER TABLE "Education" DROP COLUMN "from",
DROP COLUMN "present",
DROP COLUMN "to",
ADD COLUMN     "current" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Experience" DROP COLUMN "from",
DROP COLUMN "present",
DROP COLUMN "to",
ADD COLUMN     "current" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Portfolio" ALTER COLUMN "hours" DROP NOT NULL,
ALTER COLUMN "rate" DROP NOT NULL,
ALTER COLUMN "cost" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Skill" ALTER COLUMN "level" SET DEFAULT 1;

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
