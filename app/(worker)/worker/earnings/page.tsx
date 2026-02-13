import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import StatCard from "@/components/worker/analytics/StatCard";
import TransactionTable from "@/components/worker/analytics/TransactionTable";
import WithdrawModal from "@/components/worker/earnings/WithdrawModal";
import EarningFilters from "@/components/worker/earnings/EarningFilters";
import PayoutMethodModal from "@/components/worker/earnings/PayoutMethodModal"; // New Import
import { Wallet, ArrowUpRight, Clock, Banknote, Activity } from "lucide-react";

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: { timeframe?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const timeframe = searchParams.timeframe || "all";
  const now = new Date();
  const COMMISSION_FACTOR = 0.9; 
  
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); 

  // Check if user has a payout method configured
  const payoutMethod = await prisma.payoutMethod.findUnique({
    where: { userId: session.user.id },
  });
  const hasPayoutMethod = !!payoutMethod;

  const settleFunds = async () => {
    const clearableOrders = await prisma.order.findMany({
      where: {
        providerId: session.user.id,
        status: "COMPLETED",
        isSettled: false,
        updatedAt: { lte: tenDaysAgo },
      },
    });

    if (clearableOrders.length > 0) {
      const amountToMove = clearableOrders.reduce(
        (acc, curr) => acc + curr.totalPrice * COMMISSION_FACTOR,
        0
      );

      await prisma.$transaction([
        prisma.earnings.update({
          where: { userId: session.user.id },
          data: { totalBalance: { increment: amountToMove } },
        }),
        prisma.order.updateMany({
          where: { id: { in: clearableOrders.map((o) => o.id) } },
          data: { isSettled: true },
        }),
        prisma.transaction.create({
          data: {
            userId: session.user.id,
            amount: amountToMove,
            type: "DEPOSIT", 
            status: "COMPLETED",
            description: `Cleared funds for ${clearableOrders.length} order(s) (10% platform fee deducted)`,
          },
        }),
      ]);
    }
  };

  await settleFunds();

  let dateFilter = {};
  if (timeframe === "month") {
    dateFilter = { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
  } else if (timeframe === "year") {
    dateFilter = { createdAt: { gte: new Date(now.getFullYear(), 0, 1) } };
  }

  const orders = await prisma.order.findMany({
    where: { providerId: session.user.id },
    select: {
      status: true,
      totalPrice: true,
      updatedAt: true,
      isSettled: true,
    },
  });

  const earnings = await prisma.earnings.findUnique({
    where: { userId: session.user.id },
  }) || { totalBalance: 0, withdrawn: 0 };

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id, ...dateFilter },
    orderBy: { createdAt: "desc" },
  });

  let activeOrdersValue = 0;
  let clearingValue = 0;
  let totalNetEarnings = 0;

  orders.forEach((order) => {
    const netAmount = order.totalPrice * COMMISSION_FACTOR;
    if (order.status === "COMPLETED") {
      totalNetEarnings += netAmount;
    }
    if (order.status === "IN_PROGRESS" || order.status === "SUBMITTED") {
      activeOrdersValue += netAmount;
    } 
    else if (order.status === "COMPLETED" && !order.isSettled) {
      clearingValue += netAmount;
    }
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-full mx-auto space-y-10">
            
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground">Finances</h1>
                <p className="text-neutral-500 text-sm">
                  * 10% Service Fee Applied to all earnings
                </p>
              </div>
              <div className="flex items-center gap-4">
                <EarningFilters />
                {/* Dynamic Button based on existence of payout method */}
                <PayoutMethodModal isEdit={hasPayoutMethod} />
                {/* Withdraw button is disabled if no payout method exists */}
                <WithdrawModal balance={earnings.totalBalance} disabled={!hasPayoutMethod} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <StatCard 
                title="Active Orders" 
                amount={activeOrdersValue} 
                icon={<Activity className="text-blue-500" />} 
                trend="In-Progress"
              />
              <StatCard 
                title="Clearing" 
                amount={clearingValue} 
                icon={<Clock className="text-amber-500" />} 
                trend="Individual 10d Hold"
              />
              <StatCard 
                title="Available" 
                amount={earnings.totalBalance} 
                icon={<Wallet className="text-green-500" />} 
                trend="Ready for payout"
                primary
              />
              <StatCard 
                title="Net Income" 
                amount={totalNetEarnings} 
                icon={<Banknote className="text-purple-500" />} 
                trend={timeframe === 'all' ? 'Lifetime' : `This ${timeframe}`}
              />
              <StatCard 
                title="Withdrawn" 
                amount={earnings.withdrawn} 
                icon={<ArrowUpRight className="text-neutral-400" />} 
                trend="Total Paid"
              />
            </div>

            <div className="bg-background border-2 border-foreground/10 rounded-[3rem] overflow-hidden shadow-xl shadow-foreground/[0.02]">
              <div className="p-8 border-b border-foreground/10 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-tighter text-foreground">Transaction Ledger</h2>
                <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  {transactions.length} Records found
                </div>
              </div>
              <TransactionTable transactions={transactions} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}