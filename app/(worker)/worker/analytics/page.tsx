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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-full mx-auto space-y-10 pb-20">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-foreground/10 pb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground">Analytics</h1>
                <p className="text-neutral-500 text-sm">
                  Performance & Service Metrics
                </p>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
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
                <div className="h-[1px] flex-1 bg-foreground/5" />
                <h2 className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em]">
                  Gig Breakdown
                </h2>
                <div className="h-[1px] flex-1 bg-foreground/5" />
              </div>

              <div className="bg-background border border-foreground/10 rounded-[3rem] overflow-hidden shadow-2xl shadow-foreground/[0.02]">
                <div className="p-10 border-b border-foreground/10 flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">Active Gigs</h2>
                    <p className="text-xs text-neutral-500 font-medium mt-1">Individual performance tracking for your services</p>
                  </div>
                  <button className="p-3 bg-foreground/5 rounded-2xl hover:bg-primary transition-colors group">
                    <ArrowUpRight size={20} className="text-foreground group-hover:text-white" />
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