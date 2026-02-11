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
    ${active ? 'bg-neutral-900 text-white dark:bg-white dark:text-black shadow-lg' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200'}
  `;

  return (
    <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full border dark:border-neutral-700">
      <button onClick={() => setFilter("all")} className={btnClass(current === "all")}>All</button>
      <button onClick={() => setFilter("year")} className={btnClass(current === "year")}>Year</button>
      <button onClick={() => setFilter("month")} className={btnClass(current === "month")}>Month</button>
    </div>
  );
}