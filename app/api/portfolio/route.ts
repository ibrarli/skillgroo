import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // fetch the profile of the logged-in user
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })

  const portfolio = await prisma.portfolio.findMany({
    where: { profileId: profile.id }, // only this user's portfolio
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(portfolio)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 })

  const {
    title,
    description,
    projectImage,
    hours,
    rate,
    startDate,
    endDate,
  } = await req.json()

  if (!title || !description || !hours || !rate || !startDate)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

  const cost = hours * rate

  const portfolio = await prisma.portfolio.create({
    data: {
      profileId: profile.id, // link directly to this user's profile
      title,
      description,
      projectImage,
      hours,
      rate,
      cost,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  })

  return NextResponse.json(portfolio)
}