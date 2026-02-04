import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET: public or personal gigs
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const mine = url.searchParams.get("mine") === "true"

  if (mine) {
    const session = await getServerSession(authOptions)
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })
    if (!profile)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })

    const gigs = await prisma.gig.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(gigs)
  } else {
    const gigs = await prisma.gig.findMany({
      include: { profile: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(gigs)
  }
}

// POST: create gig
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })
  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })

  const { title, description, price, location, category, status, image } =
    await req.json()

  if (!title || !description || !price || !location)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

  const gig = await prisma.gig.create({
    data: {
      profileId: profile.id,
      title,
      description,
      price,
      location,
      category,
      status,
      image,
    },
  })

  return NextResponse.json(gig)
}