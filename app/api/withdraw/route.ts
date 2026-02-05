import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount } = await req.json();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const earnings = await tx.earnings.findUnique({
        where: { userId: session.user.id }, 
      });

      if (!earnings || earnings.totalBalance < amount) {
        throw new Error("Insufficient balance");
      }

      // 1. Update Earnings
      await tx.earnings.update({
        where: { userId: session.user.id },
        data: {
          totalBalance: { decrement: amount },
          withdrawn: { increment: amount },
        },
      });

      // 2. Create Transaction Record
      return await tx.transaction.create({
        data: {
          userId: session.user.id,
          amount,
          type: "WITHDRAWAL",
          status: "COMPLETED",
          description: "Payout to bank account",
        },
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}