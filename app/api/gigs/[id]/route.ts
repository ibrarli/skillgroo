import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // 1. Strict Null Guard for Session
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Capture userId to satisfy TS type narrowing
    const userId = session.user.id;
    const { id: gigId } = await params;
    const data = await req.formData();

    // 2. Verify Profile and Ownership
    const profile = await prisma.profile.findUnique({ where: { userId } });
    
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const existing = await prisma.gig.findUnique({ where: { id: gigId } });

    // existing is checked for null, and profile.id is now guaranteed
    if (!existing || existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Prepare Update Data
    const imageFile = data.get("image");
    const updateData: any = {
      title: data.get("title") as string,
      description: data.get("description") as string,
      price: parseFloat(data.get("price") as string) || 0,
      location: data.get("location") as string,
      category: data.get("category") as string,
      status: data.get("status") as string,
    };

    // 4. Handle Cloudinary Upload
    if (imageFile instanceof File && imageFile.size > 0) {
      updateData.image = (await uploadImage(imageFile)) as string;
    }

    const updated = await prisma.gig.update({
      where: { id: gigId },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("GIG_PUT_ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    // Strict Null Guard
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { id: gigId } = await params;

    const profile = await prisma.profile.findUnique({ where: { userId } });
    const existing = await prisma.gig.findUnique({ where: { id: gigId } });

    if (!existing || !profile || existing.profileId !== profile.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.gig.delete({ where: { id: gigId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("GIG_DELETE_ERROR:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}