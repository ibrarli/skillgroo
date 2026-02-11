// api/orders/[id]/proposal/route.ts

// Fetching data for Proposal Detail for both Customer or Talent to View

// Used in: ProposalDetailModal.tsx

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action } = await req.json();
    const { id: proposalId } = await params;

    // 1. Fetch the proposal to get data for the order
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    /* ===========================================================
       ACTION: ACCEPT 
       (Creates the Order and Links it to the Proposal)
       =========================================================== */
    if (action === "accept") {
      // We use a transaction to ensure both records update or neither do
      const result = await prisma.$transaction(async (tx) => {
        
        // A. Create the Order WITH the proposalId link
        const newOrder = await tx.order.create({
          data: {
            proposalId: proposal.id, // THE CRITICAL LINK
            gigId: proposal.gigId,
            customerId: proposal.customerId,
            providerId: proposal.providerId,
            totalPrice: proposal.offeredPrice,
            status: "IN_PROGRESS",
          },
        });

        // B. Update Proposal status to IN_PROGRESS 
        // This ensures it moves to the "Active" tab in your UI
        const updatedProposal = await tx.proposal.update({
          where: { id: proposalId },
          data: { status: "IN_PROGRESS" },
        });

        return { newOrder, updatedProposal };
      });

      return NextResponse.json(result.newOrder);
    }

    /* ===========================================================
       ACTION: REJECT
       =========================================================== */
    if (action === "reject") {
      const updated = await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: "DECLINED" },
      });
      return NextResponse.json(updated);
    }

    /* ===========================================================
       ACTION: CANCEL
       =========================================================== */
    if (action === "cancel") {
      const updated = await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error: any) {
    console.error("PROPOSAL_ACTION_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}