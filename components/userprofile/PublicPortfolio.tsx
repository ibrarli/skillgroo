"use client";

import { useState } from "react";
import PortfolioCard from "@/components/subcomponents/portfolio/PortfolioCard"; // adjust path if needed
import { Layout, Layers } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  projectImage?: string;
  hours?: number;
  rate?: number;
  cost?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
}

export default function PublicPortfolio({ items }: { items: PortfolioItem[] }) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const isValidImageSrc = (src?: string) => {
    if (!src) return false;
    if (src.startsWith("/")) return true;
    try {
      new URL(src);
      return true;
    } catch {
      return false;
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      month: "short",
      year: "numeric",
    });
  };

  if (!items || items.length === 0) {
    return (
      <div className="w-full py-12 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
        <p className="text-neutral-400 font-medium">No projects added yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-4xl mt-6 shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Layout size={22} />
          </div>
          <h2 className="text-2xl font-black text-neutral-800 dark:text-white ">
            Portfolio
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700">
            {items.length} Projects
          </span>
        </div>
      </div>

      <div className="flex gap-6 overflow-x-auto px-8 pb-10 scrollbar-hide snap-x snap-mandatory scroll-smooth">
        {items.map((p) => (
          <PortfolioCard
            key={p.id}
            p={{
              id: p.id,
              title: p.title,
              description: p.description,
              projectImage: p.projectImage || "/hello.webp",
              hours: p.hours ?? 0, 
              rate: p.rate ?? 0,
              cost: p.cost ?? 0,
              location: p.location ?? "",
              startDate: p.startDate ?? "",
              endDate: p.endDate,
            }}
            activeMenu={activeMenu}
            isValidImageSrc={isValidImageSrc}
            formatDate={formatDate}
            uneditable // important: disables edit/delete menu
          />
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
