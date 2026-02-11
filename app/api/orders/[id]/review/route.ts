// api/orders/[id]/review/route.ts

// Where user can review the Completed Data provided by the 

// Used in: ReviewDeliveryModal.tsx

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params; 
    const { action } = await req.json(); // "ACCEPT" or "REJECT"

    // 1. Fetch order with fallback (checks ID as Order ID OR Proposal ID)
    let order = await prisma.order.findUnique({ 
      where: { id: id },
      include: { proposal: true }
    });

    if (!order) {
      order = await prisma.order.findUnique({
        where: { proposalId: id },
        include: { proposal: true }
      });
    }

    if (!order) return new NextResponse("Order not found", { status: 404 });

    // 2. Security Check: Only the Customer who placed the order can review it
    if (order.customerId !== session.user.id) {
      return new NextResponse("Forbidden: You are not the customer", { status: 403 });
    }

    /* ===========================================================
       ACTION: ACCEPT (Approve work & Finish)
       =========================================================== */
    if (action === "ACCEPT") {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "COMPLETED" },
        }),
        prisma.proposal.update({
          where: { id: order.proposalId as string },
          data: { status: "COMPLETED" },
        }),
      ]);
    } 
    /* ===========================================================
       ACTION: REJECT (Request revisions)
       =========================================================== */
    else {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: "IN_PROGRESS" },
        }),
        prisma.proposal.update({
          where: { id: order.proposalId as string },
          data: { status: "IN_PROGRESS" },
        }),
        // Optional: Remove proof so worker can re-submit
        prisma.orderProof.delete({ 
          where: { orderId: order.id } 
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ORDER_REVIEW_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}