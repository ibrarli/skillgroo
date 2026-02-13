import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TalentOrdersSection from "@/components/worker/orders/TalentOrdersSection";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) return { title: "Orders | Dashboard" };

  // Fetch the count of active orders
  const activeCount = await prisma.order.count({
    where: {
      providerId: session.user.id,
      status: "IN_PROGRESS", // Adjust this status to match your schema
    },
  });

  return {
    title: activeCount > 0 
      ? `Orders (${activeCount}) | Worker Dashboard` 
      : "Orders | Worker Dashboard",
    description: "Track your active projects and manage your workflow.",
    robots: "noindex, nofollow",
  };
}

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const userId = session.user.id;

  /**
   * We use a unified include for ALL categories.
   * This ensures that every object passed to OrderCard 
   * has exactly the same structure.
   */
  const unifiedInclude = {
    gig: true,
    customer: { 
      select: { 
        name: true, 
        username: true, 
        profile: { select: { image: true } } 
      } 
    },
    // We include 'order' so that 'Active' and 'Completed' tabs 
    // can still access reviews and proof of work.
    order: {
      include: {
        review: true,
        proof: true
      }
    }
  };

  // Parallel Data Fetching - Now querying Proposal table for EVERYTHING
  const [incoming, active, completed, rejected] = await Promise.all([
    // 1. Pending Proposals
    prisma.proposal.findMany({
      where: { providerId: userId, status: "PENDING" },
      include: unifiedInclude,
      orderBy: { createdAt: "desc" }
    }),
    // 2. Active Work (Using your updated Enum statuses)
    prisma.proposal.findMany({
      where: { 
        providerId: userId, 
        status: { in: ["ACCEPTED", "IN_PROGRESS", "SUBMITTED"] } 
      },
      include: unifiedInclude,
      orderBy: { updatedAt: "desc" }
    }),
    // 3. Completed Work (Now fetching from Proposal, not Order)
    prisma.proposal.findMany({
      where: { 
        providerId: userId, 
        status: "COMPLETED" 
      },
      include: unifiedInclude,
      orderBy: { updatedAt: "desc" }
    }),
    // 4. History (Cancelled/Declined)
    prisma.proposal.findMany({
      where: { 
        providerId: userId, 
        status: { in: ["DECLINED", "CANCELLED"] } 
      },
      include: unifiedInclude,
      orderBy: { updatedAt: "desc" }
    })
  ]);

  return (
    <TalentOrdersSection 
      incoming={incoming} 
      active={active} 
      completed={completed} 
      rejected={rejected} 
    />
  );
}