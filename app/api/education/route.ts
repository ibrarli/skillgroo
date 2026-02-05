import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Use alias for safety
import { prisma } from "@/lib/prisma";

// --- GET: Fetch all education for the logged-in user ---
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const educations = await prisma.education.findMany({
      where: {
        profile: { userId: session.user.id }
      },
      orderBy: { from: "desc" },
    });

    return NextResponse.json(educations);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

// --- POST: Create new education entry ---
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { degree, institution, from, to, present } = body;

    if (!degree || !institution || !from) {
      return NextResponse.json(
        { error: "Degree, institution, and from date are required" },
        { status: 400 }
      );
    }

    // Find the profile linked to this user
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found. Please create a profile first." }, { status: 404 });
    }

    const education = await prisma.education.create({
      data: {
        profileId: profile.id,
        degree,
        institution,
        from: new Date(from),
        to: to ? new Date(to) : null,
        present: present || false,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Education POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}