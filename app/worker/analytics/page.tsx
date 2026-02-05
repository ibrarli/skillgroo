import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import AnalyticsStats from "@/components/worker/analytics/AnalyticsStats";
import GigPerformanceTable from "@/components/worker/analytics/GigPerformaceTable";
import { BarChart3, TrendingUp, MousePointer2, ShoppingBag } from "lucide-react";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  const userGigs = await prisma.gig.findMany({
    where: { profile: { userId: session?.user?.id } },
    include: {
      _count: {
        select: { 
          impressions: true, 
          clicks: true, 
          orders: true 
        }
      },
      orders: {
        select: { status: true }
      }
    }
  });

  // Calculate Aggregates
  const totalImpressions = userGigs.reduce((acc, gig) => acc + gig._count.impressions, 0);
  const totalClicks = userGigs.reduce((acc, gig) => acc + gig._count.clicks, 0);
  const totalOrders = userGigs.reduce((acc, gig) => acc + gig._count.orders, 0);
  
  const totalCancelled = userGigs.reduce((acc, gig) => 
    acc + gig.orders.filter(o => o.status === 'cancelled').length, 0
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-7xl mx-auto space-y-10">
            
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-black text-neutral-900 dark:text-white">Analytics</h1>
                <p className="text-neutral-500 font-medium">Measure your growth and service impact</p>
              </div>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <AnalyticsStats title="Impressions" value={totalImpressions} icon={<BarChart3 size={20}/>} color="blue" />
              <AnalyticsStats title="Clicks" value={totalClicks} icon={<MousePointer2 size={20}/>} color="purple" />
              <AnalyticsStats title="Orders" value={totalOrders} icon={<ShoppingBag size={20}/>} color="emerald" />
              <AnalyticsStats 
                title="Conversion" 
                value={`${totalImpressions > 0 ? ((totalOrders / totalImpressions) * 100).toFixed(1) : 0}%`} 
                icon={<TrendingUp size={20}/>} 
                color="primary" 
              />
            </div>

            {/* Detailed Gig Table */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-8 border-b dark:border-neutral-800">
                <h2 className="text-xl font-bold">Gig Performance</h2>
                <p className="text-sm text-neutral-500">Breakdown of each service's reach and reliability</p>
              </div>
              <GigPerformanceTable gigs={userGigs} />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}