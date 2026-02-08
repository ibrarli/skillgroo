-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';

-- CreateTable
CREATE TABLE "OrderProof" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "description" TEXT,
    "externalLink" TEXT,
    "images" TEXT[],
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderProof_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderProof_orderId_key" ON "OrderProof"("orderId");

-- AddForeignKey
ALTER TABLE "OrderProof" ADD CONSTRAINT "OrderProof_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
