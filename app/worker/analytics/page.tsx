import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import AnalyticsStats from "@/components/worker/analytics/AnalyticsStats";
import GigPerformanceTable from "@/components/worker/analytics/GigPerformaceTable";
import { 
  BarChart3, 
  TrendingUp, 
  MousePointer2, 
  ShoppingBag, 
  AlertCircle,
  ArrowUpRight 
} from "lucide-react";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const userGigs = await prisma.gig.findMany({
    where: { profile: { userId: session.user.id } },
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

  // Aggregates
  const totalImpressions = userGigs.reduce((acc, gig) => acc + gig._count.impressions, 0);
  const totalClicks = userGigs.reduce((acc, gig) => acc + gig._count.clicks, 0);
  const totalOrders = userGigs.reduce((acc, gig) => acc + gig._count.orders, 0);
  
  // Logic for specialized metrics
  const conversionRate = totalImpressions > 0 
    ? ((totalOrders / totalImpressions) * 100).toFixed(1) 
    : "0";

  const totalCancelled = userGigs.reduce((acc, gig) => 
    acc + gig.orders.filter(o => o.status.toLowerCase() === 'cancelled').length, 0
  );

  const cancellationRate = totalOrders > 0 
    ? ((totalCancelled / totalOrders) * 100).toFixed(1) 
    : "0";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col font-sans">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-full mx-auto space-y-10 pb-20">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b dark:border-neutral-800 pb-8">
          
              <div>
                <h1 className="text-4xl font-bold  dark:text-white">Analytics</h1>
                <p className="text-neutral-300   text-sm ">
                  Performance & Service Metrics
                </p>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                  Live Data Sync
                </span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnalyticsStats 
                title="Impressions" 
                value={totalImpressions.toLocaleString()} 
                icon={<BarChart3 size={18}/>} 
                color="blue" 
              />
              <AnalyticsStats 
                title="Clicks" 
                value={totalClicks.toLocaleString()} 
                icon={<MousePointer2 size={18}/>} 
                color="purple" 
              />
              <AnalyticsStats 
                title="Conversion" 
                value={`${conversionRate}%`} 
                icon={<TrendingUp size={18}/>} 
                color="emerald" 
                description="Orders per impression"
              />
              <AnalyticsStats 
                title="Cancellation" 
                value={`${cancellationRate}%`} 
                icon={<AlertCircle size={18}/>} 
                color="rose" 
                description="Lost opportunities"
              />
            </div>

            {/* Detailed Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-800" />
                <h2 className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.4em]">
                  Gig Breakdown
                </h2>
                <div className="h-[1px] flex-1 bg-neutral-200 dark:bg-neutral-800" />
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[3rem] overflow-hidden shadow-2xl shadow-neutral-200/50 dark:shadow-none">
                <div className="p-10 border-b dark:border-neutral-800 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black dark:text-white tracking-tight">Active Gigs</h2>
                    <p className="text-xs text-neutral-500 font-medium mt-1">Individual performance tracking for your services</p>
                  </div>
                  <button className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl hover:bg-primary transition-colors group">
                    <ArrowUpRight size={20} className="group-hover:text-black dark:text-white" />
                  </button>
                </div>
                
                <div className="p-2">
                   <GigPerformanceTable gigs={userGigs} />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}