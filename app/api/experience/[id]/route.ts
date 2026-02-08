import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * PATCH: Update an existing experience entry
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Define params as a Promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 1. UNWRAP PARAMS (Next.js 15 Fix)
    const { id: expId } = await params;

    if (!expId) {
      return NextResponse.json({ message: "Experience ID is required" }, { status: 400 });
    }

    const body = await req.json();

    // 2. Date Safety Logic
    const start = body.startDate ? new Date(body.startDate) : null;
    const end = body.endDate ? new Date(body.endDate) : null;

    // 3. Update in Database
    const updated = await prisma.experience.update({
      where: { 
        id: expId 
      },
      data: {
        title: body.title,
        company: body.company,
        description: body.description,
        startDate: start && !isNaN(start.getTime()) ? start : undefined,
        endDate: body.current ? null : (end && !isNaN(end.getTime()) ? end : null),
        current: body.current,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH ERROR:", error);
    if (error.code === 'P2025') {
      return NextResponse.json({ message: "Record not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * DELETE: Remove an experience entry
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Define params as a Promise
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. UNWRAP PARAMS (Next.js 15 Fix)
    const { id: expId } = await params;

    // 2. Verify Profile ownership
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 3. Verify Ownership of the record
    const existing = await prisma.experience.findUnique({
      where: { id: expId },
    });

    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Perform Delete
    await prisma.experience.delete({
      where: { id: expId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EXP_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}