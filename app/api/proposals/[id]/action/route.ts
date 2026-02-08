import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { action } = await req.json();
    const { id: proposalId } = await params;

    // 1. Fetch the proposal to get data for the order
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) return NextResponse.json({ error: "Proposal not found" }, { status: 404 });

    // 2. Handle Actions
    
    // ACTION: ACCEPT
    if (action === "accept") {
      const result = await prisma.$transaction([
        // Create Order based exactly on your Order model fields
        prisma.order.create({
          data: {
            gigId: proposal.gigId,
            customerId: proposal.customerId,
            providerId: proposal.providerId,
            totalPrice: proposal.offeredPrice,
            status: "IN_PROGRESS", // Fits your status: String field
          },
        }),
        // Update Proposal status to ACCEPTED
        prisma.proposal.update({
          where: { id: proposalId },
          data: { status: "ACCEPTED" },
        }),
      ]);
      return NextResponse.json(result[0]);
    }

    // ACTION: REJECT (Declined by Talent)
    if (action === "reject") {
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: "DECLINED" },
      });
      return NextResponse.json({ message: "Proposal declined" });
    }

    // ACTION: CANCEL (Cancelled by Customer)
    if (action === "cancel") {
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: "CANCELLED" },
      });
      return NextResponse.json({ message: "Proposal cancelled" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("PROPOSAL_ACTION_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}