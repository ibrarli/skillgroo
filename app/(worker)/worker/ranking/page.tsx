"use client";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import RankBadge from "@/components/worker/rankings/RankBadge";
import RequirementCard from "@/components/worker/rankings/RequirementCard";
import RankInfoModal from "@/components/worker/rankings/RankInfoModal";
import { Award, Zap, Star, Users, Timer } from "lucide-react"; // Added new icons
import { useState } from "react";
import RankBenefits from "@/components/worker/rankings/RankingBenefits";

export default function RankingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Example data: User is currently a "Pro" working towards "Elite"
  const currentRank = "Master"; 
  const progress = {
    earnings: { current: 1200, target: 5000, label: "Total Earnings" },
    orders: { current: 14, target: 50, label: "Completed Orders" },
    rating: { current: 4.8, target: 4.9, label: "Avg Rating" },
    // New Professional Metrics
    clients: { current: 8, target: 20, label: "Unique Clients" },
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
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <RankBadge rank={currentRank as any} size="lg" />
              </div>
              <h1 className="text-5xl font-black uppercase tracking-tighter">Your Status: {currentRank}</h1>
              <p className="text-neutral-500 font-bold max-w-md mx-auto">
                You're doing great! Complete the milestones below to unlock the <span className="text-primary italic">Elite</span> tier.
              </p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[10px] font-black uppercase tracking-widest text-primary underline underline-offset-8"
              >
                How do ranks work?
              </button>
            </div>

            {/* Progression Grid - Updated to a 2-column or 3-column responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <RequirementCard 
                icon={<Zap size={20} />} 
                data={progress.earnings} 
                unit="$"
              />
              <RequirementCard 
                icon={<Award size={20} />} 
                data={progress.orders} 
              />
              <RequirementCard 
                icon={<Star size={20} />} 
                data={progress.rating} 
                isDecimal
              />
              {/* Added Unique Clients */}
              <RequirementCard 
                icon={<Users size={20} />} 
                data={progress.clients} 
              />
              {/* Added Response Time */}
              <RequirementCard 
                icon={<Timer size={20} />} 
                data={progress.responseTime} 
                unit=""
              />
              {/* Rank Roadmap Visual */}
            <div className="bg-foreground/2 border border-foreground/10 rounded-[3rem] p-10">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-10 text-center">Tiers Roadmap</h3>
              <div className="flex justify-between items-center relative">
                <div className="absolute h-0.5 w-full bg-foreground/5 top-5  z-0" />
                {["Rookie", "Pro", "Elite", "Legend"].map((r) => (
                  <div key={r} className="z-10 flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full border-4 flex items-center justify-center bg-background
                      ${r === currentRank ? 'border-primary' : 'border-foreground/10'}`}>
                      {r === currentRank && <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${r === currentRank ? 'text-foreground' : 'text-neutral-500'}`}>
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

      <RankInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}