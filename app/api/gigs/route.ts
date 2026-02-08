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

      const profile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      });

      if (!profile) return NextResponse.json([], { status: 200 });

      const gigs = await prisma.gig.findMany({
        where: { profileId: profile.id },
        include: {
          profile: {
            include: {
              user: {
                select: {
                  username: true,
                  name: true,
                  // Removed 'image: true' to fix the TS(2353) error
                }
              }
            }
          }
        },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(gigs);
    } else {
      const gigs = await prisma.gig.findMany({
        include: { profile: { include: { user: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(gigs);
    }
  } catch (error) {
    console.error("GET_GIGS_ERROR:", error);
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
    
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const price = parseFloat(data.get("price") as string);
    const location = data.get("location") as string;
    const category = data.get("category") as string;
    const serviceType = data.get("serviceType") as string; 
    const status = data.get("status") as string || "active";
    const keywords = data.get("keywords") as string || ""; 
    const imageFile = data.get("image") as File | null;

    if (!title || !description || isNaN(price) || !location || !category || !serviceType) {
      return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
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
        serviceType,
        keywords,
        status,
        image: imageUrl,
        profileId: profile.id,
      },
    });

    return NextResponse.json(gig);
  } catch (error: any) {
    console.error("POST_GIG_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const urlParts = req.url.split("/");
    const id = urlParts.pop() || urlParts.pop(); 

    if (!id) return NextResponse.json({ error: "Gig ID missing" }, { status: 400 });

    const data = await req.formData();
    const imageFile = data.get("image") as File | null;

    const updateData: any = {
      title: data.get("title"),
      description: data.get("description"),
      price: parseFloat(data.get("price") as string),
      location: data.get("location"),
      category: data.get("category"),
      serviceType: data.get("serviceType"),
      status: data.get("status"),
      keywords: data.get("keywords"),
    };

    if (imageFile && imageFile.size > 0) {
      updateData.image = await uploadImage(imageFile);
    }

    const updatedGig = await prisma.gig.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedGig);
  } catch (error: any) {
    console.error("PUT_GIG_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}