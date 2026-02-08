import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Await params (Next.js 15 requirement)
    const { id: eduId } = await params;
    const body = await req.json();

    // 2. Fetch profile to verify ownership
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 3. Find existing record
    const existing = await prisma.education.findUnique({
      where: { id: eduId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // 4. Verify ownership
    if (existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 5. Update with correct schema fields
    const updatedEducation = await prisma.education.update({
      where: { id: eduId },
      data: {
        degree: body.degree,
        institution: body.institution,
        // Syncing keys: body.startDate, body.endDate, body.current
        startDate: body.startDate ? new Date(body.startDate) : undefined, 
        endDate: body.current ? null : (body.endDate ? new Date(body.endDate) : null),
        current: body.current,
      },
    });

    return NextResponse.json(updatedEducation);
  } catch (error) {
    console.error("[EDUCATION_PATCH_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Await params
    const { id: eduId } = await params;

    // 2. Fetch profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 3. Find and Verify Ownership
    const existing = await prisma.education.findUnique({
      where: { id: eduId },
    });

    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Execute Delete
    await prisma.education.delete({
      where: { id: eduId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EDUCATION_DELETE_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}