import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { gig: true }
      });

      if (!order) throw new Error("Order not found");
      if (order.providerId !== session.user.id) {
        throw new Error("Only the service provider can update order status");
      }

      // Logic for Completion
      if (status === "completed" && order.status !== "completed") {
        await tx.earnings.update({
          where: { userId: order.providerId },
          data: {
            totalBalance: { increment: order.totalPrice },
            pendingAmount: { decrement: order.totalPrice }
          }
        });

        await tx.transaction.create({
          data: {
            userId: order.providerId,
            amount: order.totalPrice,
            type: "INCOME",
            status: "COMPLETED",
            description: `Revenue from: ${order.gig.title}`
          }
        });

        // Notify Customer of Completion
        await tx.notification.create({
          data: {
            userId: order.customerId,
            title: "Order Completed! 🎉",
            message: `The worker has finished your order for "${order.gig.title}".`,
            link: "/orders",
          },
        });
      }

      // Logic for Cancellation
      if (status === "cancelled" && order.status !== "cancelled") {
        // Return pending funds to neutral (assuming refund logic or just cleaning the provider's pending)
        await tx.earnings.update({
          where: { userId: order.providerId },
          data: { pendingAmount: { decrement: order.totalPrice } }
        });

        // Notify Customer of Cancellation
        await tx.notification.create({
          data: {
            userId: order.customerId,
            title: "Order Cancelled ❌",
            message: `Your order for "${order.gig.title}" was cancelled by the provider.`,
            link: "/orders",
          },
        });
      }

      return await tx.order.update({
        where: { id },
        data: { status }
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}