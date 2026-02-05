import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const userId = url.searchParams.get("userId"); // Get the current user's ID

    if (!username) {
      return NextResponse.json(
        { available: false, error: "Username query is required" },
        { status: 400 }
      );
    }

    // Logic: Find a user with this username, BUT exclude the current user
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: 'insensitive' // Optional: makes check case-insensitive
        },
        NOT: {
          id: userId || "" // If userId is provided, ignore that specific record
        }
      },
      select: { id: true },
    });

    // If no OTHER user has this username, it's available for you
    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error("Check username failed:", error);
    return NextResponse.json(
      { available: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}