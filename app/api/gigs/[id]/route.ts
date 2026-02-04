import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// PUT: update gig
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: gigId } = await params // await params before accessing
  if (!gigId) return NextResponse.json({ error: "Gig ID missing" }, { status: 400 })

  const body = await req.json()
  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

  const existing = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!existing || existing.profileId !== profile.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 })
  }

  const updatedGig = await prisma.gig.update({
    where: { id: gigId },
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      location: body.location,
      category: body.category,
      status: body.status,
      image: body.image,
    },
  })

  return NextResponse.json(updatedGig)
}

// DELETE: delete gig
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is now a Promise
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: gigId } = await params // await params before accessing
  if (!gigId) return NextResponse.json({ error: "Gig ID missing" }, { status: 400 })

  const profile = await prisma.profile.findUnique({ where: { userId: session.user.id } })
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 })

  const existing = await prisma.gig.findUnique({ where: { id: gigId } })
  if (!existing || existing.profileId !== profile.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 })
  }

  await prisma.gig.delete({ where: { id: gigId } })
  return NextResponse.json({ success: true })
}