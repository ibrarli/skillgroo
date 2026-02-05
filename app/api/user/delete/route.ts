import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { password } = await req.json();

    // 1. Fetch user & linked profile
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Verify Identity
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    const profileId = user.profile?.id;

    // 3. Sequential Transaction with Extended Timeout
    // P2028 fix: We increase timeout to 20 seconds to handle large data sets
    await prisma.$transaction(async (tx) => {
      
      if (profileId) {
        // Find all Gigs associated with this profile
        const userGigs = await tx.gig.findMany({
          where: { profileId },
          select: { id: true }
        });
        const gigIds = userGigs.map(g => g.id);

        // A. DELETE GIG DEPENDENTS (The "Order_gigId_fkey" fix)
        if (gigIds.length > 0) {
          await tx.order.deleteMany({ where: { gigId: { in: gigIds } } });
          await tx.impression.deleteMany({ where: { gigId: { in: gigIds } } });
          await tx.click.deleteMany({ where: { gigId: { in: gigIds } } });
          await tx.review.deleteMany({ where: { gigId: { in: gigIds } } });
          
          // Now safe to delete the Gigs
          await tx.gig.deleteMany({ where: { id: { in: gigIds } } });
        }

        // B. DELETE PROFILE DEPENDENTS
        await tx.experience.deleteMany({ where: { profileId } });
        await tx.education.deleteMany({ where: { profileId } });
        await tx.skill.deleteMany({ where: { profileId } });
        await tx.portfolio.deleteMany({ where: { profileId } });
        
        // Delete reviews written by this specific user
        await tx.review.deleteMany({ where: { reviewerId: profileId } });

        // C. DELETE PROFILE
        await tx.profile.delete({ where: { id: profileId } });
      }

      // D. DELETE USER DEPENDENTS
      // Delete orders where user was the customer
      await tx.order.deleteMany({ 
        where: { customerId: user.id } 
      });
      
      await tx.transaction.deleteMany({ where: { userId: user.id } });
      await tx.earnings.deleteMany({ where: { userId: user.id } });
      await tx.notification.deleteMany({ where: { userId: user.id } });

      // E. FINAL BLOW: DELETE THE USER
      await tx.user.delete({ where: { id: user.id } });

    }, {
      maxWait: 5000, 
      timeout: 20000 // 20 seconds to ensure large histories don't timeout
    });

    return NextResponse.json({ message: "Account wiped successfully" });

  } catch (error: any) {
    console.error("Critical Wipe Error:", error);
    return NextResponse.json(
      { error: "Failed to delete account. Please try again." }, 
      { status: 500 }
    );
  }
}