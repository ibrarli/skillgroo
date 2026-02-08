  // api/orders/create/route.ts

  import { NextResponse } from "next/server";
  import { getServerSession } from "next-auth";
  import { authOptions } from "@/app/api/auth/[...nextauth]/route";
  import { prisma } from "@/lib/prisma";

  export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { gigId, providerId, totalPrice } = await req.json();

    try {
      const order = await prisma.$transaction(async (tx) => {
        // 1. Create the Order
        const newOrder = await tx.order.create({
          data: {
            gigId,
            customerId: session.user.id,
            providerId,
            totalPrice,
            status: "pending",
          },
          include: { gig: true }
        });

        // 2. Add to Provider's Pending Earnings
        await tx.earnings.upsert({
          where: { userId: providerId },
          update: { pendingAmount: { increment: totalPrice } },
          create: { userId: providerId, pendingAmount: totalPrice },
        });

        // 3. Create Notification for the Worker
        await tx.notification.create({
          data: {
            userId: providerId,
            title: "New Order Received! 📦",
            message: `Someone just purchased your gig: "${newOrder.gig.title}" for $${totalPrice}.`,
            link: "/orders",
          },
        });

        return newOrder;
      });

      return NextResponse.json(order);
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }