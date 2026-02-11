import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
/* ===========================================================
   GET: Fetch existing review for an order/proposal
   =========================================================== */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Try to find the review using the Order ID or the Proposal ID fallback
    let review = await prisma.review.findUnique({
      where: { orderId: id },
    });

    if (!review) {
      // Fallback: Check if 'id' provided was actually a proposalId
      const order = await prisma.order.findUnique({
        where: { proposalId: id },
        select: { id: true }
      });

      if (order) {
        review = await prisma.review.findUnique({
          where: { orderId: order.id },
        });
      }
    }

    if (!review) return new NextResponse("Review not found", { status: 404 });

    return NextResponse.json(review);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const { communication, described, recommend, reviewText, showcaseImage } = await req.json();

    // 1. Fetch order with FALLBACK (checks if ID is Order ID or Proposal ID)
    let order = await prisma.order.findUnique({
      where: { id: id },
      include: { gig: true }
    });

    if (!order) {
      order = await prisma.order.findUnique({
        where: { proposalId: id },
        include: { gig: true }
      });
    }

    // 2. Security Check
    if (!order || order.customerId !== session.user.id) {
      return new NextResponse("Order not found or unauthorized", { status: 404 });
    }

    // 3. Prevent Double Reviewing
    if (order.isReviewed) {
      return new NextResponse("Order already reviewed", { status: 400 });
    }

    const averageRating = (communication + described + recommend) / 3;

    // 4. Transaction to create review and update order state
    const result = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          rating: averageRating,
          communication,
          serviceQuality: described, // Matches your schema
          valueForMoney: recommend,   // Matches your schema
          comment: reviewText,
          showcaseImage: showcaseImage || null,
          
          // Use the internal order.id to ensure we use the UUID, not a proposalId
          order: { connect: { id: order!.id } },
          gig: { connect: { id: order!.gigId } },
          reviewer: { connect: { id: session.user.id } },
          profile: { connect: { id: order!.gig.profileId } },
        },
      });

      // Mark the order as reviewed
      await tx.order.update({
        where: { id: order!.id },
        data: { isReviewed: true },
      });

      // Optional: Update the Proposal as well if you want to track it there
      if (order?.proposalId) {
        await tx.proposal.update({
          where: { id: order.proposalId },
          data: { isReviewed: true }
        });
      }

      return newReview;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("[RATING_POST_ERROR]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}