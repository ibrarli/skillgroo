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
      reviews: true, 
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
    
    // 1. Extract Fields
    const name = data.get("name") as string | null;
    const username = data.get("username") as string | null;
    const title = data.get("title") as string | null;
    const about = data.get("about") as string | null;
    const location = data.get("location") as string | null;
    const imageFile = data.get("image") as File | null;
    
    // 2. Safe JSON Parsing for Languages
    let languages = undefined;
    const languagesRaw = data.get("languages") as string | null;
    if (languagesRaw) {
      try {
        languages = JSON.parse(languagesRaw);
      } catch (e) {
        console.error("Language parse error:", e);
      }
    }

    // 3. Image Upload logic
    let imageUrl = undefined;
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile) as string;
    }

    // 4. Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update User if name/username changed
      if (name || username) {
        await tx.user.update({
          where: { id: session.user.id },
          data: {
            ...(name && { name }),
            ...(username && { username }),
          },
        });
      }

      // Upsert Profile
      return await tx.profile.upsert({
        where: { userId: session.user.id },
        update: {
          ...(title !== null && { title }),
          ...(about !== null && { about }),
          ...(location !== null && { location }),
          ...(languages !== undefined && { languages }),
          ...(imageUrl && { image: imageUrl }),
        },
        create: {
          userId: session.user.id,
          title: title || "",
          about: about || "",
          location: location || "",
          languages: languages || [],
          image: imageUrl || "",
        },
        // Include ALL relations so the frontend state doesn't break
        include: {
          user: true,
          experiences: true,
          educations: true,
          skills: true,
          portfolio: true,
          gigs: true, // Added this back in to match your GET
          reviews: true,
        }
      });
    },{
      maxWait: 10000, // Time Prisma waits for a connection (10s)
      timeout: 20000  // Time the transaction is allowed to run (20s)
    });
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("PROFILE_UPDATE_ERROR:", error);
    
    // Handle Unique Constraint (Username taken)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Username is already taken" }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}