import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { user: true, experiences: true, educations: true, skills: true, gigs: true, portfolio: true, reviews: true },
  });
  return NextResponse.json(profile);
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.formData();
    const name = data.get("name") as string | null;
    const username = data.get("username") as string | null;
    const title = data.get("title") as string | null;
    const about = data.get("about") as string | null;
    const location = data.get("location") as string | null;
    const imageFile = data.get("image") as File | null;
    
    const isOnlineRaw = data.get("isOnline");
    const isOnline = isOnlineRaw !== null ? isOnlineRaw === "true" : undefined;

    let languages = undefined;
    const languagesRaw = data.get("languages") as string | null;
    if (languagesRaw) languages = JSON.parse(languagesRaw);

    let imageUrl = undefined;
    if (imageFile && imageFile.size > 0) imageUrl = await uploadImage(imageFile) as string;

    const result = await prisma.$transaction(async (tx) => {
      if (name || username) {
        await tx.user.update({
          where: { id: session.user.id },
          data: { ...(name && { name }), ...(username && { username }) },
        });
      }

      return await tx.profile.upsert({
        where: { userId: session.user.id },
        update: {
          ...(title !== null && { title }),
          ...(about !== null && { about }),
          ...(location !== null && { location }),
          ...(languages !== undefined && { languages }),
          ...(imageUrl && { image: imageUrl }),
          ...(isOnline !== undefined && { isOnline }),
          lastSeen: new Date(), 
        },
        create: {
          userId: session.user.id,
          title: title || "",
          about: about || "",
          location: location || "",
          languages: languages || [],
          image: imageUrl || "",
          isOnline: isOnline ?? false,
          lastSeen: new Date(),
        },
        include: { user: true, experiences: true, educations: true, skills: true, portfolio: true, gigs: true, reviews: true }
      });
    });
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
  }
}