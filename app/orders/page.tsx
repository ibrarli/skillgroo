import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/global/Header";
// Standardized to use ProposalCard for everything
import ProposalCard from "@/components/subcomponents/orders/OrderCard"; 
import { ShoppingBag, Send, Ban, PackageSearch, CheckCircle } from "lucide-react";

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const userId = session.user.id;

  // REUSABLE INCLUDE OBJECT - Ensuring consistency across all queries
  const commonInclude = {
    gig: true,
    provider: { 
      select: { 
        name: true, 
        username: true,
        profile: { select: { image: true } }
      } 
    }
  };

  // 1. ACTIVE PURCHASES (In Progress or Submitted for review)
  const activePurchases = await prisma.order.findMany({
    where: { 
      customerId: userId,
      status: { in: ["IN_PROGRESS", "SUBMITTED"] } 
    },
    include: commonInclude,
    orderBy: { updatedAt: "desc" }
  });

  // 2. COMPLETED ORDERS
  const completedOrders = await prisma.order.findMany({
    where: { 
      customerId: userId,
      status: "COMPLETED" 
    },
    include: commonInclude,
    orderBy: { updatedAt: "desc" }
  });

  // 3. SENT PROPOSALS
  const sentProposals = await prisma.proposal.findMany({
    where: { 
      customerId: userId,
      status: "PENDING" 
    },
    include: commonInclude,
    orderBy: { createdAt: "desc" }
  });

  // 4. REJECTED/CANCELLED
  const rejectedHistory = await prisma.proposal.findMany({
    where: { 
      customerId: userId,
      status: { in: ["DECLINED", "CANCELLED"] } 
    },
    include: commonInclude,
    orderBy: { updatedAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <Header />
      <main className="max-w-6xl mx-auto w-full p-8 pt-24 space-y-16 pb-32">
        
        {/* SECTION 1: ACTIVE PURCHASES */}
        <section className="space-y-6">
          <SectionHeader icon={<ShoppingBag size={22} />} title="Active Purchases" color="bg-blue-500/10 text-blue-600" />
          {activePurchases.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {activePurchases.map((order: any) => (
                <ProposalCard key={order.id} proposal={order} role="customer" />
              ))}
            </div>
          ) : (
            <EmptyState message="No active purchases" />
          )}
        </section>

        {/* SECTION 2: COMPLETED ORDERS */}
        {completedOrders.length > 0 && (
          <section className="space-y-6">
            <SectionHeader icon={<CheckCircle size={22} />} title="Completed Orders" color="bg-green-500/10 text-green-600" />
            <div className="grid grid-cols-1 gap-4">
              {completedOrders.map((order: any) => (
                <ProposalCard key={order.id} proposal={order} role="customer" />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: SENT PROPOSALS */}
        <section className="space-y-6">
          <SectionHeader icon={<Send size={22} />} title="Sent Proposals" color="bg-amber-500/10 text-amber-500" />
          {sentProposals.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {sentProposals.map((proposal: any) => (
                <ProposalCard key={proposal.id} proposal={proposal} role="customer" />
              ))}
            </div>
          ) : (
            <EmptyState message="No pending proposals" />
          )}
        </section>

        {/* SECTION 4: REJECTED/CANCELLED */}
        {rejectedHistory.length > 0 && (
          <section className="space-y-6 opacity-60 grayscale-[0.8] hover:grayscale-0 hover:opacity-100 transition-all">
            <SectionHeader icon={<Ban size={22} />} title="Rejected & Cancelled" color="bg-red-500/10 text-red-500" />
            <div className="grid grid-cols-1 gap-4">
              {rejectedHistory.map((proposal: any) => (
                <ProposalCard key={proposal.id} proposal={proposal} role="customer" />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

// Sub-components for cleaner structure
function SectionHeader({ icon, title, color }: { icon: React.ReactNode, title: string, color: string }) {
  return (
    <div className="flex items-center gap-3 border-b dark:border-neutral-800 pb-4">
      <div className={`p-2.5 rounded-xl ${color}`}>
        {icon}
      </div>
      <h2 className="text-xl font-black dark:text-white uppercase tracking-tighter">{title}</h2>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center bg-white dark:bg-neutral-900/50 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem] text-center">
      <PackageSearch size={32} className="text-neutral-300 mb-2" />
      <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-widest">{message}</p>
    </div>
  );
}