import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Valid types based on your new Australia-optimized UI
const VALID_TYPES = ["BANK", "PAYPAL", "STRIPE", "WISE", "PAYONEER"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // 1. Authentication Check
  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { type, details } = await req.json();

    // 2. Basic Server-side Validation
    if (!type || !details) {
      return new NextResponse("Missing provider type or account details", { status: 400 });
    }

    if (!VALID_TYPES.includes(type.toUpperCase())) {
      return new NextResponse("Invalid payout provider selected", { status: 400 });
    }

    // 3. Upsert Payout Method
    // This updates if it exists for the user, otherwise creates it.
    const payout = await prisma.payoutMethod.upsert({
      where: { 
        userId: session.user.id 
      },
      update: { 
        type: type.toUpperCase(), 
        details: details.trim(),
        updatedAt: new Date() // Ensure the timestamp updates
      },
      create: {
        userId: session.user.id,
        type: type.toUpperCase(),
        details: details.trim(),
      },
    });

    return NextResponse.json(payout);
  } catch (error) {
    console.error("[PAYOUT_METHOD_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

  try {
    await prisma.payoutMethod.delete({
      where: { userId: session.user.id },
    });
    return new NextResponse("Deleted", { status: 200 });
  } catch (error) {
    console.error("[PAYOUT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}