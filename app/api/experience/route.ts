import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })
  }

  const experience = await prisma.experience.create({
  data: {
    title: body.title,
    company: body.company,
    description: body.description,
    startDate: body.startDate, // Prisma handles ISO strings here
    endDate: body.endDate,     // Prisma handles ISO strings or null here
    current: body.current,     // Boolean
    profileId: profile.id,
  },
});

  return NextResponse.json(experience)
}