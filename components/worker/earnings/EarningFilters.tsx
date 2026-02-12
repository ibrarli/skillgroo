"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function EarningFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("timeframe") || "all";

  const setFilter = (value: string) => {
    router.push(`/worker/earnings?timeframe=${value}`);
  };

  const btnClass = (active: boolean) => `
    px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
    ${active 
      ? 'bg-foreground text-background shadow-lg shadow-foreground/10' 
      : 'text-neutral-500 hover:bg-foreground/5'}
  `;

  return (
    /* Container updated to use background-level foreground tint */
    <div className="flex bg-foreground/[0.03] p-1 rounded-full border border-foreground/10">
      <button 
        onClick={() => setFilter("all")} 
        className={btnClass(current === "all")}
      >
        All
      </button>
      <button 
        onClick={() => setFilter("year")} 
        className={btnClass(current === "year")}
      >
        Year
      </button>
      <button 
        onClick={() => setFilter("month")} 
        className={btnClass(current === "month")}
      >
        Month
      </button>
    </div>
  );
}