import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, username, email, password } = body

    if (!email || !password || !username) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    })

    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username"
      return NextResponse.json({ error: `${field} is already taken` }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // FIXED: Added nested profile creation
    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        // This ensures the Profile record is created at the exact same time
        profile: {
          create: {
            title: "New Talent",
            about: `Hi, I'm ${name || username}!`,
            location: "Not specified",
          }
        }
      },
      // Include profile in the response so you can see it worked
      include: {
        profile: true
      }
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error("SIGNUP_ERROR:", error) // Always log your errors to the terminal!
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}