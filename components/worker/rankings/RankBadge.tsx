"use client";

import React from "react";
import { Shield, Award, Gem, Crown, LucideIcon } from "lucide-react";

type RankType = "Rookie" | "Pro" | "Master" | "Legend";

interface RankConfig {
  icon: LucideIcon;
  bg: string;
  text: string;
  border: string;
  shadow: string;
  animate?: string;
}

interface RankBadgeProps {
  rank: RankType;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
}

export default function RankBadge({ rank, size = "md", withLabel = false }: RankBadgeProps) {
  const rankConfigs: Record<RankType, RankConfig> = {
    Rookie: { icon: Shield, bg: "bg-slate-500/10", text: "text-slate-500", border: "border-slate-500/20", shadow: "shadow-none" },
    Pro: { icon: Award, bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20", shadow: "shadow-blue-500/5" },
    Master: { icon: Gem, bg: "bg-purple-500/10", text: "text-purple-500", border: "border-purple-500/20", shadow: "shadow-purple-500/20" },
    Legend: { icon: Crown, bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/40", shadow: "shadow-amber-500/30", animate: "animate-pulse" },
  };

  const config = rankConfigs[rank] || rankConfigs.Rookie;
  const IconComponent = config.icon;

  // Adjusted size classes to handle auto-width when text is present
  const sizeClasses = {
    sm: `${withLabel ? "px-3 w-auto" : "w-10"} h-10 rounded-xl`,
    md: `${withLabel ? "px-4 w-auto" : "w-14"} h-14 rounded-2xl`,
    lg: `${withLabel ? "px-6 w-auto" : "w-24"} h-24 rounded-[1.8rem]`,
  };

  const iconSizes = { sm: 18, md: 24, lg: 48 };

  return (
    <div className={`flex flex-col items-center group ${withLabel ? "" : "gap-2"}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          ${config.bg} 
          ${config.text} 
          ${config.border} 
          ${config.shadow}
          ${config.animate || ""}
          flex items-center justify-center border-2 gap-2
          ${withLabel ? "" : "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"} 
        `}
      >
        <IconComponent 
          size={iconSizes[size]} 
          strokeWidth={2.5} 
        />
        
        {/* Label rendered INSIDE the styled div as requested */}
        {withLabel && (
          <div className="flex items-center">
            <span className={`text-sm font-bold whitespace-nowrap ${config.text}`}>
              {rank} 
            </span>
          </div>
        )}
      </div>
      
      {/* Vertical label only for standard large mode */}
      {!withLabel && size === "lg" && (
        <span className={`text-[10px] font-black uppercase tracking-[0.4em] mt-2 ${config.text}`}>
          {rank} Tier
        </span>
      )}
    </div>
  );
}