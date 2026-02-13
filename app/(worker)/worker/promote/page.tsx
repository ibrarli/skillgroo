"use client";

import { useState, useEffect } from "react";
import { useProfile } from "@/context/ProfileContext";
import { TrendingUp, CheckCircle2, MousePointer2, Sparkles, Rocket, Loader2,  } from "lucide-react";
import GigCard from "@/components/subcomponents/gigs/GigCard";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";

const AD_PLANS = [
  {
    id: "boost",
    name: "Homepage Boost",
    price: "$9.99",
    duration: "/mo",
    description: "Appear in the 'Live Experts' homepage section instantly.",
    features: ["Priority placement", "Live status badge", "2x more clicks"],
    color: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-500/50",
    icon: <Rocket className="text-emerald-500" size={20} />,
  },
  {
    id: "elite",
    name: "Elite Feature",
    price: "$24.99",
    duration: "/mo",
    description: "Top-row placement in 'Recommended' for maximum reach.",
    features: ["Top 1% placement", "Elite worker badge", "Verified tag"],
    color: "bg-primary/10",
    border: "border-primary",
    icon: <Sparkles className="text-primary" size={20} />,
  }
];

export default function PromotePage() {
  const { profile } = useProfile();
  const [selectedPlan, setSelectedPlan] = useState("boost");
  const [myGigs, setMyGigs] = useState<any[]>([]);
  const [selectedGigId, setSelectedGigId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyGigs = async () => {
      try {
        const res = await fetch("/api/gigs?mine=true");
        const data = await res.json();
        const formattedData = data.map((gig: any) => ({
            ...gig,
            image: Array.isArray(gig.images) && gig.images.length > 0 
                   ? gig.images[0] 
                   : gig.image || "/placeholder-gig.jpg"
        }));
        setMyGigs(formattedData);
        if (formattedData.length > 0) setSelectedGigId(formattedData[0].id);
      } catch (error) {
        console.error("Failed to fetch gigs for preview", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyGigs();
  }, []);

  const activeGigForPreview = myGigs.find(g => g.id === selectedGigId) || myGigs[0];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
        <Header/>
        <div className="flex">
 <Sidebar/>
 <div>
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.3em]">
            <TrendingUp size={14} />
            Growth Center
          </div>
          <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">
            Boost your <br /> <span className="text-primary italic">exposure.</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT: PLANS */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-2">
            1. Select a Promotion Plan
          </h3>
          {AD_PLANS.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-500 ${
                selectedPlan === plan.id ? plan.border : "border-foreground/5 bg-background hover:border-foreground/20"
              } ${selectedPlan === plan.id ? plan.color : ""}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-background rounded-2xl border border-foreground/5 shadow-sm">{plan.icon}</div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-tight">{plan.name}</h3>
                        <p className="text-xs text-neutral-500 font-medium">{plan.description}</p>
                    </div>
                </div>
                <span className="text-2xl font-black">{plan.price}</span>
              </div>
            </div>
          ))}

          {/* GIG SELECTION LIST */}
          <div className="mt-10">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-4">
              2. Choose Gig to Promote
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {myGigs.map((gig) => (
                <button
                  key={gig.id}
                  onClick={() => setSelectedGigId(gig.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    selectedGigId === gig.id 
                    ? "border-primary bg-primary/5" 
                    : "border-foreground/5 hover:border-foreground/10"
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-foreground/10 overflow-hidden shrink-0">
                    <img src={gig.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black truncate uppercase">{gig.title}</p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">${gig.price} • {gig.location}</p>
                  </div>
                  {selectedGigId === gig.id && <CheckCircle2 className="text-primary" size={20} />}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-5 bg-foreground text-background rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all mt-8">
            Promote Selected Gig
          </button>
        </div>

        {/* RIGHT: LIVE PREVIEW */}
        <div className="lg:col-span-7">
          <div className="sticky top-24">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-2">
                <MousePointer2 size={14} />
                Live Homepage Preview
            </h3>
            
            <div className="p-2 bg-foreground/5 rounded-[3.5rem] border border-foreground/5 overflow-hidden">
                <div className="bg-background rounded-[3rem] p-10 shadow-2xl relative">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 tracking-widest">Sponsored Preview</span>
                        </div>
                    </div>

                    <div className="max-w-[400px] mx-auto">
                        {isLoading ? (
                            <div className="py-24 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-primary" />
                            </div>
                        ) : activeGigForPreview ? (
                            <div className="pointer-events-none transform transition-all duration-700 animate-in fade-in zoom-in-95">
                                <GigCard 
                                    gig={activeGigForPreview} 
                                    editable={false} 
                                />
                            </div>
                        ) : (
                            <div className="py-24 text-center border-2 border-dashed border-foreground/10 rounded-[2rem]">
                                 <p className="text-sm font-bold text-neutral-400 uppercase">No gigs available</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-10 pt-6 border-t border-foreground/5 text-center">
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary italic">
                            {selectedPlan === "boost" ? "Promoted in Live Experts" : "Featured in Recommended"}
                         </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      </div>
        </div>
       
    </div>
  );
}