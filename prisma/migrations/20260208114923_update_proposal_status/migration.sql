/*
  Warnings:

  - The values [COUNTERED] on the enum `ProposalStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProposalStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'IN_PROGRESS', 'COMPLETED', 'SUBMITTED');
ALTER TABLE "public"."Proposal" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Proposal" ALTER COLUMN "status" TYPE "ProposalStatus_new" USING ("status"::text::"ProposalStatus_new");
ALTER TYPE "ProposalStatus" RENAME TO "ProposalStatus_old";
ALTER TYPE "ProposalStatus_new" RENAME TO "ProposalStatus";
DROP TYPE "public"."ProposalStatus_old";
ALTER TABLE "Proposal" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
