import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const skills = await prisma.skill.findMany({
    where: { profile: { userId: session.user.id } },
  })

  return NextResponse.json(skills)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, level } = body

  const skill = await prisma.skill.create({
    data: {
      name,
      level: Number(level),
      profile: { connect: { userId: session.user.id } },
    },
  })

  return NextResponse.json(skill)
}