import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        // Only allow updating specific fields for security
        ...(data.email && { email: data.email }),
        ...(typeof data.notificationsEnabled === "boolean" && { 
           notificationsEnabled: data.notificationsEnabled 
        }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 400 });
  }
}