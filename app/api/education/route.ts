// /app/api/education/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch profile first
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user!.id },
  });

  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Fetch all educations for this profile
  const educations = await prisma.education.findMany({
    where: { profileId: profile.id },
    orderBy: { from: "desc" }, // most recent first
  });

  return NextResponse.json(educations);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { degree, institution, from, to, present } = body;

  if (!degree || !institution || !from)
    return NextResponse.json(
      { error: "Degree, institution, and from date are required" },
      { status: 400 }
    );

  // Fetch profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user!.id },
  });

  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  // Create new education
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
}