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

    const { id: eduId } = await params;
    const body = await req.json();

    // 1. Get the profile belonging to the logged-in user
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Find the education record
    const existing = await prisma.education.findUnique({
      where: { id: eduId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    // 3. Verify ownership using profileId
    if (existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    const updatedEducation = await prisma.education.update({
      where: { id: eduId },
      data: {
        degree: body.degree,
        institution: body.institution,
        from: new Date(body.from), // Ensure dates are parsed correctly
        to: body.present ? null : new Date(body.to),
        present: body.present,
      },
    });

    return NextResponse.json(updatedEducation);
  } catch (error) {
    console.error("[EDUCATION_PATCH]", error);
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

    const { id: eduId } = await params;

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const existing = await prisma.education.findUnique({
      where: { id: eduId },
    });

    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    await prisma.education.delete({
      where: { id: eduId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EDUCATION_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}