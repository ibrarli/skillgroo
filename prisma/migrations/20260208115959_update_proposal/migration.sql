/*
  Warnings:

  - A unique constraint covering the columns `[proposalId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "proposalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_proposalId_key" ON "Order"("proposalId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
