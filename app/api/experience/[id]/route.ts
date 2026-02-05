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

    const { id: expId } = await params;
    const body = await req.json();

    // 1. Fetch Profile with Guard
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Fetch Experience with Guard
    const existing = await prisma.experience.findUnique({
      where: { id: expId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    // 3. Ownership Check
    if (existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.experience.update({
      where: { id: expId },
      data: {
        title: body.title,
        company: body.company,
        description: body.description,
        from: new Date(body.from),
        to: body.present ? null : new Date(body.to),
        present: body.present,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[EXP_PATCH]", error);
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

    const { id: expId } = await params;

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const existing = await prisma.experience.findUnique({
      where: { id: expId },
    });

    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.experience.delete({
      where: { id: expId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[EXP_DELETE]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}