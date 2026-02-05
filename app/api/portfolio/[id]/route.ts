import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: projectId } = await params;
    const data = await req.formData();

    const existing = await prisma.portfolio.findUnique({
      where: { id: projectId },
      include: { profile: true }
    });

    if (!existing || existing.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const hours = Number(data.get("hours") || 0);
    const rate = Number(data.get("rate") || 0);
    const imageFile = data.get("image"); // Can be File object or string URL

    const updateData: any = {
      title: data.get("title") as string,
      description: data.get("description") as string,
      hours: hours,
      rate: rate,
      cost: hours * rate,
      startDate: new Date(data.get("startDate") as string),
      endDate: data.get("endDate") ? new Date(data.get("endDate") as string) : null,
    };

    // FIX: Only process if it's actually a NEW file
    if (imageFile && typeof imageFile !== "string" && (imageFile as File).size > 0) {
      const arrayBuffer = await (imageFile as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadResponse: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "portfolios" }, (err, res) => {
          if (err) reject(err); else resolve(res);
        }).end(buffer);
      });
      updateData.projectImage = uploadResponse.secure_url;
    }

    const updated = await prisma.portfolio.update({
      where: { id: projectId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH_ERROR", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const { id: projectId } = await params;
    const existing = await prisma.portfolio.findUnique({
      where: { id: projectId },
      include: { profile: true }
    });
    if (!existing || existing.profile.userId !== session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    await prisma.portfolio.delete({ where: { id: projectId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}