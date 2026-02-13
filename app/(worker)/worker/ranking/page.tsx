import { getServerSession } from "next-auth";
import { Metadata } from "next"; 
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import RankBadge from "@/components/worker/rankings/RankBadge";
import RequirementCard from "@/components/worker/rankings/RequirementCard";
import RankBenefits from "@/components/worker/rankings/RankingBenefits";
import { Award, Zap, Star, Users, Timer, AlertTriangle } from "lucide-react";
import RankingClientWrapper from "@/components/worker/rankings/RankingClientWrapper";

export const metadata: Metadata = {
  title: "Performance & Rankings | Worker Dashboard",
  description: "Track your professional growth, monitor monthly evaluation milestones, and unlock exclusive tier benefits.",
  robots: "noindex, nofollow",
};

export default async function RankingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/");

  const userId = session.user.id;
  const now = new Date();
  
  // Evaluation Date Logic: Next evaluation is the 1st of next month
  const nextEvaluation = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const daysUntilEvaluation = Math.ceil((nextEvaluation.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // 1. Fetch Stats (Lifetime for promotion, but Rating can be filtered for last 30 days if preferred)
  const earningsData = await prisma.earnings.findUnique({
    where: { userId },
    select: { totalBalance: true, withdrawn: true }
  });
  const totalEarnings = (earningsData?.totalBalance || 0) + (earningsData?.withdrawn || 0);

  const completedOrders = await prisma.order.findMany({
    where: { providerId: userId, status: "COMPLETED" },
    select: { customerId: true }
  });
  
  const orderCount = completedOrders.length;
  const uniqueClients = new Set(completedOrders.map(o => o.customerId)).size;

  const reviews = await prisma.review.aggregate({
    where: { profile: { userId: userId } },
    _avg: { rating: true }
  });
  const avgRating = reviews._avg.rating || 0;

  // 2. Threshold Definitions
  const thresholds = {
    Legend: { earnings: 5000, orders: 50, rating: 4.8, clients: 20 },
    Elite: { earnings: 2000, orders: 20, rating: 4.5, clients: 10 },
    Pro: { earnings: 500, orders: 5, rating: 4.0, clients: 3 },
    Rookie: { earnings: 0, orders: 0, rating: 0, clients: 0 }
  };

  // 3. Current Rank Determination (Highest qualified)
  let currentRank = "Rookie";
  if (totalEarnings >= thresholds.Legend.earnings && orderCount >= thresholds.Legend.orders && avgRating >= thresholds.Legend.rating) {
    currentRank = "Legend";
  } else if (totalEarnings >= thresholds.Elite.earnings && orderCount >= thresholds.Elite.orders && avgRating >= thresholds.Elite.rating) {
    currentRank = "Elite";
  } else if (totalEarnings >= thresholds.Pro.earnings || orderCount >= thresholds.Pro.orders) {
    currentRank = "Pro";
  }

  // 4. Demotion Check (Are they failing to meet their CURRENT rank requirements?)
  const meetsCurrentRequirements = avgRating >= (thresholds[currentRank as keyof typeof thresholds]?.rating || 0);
  
  // 5. Target Determination (Next rank)
  const rankOrder = ["Rookie", "Pro", "Elite", "Legend"];
  const nextRankIndex = Math.min(rankOrder.indexOf(currentRank) + 1, 3);
  const nextRank = rankOrder[nextRankIndex];
  const currentTargets = thresholds[nextRank as keyof typeof thresholds];

  const progress = {
    earnings: { current: totalEarnings, target: currentTargets.earnings, label: "Total Earnings" },
    orders: { current: orderCount, target: currentTargets.orders, label: "Completed Orders" },
    rating: { current: avgRating, target: currentTargets.rating, label: "Avg Rating" },
    clients: { current: uniqueClients, target: currentTargets.clients, label: "Unique Clients" },
    responseTime: { current: 2, target: 1, label: "Avg Response (Hrs)" },
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-full mx-auto space-y-12">
            
            {/* Hero Section */}
            <div className="pl-10 flex flex-row justify-between items-start gap-5">
              <div className="flex flex-row gap-10">
                <div className="flex justify-center">
                  <RankBadge rank={currentRank as any} size="lg" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold">Your Status: {currentRank}</h1>
                  
                  {/* Monthly Evaluation Notice */}
                  {!meetsCurrentRequirements && currentRank !== "Rookie" ? (
                    <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-xl w-fit">
                      <AlertTriangle size={16} />
                      <p className="text-xs font-black uppercase tracking-wider">
                        Risk of Demotion: Rating below {thresholds[currentRank as keyof typeof thresholds].rating}
                      </p>
                    </div>
                  ) : (
                    <p className="text-neutral-500 max-w-md">
                      Next evaluation in <span className="text-foreground font-bold">{daysUntilEvaluation} days</span>. 
                      Keep up the quality to maintain or upgrade your status.
                    </p>
                  )}
                </div>
              </div>
              <RankingClientWrapper />
            </div>

            {/* Progression Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RequirementCard icon={<Zap size={20} />} data={progress.earnings} unit="$" />
              <RequirementCard icon={<Award size={20} />} data={progress.orders} />
              <RequirementCard icon={<Star size={20} />} data={progress.rating} isDecimal />
              <RequirementCard icon={<Users size={20} />} data={progress.clients} />
              <RequirementCard icon={<Timer size={20} />} data={progress.responseTime} unit="" />

              {/* Rank Roadmap Visual */}
              <div className="bg-foreground/2 border border-foreground/10 rounded-[3rem] p-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-10 text-center">
                  Evaluation Roadmap
                </h3>
                <div className="flex justify-between items-center relative">
                  <div className="absolute h-0.5 w-full bg-foreground/5 top-5 z-0" />
                  {rankOrder.map((r) => (
                    <div key={r} className="z-10 flex flex-col items-center gap-3">
                      <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center bg-background
                        ${r === currentRank ? "border-primary" : "border-foreground/10"}`}>
                        {r === currentRank && <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${r === currentRank ? "text-foreground" : "text-neutral-500"}`}>
                        {r}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <RankBenefits rank={currentRank} />
          </div>
        </main>
      </div>
    </div>
  );
}