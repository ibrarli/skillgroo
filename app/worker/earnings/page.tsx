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
import { Wallet, ArrowUpRight, Clock, Banknote, Activity } from "lucide-react";

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: { timeframe?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const timeframe = searchParams.get?.timeframe || "all";
  const now = new Date();
  const COMMISSION_FACTOR = 0.9; // Platform takes 10%
  
  // --- CLEARING THRESHOLD ---
  // For Production: Use .setDate(now.getDate() - 10)
  // For Testing: Use .setMinutes(now.getMinutes() - 2)
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10); 
  // tenDaysAgo.setDate(tenDaysAgo.getMinutes() - 2);
  // --- 1. SETTLEMENT LOGIC (Background Processing) ---
  // This logic runs every time the page loads, checking for orders 
  // that have finished their individual 10-day clearing period.
  const settleFunds = async () => {
    const clearableOrders = await prisma.order.findMany({
      where: {
        providerId: session.user.id,
        status: "COMPLETED",
        isSettled: false, // Only pick orders not yet moved to Available Balance
        updatedAt: { lte: tenDaysAgo }, // Only pick orders older than 10 days
      },
    });

    if (clearableOrders.length > 0) {
      const amountToMove = clearableOrders.reduce(
        (acc, curr) => acc + curr.totalPrice * COMMISSION_FACTOR,
        0
      );

      await prisma.$transaction([
        // Add to Available Balance
        prisma.earnings.update({
          where: { userId: session.user.id },
          data: { totalBalance: { increment: amountToMove } },
        }),
        // Mark these specific orders as Settled
        prisma.order.updateMany({
          where: { id: { in: clearableOrders.map((o) => o.id) } },
          data: { isSettled: true },
        }),
        // Log the clearance in transactions
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

  // --- 2. DATA FETCHING ---
  let dateFilter = {};
  if (timeframe === "month") {
    dateFilter = { createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
  } else if (timeframe === "year") {
    dateFilter = { createdAt: { gte: new Date(now.getFullYear(), 0, 1) } };
  }

  // Fetch all orders to calculate Active and Clearing buckets
  const orders = await prisma.order.findMany({
    where: { providerId: session.user.id },
    select: {
      status: true,
      totalPrice: true,
      updatedAt: true,
      isSettled: true, // Crucial for subtraction logic
    },
  });

  const earnings = await prisma.earnings.findUnique({
    where: { userId: session.user.id },
  }) || { totalBalance: 0, withdrawn: 0 };

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id, ...dateFilter },
    orderBy: { createdAt: "desc" },
  });

  // --- 3. BUCKET CALCULATIONS ---
  let activeOrdersValue = 0;
  let clearingValue = 0;
  let totalNetEarnings = 0;

  orders.forEach((order) => {
    const netAmount = order.totalPrice * COMMISSION_FACTOR;

    // Total Net Income: All completed orders ever
    if (order.status === "COMPLETED") {
      totalNetEarnings += netAmount;
    }

    // Active Orders: Work currently in progress
    if (order.status === "IN_PROGRESS" || order.status === "SUBMITTED") {
      activeOrdersValue += netAmount;
    } 
    // Clearing: COMPLETED but NOT YET SETTLED
    // As soon as settleFunds() marks an order as isSettled: true, 
    // it automatically disappears from this bucket.
    else if (order.status === "COMPLETED" && !order.isSettled) {
      clearingValue += netAmount;
    }
  });

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-7xl mx-auto space-y-10">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic dark:text-white">Finances</h1>
                <p className="text-neutral-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic">
                  * 10% SERVICE FEE APPLIED TO ALL EARNINGS
                </p>
              </div>
              <div className="flex items-center gap-4">
                <EarningFilters />
                <WithdrawModal balance={earnings.totalBalance} />
              </div>
            </div>

            {/* Stats Grid */}
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

            {/* Transactions */}
            <div className="bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 rounded-[3rem] overflow-hidden shadow-xl shadow-neutral-200/50 dark:shadow-none">
              <div className="p-8 border-b dark:border-neutral-800 flex justify-between items-center">
                <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white">Transaction Ledger</h2>
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