import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const educations = await prisma.education.findMany({
      where: { profile: { userId: session.user.id } },
      orderBy: { startDate: "desc" }, // Updated to match schema
    });
    return NextResponse.json(educations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    // Use the keys being sent by the modal
    const { degree, institution, startDate, endDate, current } = body;

    // Strict validation: every field is filled before saving
    if (!degree || !institution || !startDate || (!current && !endDate)) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        degree,
        institution,
        startDate: new Date(startDate),
        endDate: current ? null : new Date(endDate),
        current: current || false,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Education POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}