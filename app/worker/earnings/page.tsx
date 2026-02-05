import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import StatCard from "@/components/worker/analytics/StatCard";
import TransactionTable from "@/components/worker/analytics/TransactionTable";
import WithdrawModal from "@/components/worker/earnings/WithdrawModal";
import { Wallet, ArrowUpRight, Clock, Banknote } from "lucide-react";

export default async function EarningsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  // Fetch or initialize earnings
  let earnings = await prisma.earnings.findUnique({
    where: { userId: session.user.id },
  });

  if (!earnings) {
    earnings = await prisma.earnings.create({
      data: { userId: session.user.id, totalBalance: 0, withdrawn: 0, pendingAmount: 0 },
    });
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-6xl mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div>
                <h1 className="text-4xl font-black text-neutral-900 dark:text-white">Earnings</h1>
                <p className="text-neutral-500 font-medium">Monitor your revenue and payouts</p>
              </div>
              <WithdrawModal balance={earnings.totalBalance} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                title="Available Balance" 
                amount={earnings.totalBalance} 
                icon={<Wallet className="text-primary" />} 
                trend="Ready to withdraw"
              />
              <StatCard 
                title="Pending Clearance" 
                amount={earnings.pendingAmount} 
                icon={<Clock className="text-amber-500" />} 
                trend="In review"
              />
              <StatCard 
                title="Total Withdrawn" 
                amount={earnings.withdrawn} 
                icon={<ArrowUpRight className="text-emerald-500" />} 
                trend="Lifetime payouts"
              />
            </div>

            {/* Transaction Section */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Banknote size={20} className="text-primary" />
                Recent Transactions
              </h2>
              <TransactionTable transactions={transactions} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}