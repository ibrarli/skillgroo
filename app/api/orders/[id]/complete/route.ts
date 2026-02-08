import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- GET: Fetch proof data for the Customer to review ---
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    const proof = await prisma.orderProof.findUnique({
      where: { orderId: id },
    });

    if (!proof) return new NextResponse("Proof not found", { status: 404 });

    return NextResponse.json(proof);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// --- POST: Talent submits work ---
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const { description, externalLink, images } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: id },
    });

    if (!order || order.providerId !== session.user.id) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const uploadedImages = await Promise.all(
      images.map(async (base64: string) => {
        const uploadResponse = await cloudinary.uploader.upload(base64, {
          folder: "order_proofs",
        });
        return uploadResponse.secure_url;
      })
    );

    const result = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id: id },
        data: { status: "SUBMITTED" },
      });

      await tx.orderProof.upsert({
        where: { orderId: id },
        update: {
          description,
          externalLink,
          images: uploadedImages,
        },
        create: {
          orderId: id,
          description,
          externalLink,
          images: uploadedImages,
        },
      });

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ORDER_COMPLETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}