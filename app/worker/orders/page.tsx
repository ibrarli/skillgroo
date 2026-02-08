import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TalentOrdersSection from "@/components/worker/orders/TalentOrdersSection";

export default async function TalentOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const userId = session.user.id;

  // Base include for Proposals (Pending/Rejected)
  const proposalInclude = {
    gig: true,
    customer: { 
      select: { 
        name: true, 
        username: true, 
        profile: { select: { image: true } } 
      } 
    }
  };

  // Extended include for Orders (Active/Completed)
  const orderInclude = {
    ...proposalInclude,
    review: true,
    proof: true
  };

  // Parallel Data Fetching
  const [incoming, active, completed, rejected] = await Promise.all([
    prisma.proposal.findMany({
      where: { providerId: userId, status: "PENDING" },
      include: proposalInclude,
      orderBy: { createdAt: "desc" }
    }),
    prisma.order.findMany({
      where: { providerId: userId, status: { in: ["IN_PROGRESS", "SUBMITTED"] } },
      include: orderInclude,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.order.findMany({
      where: { providerId: userId, status: "COMPLETED" },
      include: orderInclude,
      orderBy: { updatedAt: "desc" }
    }),
    prisma.proposal.findMany({
      where: { providerId: userId, status: { in: ["DECLINED", "CANCELLED"] } },
      include: proposalInclude,
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