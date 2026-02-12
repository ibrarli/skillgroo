"use client";

import { CheckCircle2, Zap, Rocket, ShieldCheck, Globe } from "lucide-react";

interface RankBenefitsProps {
  rank: string;
}

export default function RankBenefits({ rank }: RankBenefitsProps) {
  // Define benefits based on rank
  const benefitsConfig: Record<string, any[]> = {
    Rookie: [
      { icon: <Globe size={18} />, title: "Public Profile", desc: "Showcase your skills to the world" },
      { icon: <Zap size={18} />, title: "Standard Payouts", desc: "14-day clearing period" },
    ],
    Pro: [
      { icon: <ShieldCheck size={18} />, title: "Verified Badge", desc: "Increased trust with customers" },
      { icon: <Zap size={18} />, title: "Faster Payouts", desc: "7-day clearing period" },
      { icon: <Rocket size={18} />, title: "Priority Support", desc: "Skip the queue for help" },
    ],
    Master: [
      { icon: <Rocket size={18} />, title: "Featured Listings", desc: "Higher visibility in search" },
      { icon: <Zap size={18} />, title: "Instant Clearing", desc: "3-day clearing period" },
      { icon: <CheckCircle2 size={18} />, title: "Fee Reduction", desc: "Platform fee dropped to 8%" },
    ],
    Legend: [
      { icon: <Rocket size={18} />, title: "VIP Promotion", desc: "Algorithm boost on all gigs" },
      { icon: <Zap size={18} />, title: "Instant Payouts", desc: "No clearing period" },
      { icon: <ShieldCheck size={18} />, title: "Account Manager", desc: "Personal 1-on-1 support" },
    ],
  };

  const currentBenefits = benefitsConfig[rank] || benefitsConfig["Rookie"];

  return (
    <div className="bg-foreground/[0.02] border border-foreground/10 rounded-[3rem] p-10 mt-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <CheckCircle2 size={16} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
          Exclusive Perks for {rank} Rank
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentBenefits.map((benefit, idx) => (
          <div 
            key={idx} 
            className="bg-background border border-foreground/5 p-6 rounded-[2rem] flex flex-col gap-3 transition-hover hover:border-primary/20"
          >
            <div className="text-primary">
              {benefit.icon}
            </div>
            <div>
              <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">
                {benefit.title}
              </h4>
              <p className="text-[10px] text-neutral-500 font-bold uppercase leading-relaxed mt-1">
                {benefit.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}