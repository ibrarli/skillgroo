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
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: orderId } = await params;
    const { communication, described, recommend, reviewText, showcaseImage } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { 
        gig: true
      }
    });

    if (!order || order.customerId !== session.user.id) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const averageRating = (communication + described + recommend) / 3;

    // We use a transaction to ensure both happen or neither happens
    const [newReview] = await prisma.$transaction([
      prisma.review.create({
        data: {
          rating: averageRating,
          communication,
          serviceQuality: described,
          valueForMoney: recommend,
          comment: reviewText,
          showcaseImage: showcaseImage || null,
          // Explicit connections
          order: { connect: { id: orderId } },
          gig: { connect: { id: order.gigId } },
          reviewer: { connect: { id: session.user.id } },
          profile: { connect: { id: order.gig.profileId } },
        },
      }),
      prisma.order.update({
        where: { id: orderId },
        data: { isReviewed: true },
      }),
    ]);

    return NextResponse.json(newReview);
  } catch (error: any) {
    console.error("[RATING_POST_ERROR]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}