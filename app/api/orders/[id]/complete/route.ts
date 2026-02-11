// api/orders/[id]/complete/route.ts

// Used for Talent Submitting proof of work and Customer seeing the work 

// Used in: OrderCompletionModal.tsx
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

/* ===========================================================
   GET: Fetch proof data (Used by Customer in Review Modal)
   =========================================================== */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;

    // 1. Try to find the proof directly by Order ID
    let proof = await prisma.orderProof.findUnique({
      where: { orderId: id },
    });

    // 2. FALLBACK: If the frontend passed a Proposal ID instead of an Order ID
    if (!proof) {
      const order = await prisma.order.findUnique({
        where: { proposalId: id },
        select: { id: true }
      });

      if (order) {
        proof = await prisma.orderProof.findUnique({
          where: { orderId: order.id },
        });
      }
    }

    if (!proof) return new NextResponse("Proof not found", { status: 404 });

    return NextResponse.json(proof);
  } catch (error) {
    console.error("[GET_PROOF_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/* ===========================================================
   POST: Talent submits work (Used by Worker in Completion Modal)
   =========================================================== */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id } = await params;
    const { description, externalLink, images } = await req.json();

    // 1. Fetch the order with explicit selection
    // Fallback included: checks if 'id' is Order ID or Proposal ID
    let order = await prisma.order.findUnique({
      where: { id: id },
      select: { id: true, providerId: true, proposalId: true }
    });

    if (!order) {
      order = await prisma.order.findUnique({
        where: { proposalId: id },
        select: { id: true, providerId: true, proposalId: true }
      });
    }

    if (!order) return new NextResponse("Order not found", { status: 404 });

    // 2. Permission Check (Must be the Talent/Provider)
    if (String(order.providerId) !== String(session.user.id)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 3. Cloudinary Upload
    const uploadedImages = await Promise.all(
      images.map(async (base64: string) => {
        const uploadResponse = await cloudinary.uploader.upload(base64, {
          folder: "order_proofs",
        });
        return uploadResponse.secure_url;
      })
    );

    // 4. Transaction to update everything
    const result = await prisma.$transaction(async (tx) => {
      // Update Order Status
      const updatedOrder = await tx.order.update({
        where: { id: order!.id },
        data: { status: "SUBMITTED" },
      });

      // Update Proposal Status
      if (order?.proposalId) {
        await tx.proposal.update({
          where: { id: order.proposalId },
          data: { status: "SUBMITTED" },
        });
      }

      // Save/Update Proof (Ensuring we use the REAL Order ID)
      await tx.orderProof.upsert({
        where: { orderId: order!.id },
        update: {
          description,
          externalLink,
          images: uploadedImages,
        },
        create: {
          orderId: order!.id,
          description,
          externalLink,
          images: uploadedImages,
        },
      });

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[ORDER_SUBMIT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}