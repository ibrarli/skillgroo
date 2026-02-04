import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password } = body

  if (!email || !password) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return new Response(JSON.stringify({ user }), { status: 201 })
}