import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CustomerOrdersSection from "@/components/customer/orders/CustomerOrdersSection";

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;

  const unifiedInclude = {
    gig: true,
    provider: { 
      select: { 
        name: true, 
        username: true,
        profile: { select: { image: true } }
      } 
    },
    order: {
      include: {
        review: true,
        proof: true
      }
    }
  };

  const [active, completed, sent, rejected] = await Promise.all([
    // 1. Active (Purchased but not finished)
    prisma.proposal.findMany({
      where: { customerId: userId, status: { in: ["ACCEPTED", "IN_PROGRESS", "SUBMITTED"] } },
      include: unifiedInclude,
      orderBy: { updatedAt: "desc" }
    }),
    // 2. Completed
    prisma.proposal.findMany({
      where: { customerId: userId, status: "COMPLETED" },
      include: unifiedInclude,
      orderBy: { updatedAt: "desc" }
    }),
    // 3. Sent (Pending provider response)
    prisma.proposal.findMany({
      where: { customerId: userId, status: "PENDING" },
      include: unifiedInclude,
      orderBy: { createdAt: "desc" }
    }),
    // 4. History
    prisma.proposal.findMany({
      where: { customerId: userId, status: { in: ["DECLINED", "CANCELLED"] } },
      include: unifiedInclude,
      orderBy: { updatedAt: "desc" }
    })
  ]);

  return (
    <CustomerOrdersSection 
      active={active} 
      completed={completed} 
      sent={sent} 
      rejected={rejected} 
    />
  );
}