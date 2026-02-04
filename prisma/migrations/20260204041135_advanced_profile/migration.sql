/*
  Warnings:

  - You are about to drop the column `experience` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `qualification` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "experience",
DROP COLUMN "portfolio",
DROP COLUMN "qualification",
DROP COLUMN "skills",
ADD COLUMN     "image" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "about" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3),
    "present" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,
    "to" TIMESTAMP(3),
    "present" BOOLEAN NOT NULL DEFAULT false,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "years" INTEGER NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
