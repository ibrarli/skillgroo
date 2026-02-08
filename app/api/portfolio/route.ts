import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Optimized: Get profile and portfolio items in ONE single query
    const profileWithPortfolio = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        portfolio: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!profileWithPortfolio) return NextResponse.json([]);

    return NextResponse.json(profileWithPortfolio.portfolio);
  } catch (error) {
    console.error("PORTFOLIO_GET_ERROR", error);
    return NextResponse.json({ error: "Database timeout or error" }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.formData();
    
    // 1. Extract the new location field
    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const location = data.get("location") as string; // <--- ADDED THIS
    const hours = Number(data.get("hours") || 0);
    const rate = Number(data.get("rate") || 0);
    const startDate = data.get("startDate") as string;
    const endDate = data.get("endDate") as string;
    const imageFile = data.get("image") as File | null;

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      select: { id: true }
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    let projectImageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "portfolios" }, (err, res) => {
          if (err) reject(err); else resolve(res);
        }).end(buffer);
      });
      projectImageUrl = uploadResponse.secure_url;
    }

    // 2. Save location to the Database
    const portfolioEntry = await prisma.portfolio.create({
      data: {
        title,
        description,
        location,
        hours,
        rate,
        cost: hours * rate,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        projectImage: projectImageUrl,
        profileId: profile.id,
      },
    });

    return NextResponse.json(portfolioEntry);
  } catch (error) {
    console.error("POST_ERROR", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}