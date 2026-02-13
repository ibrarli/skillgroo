import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  const { type, details } = await req.json();

  try {
    const payout = await prisma.payoutMethod.upsert({
      where: { userId: session.user.id },
      update: { type, details },
      create: {
        userId: session.user.id,
        type,
        details,
      },
    });
    return NextResponse.json(payout);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}