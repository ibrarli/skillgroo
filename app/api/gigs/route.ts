import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const mine = url.searchParams.get("mine") === "true";

    if (mine) {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

      // Find the profile belonging to the user
      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      });

      if (!profile) return NextResponse.json([], { status: 200 }); // Return empty array if no profile

      const gigs = await prisma.gig.findMany({
        where: { profileId: profile.id }, // Correctly filtering by profileId from your schema
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(gigs);
    } else {
      // Public feed
      const gigs = await prisma.gig.findMany({
        include: { profile: { include: { user: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(gigs);
    }
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) return NextResponse.json({ error: "Create a profile first" }, { status: 400 });

    const data = await req.formData();
    
    // Convert types correctly for Prisma
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const price = parseFloat(data.get("price") as string);
    const location = data.get("location") as string;
    const category = data.get("category") as string || "General";
    const status = data.get("status") as string || "active";
    const imageFile = data.get("image") as File | null;

    if (!title || !description || isNaN(price)) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile) as string;
    }

    const gig = await prisma.gig.create({
      data: {
        title,
        description,
        price,
        location,
        category,
        status,
        image: imageUrl,
        profileId: profile.id, // Linked via your Profile model ID
      },
    });

    return NextResponse.json(gig);
  } catch (error: any) {
    console.error("POST_GIG_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}