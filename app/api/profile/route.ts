import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      experiences: true,
      educations: true,
      skills: true,
      gigs: true,
      portfolio: true,
    },
  });

  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.formData();
    
    // Extract text fields for User table
    const name = data.get("name") as string | null;
    const username = data.get("username") as string | null;

    // Extract text fields for Profile table
    const title = data.get("title") as string | null;
    const about = data.get("about") as string | null;
    const location = data.get("location") as string | null;
    const imageFile = data.get("image") as File | null;

    let imageUrl = undefined;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile) as string;
    }

    // Prepare update payload for the Profile
    const profilePayload: any = {};
    if (title !== null) profilePayload.title = title;
    if (about !== null) profilePayload.about = about;
    if (location !== null) profilePayload.location = location;
    if (imageUrl) profilePayload.image = imageUrl;

    // Use a Transaction to update both tables simultaneously
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update User Record (Name and Username)
      if (name || username) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            ...(name && { name }),
            ...(username && { username }),
          },
        });
      }

      // 2. Upsert Profile Record
      return await tx.profile.upsert({
        where: { userId: session.user.id },
        update: profilePayload,
        create: {
          userId: session.user.id,
          title: title || "",
          about: about || "",
          location: location || "",
          image: imageUrl || "",
        },
        include: {
          user: true, // Returns the updated user object back to the frontend
        }
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("PROFILE_UPDATE_ERROR:", error);
    // Specifically catch unique constraint errors (e.g., username taken)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}