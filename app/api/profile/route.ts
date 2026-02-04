import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      experiences: true,
      educations: true,
      skills: true,
      gigs: true,
    },
  })

  return NextResponse.json(profile)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const profile = await prisma.profile.upsert({
    where: { userId: session.user.id },
    update: {
      title: body.title,
      about: body.about,
      location: body.location,
      image: body.image,
    },
    create: {
      userId: session.user.id,
      title: body.title || "",
      about: body.about || "",
      location: body.location || "",
      image: body.image || "",
    },
  })

  return NextResponse.json(profile)
}