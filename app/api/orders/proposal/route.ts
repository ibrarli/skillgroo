import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary"; 

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    
    // Extracting fields
    const gigId = formData.get("gigId") as string;
    const providerId = formData.get("providerId") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const offeredPrice = parseFloat(formData.get("offeredPrice") as string) || 0;
    const estimatedHours = parseInt(formData.get("estimatedHours") as string) || 0;
    const deadlineDays = parseInt(formData.get("deadlineDays") as string) || 0;
    
    // Robust date handling
    const rawDate = formData.get("startDate") as string;
    const startDate = rawDate ? new Date(rawDate) : new Date();

    // 1. Validation Check
    if (!gigId || !providerId) {
      return NextResponse.json({ error: "Missing Gig ID or Provider ID" }, { status: 400 });
    }

    // 2. Image Upload Handling
    const files = formData.getAll("images") as File[];
    const imageUrls: string[] = [];

    for (const file of files) {
      if (file && file.size > 0) {
        try {
          const url = await uploadImage(file);
          if (url) imageUrls.push(url as string);
        } catch (uploadErr) {
          console.error("Cloudinary Upload Failed:", uploadErr);
        }
      }
    }

    // 3. Create Proposal
    const proposal = await prisma.proposal.create({
      data: {
        description,
        estimatedHours,
        startDate,
        deadlineDays,
        location,
        offeredPrice,
        images: imageUrls,
        status: "PENDING",
        // Connections
        gig: { connect: { id: gigId } },
        provider: { connect: { id: providerId } },
        customer: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json({ success: true, proposal }, { status: 201 });

  } catch (error: any) {
    console.error("CRITICAL_PROPOSAL_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


