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
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const { action } = await req.json(); // "ACCEPT" or "REJECT"

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.customerId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (action === "ACCEPT") {
      await prisma.order.update({
        where: { id },
        data: { status: "COMPLETED" },
      });
    } else {
      // If rejected, move back to IN_PROGRESS so worker can edit
      await prisma.order.update({
        where: { id },
        data: { status: "IN_PROGRESS" },
      });
      // Optionally delete proof so they can submit a new one
      await prisma.orderProof.delete({ where: { orderId: id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}