-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "keywords" TEXT,
ADD COLUMN     "serviceType" TEXT,
ALTER COLUMN "status" SET DEFAULT 'active';
