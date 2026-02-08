"use client";

import { useState } from "react"; // Added useState
import Image from "next/image";
import FullImageModal from "@/components/global/FullImageModal"; // Ensure path is correct

// Icons Import 
import { 
  MoreHorizontal,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  DollarSign
} from "lucide-react";

// Types Declaration
interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  projectImage?: string;
  hours: number;
  rate: number;
  cost: number;
  location: string;
  startDate: string;
  endDate?: string;
}

// Component Props 
interface PortfolioCardProps {
  p: PortfolioItem;
  activeMenu: string | null;
  setActiveMenu?: (id: string | null) => void;
  handleEdit?: (item: PortfolioItem) => void;
  handleDelete?: (id: string) => void;
  isValidImageSrc: (src?: string) => boolean;
  formatDate: (date: string) => string;
  uneditable?: boolean;
}

// Main Component 
export default function PortfolioCard({
  p,
  activeMenu,
  setActiveMenu,
  handleEdit,
  handleDelete,
  isValidImageSrc,
  formatDate,
  uneditable = false,
}: PortfolioCardProps) {
  // Local state to handle the modal display directly in the card
  const [isZoomed, setIsZoomed] = useState(false);

  const imageSrc = isValidImageSrc(p.projectImage) ? p.projectImage! : "/hello.webp";

  return (
    <>
      <div className="flex flex-col min-w-85 md:min-w-105 max-w-85 md:max-w-105 shrink-0 bg-neutral-50 dark:bg-neutral-800/40 rounded-[2.5rem] overflow-hidden border border-neutral-100 dark:border-neutral-700/50 snap-center hover:border-primary/40 transition-all group relative">
        
        <div
          className="aspect-6/4 w-full relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 cursor-zoom-in"
          onClick={() => setIsZoomed(true)} // Open local modal
        >
          <Image
            src={imageSrc}
            alt={p.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out pointer-events-none"
          />

          <div className="absolute top-4 left-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-1.5 rounded-2xl text-xs font-black text-primary shadow-xl border border-white dark:border-neutral-800">
            ${p.cost.toLocaleString()}
          </div>

          {!uneditable && (
            <div className="absolute top-4 right-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu?.(activeMenu === p.id ? null : p.id);
                }}
                className="p-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-xl shadow-lg text-neutral-600 dark:text-neutral-300"
              >
                <MoreHorizontal size={20} />
              </button>

              {activeMenu === p.id && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
                  <button
                    onClick={() => handleEdit?.(p)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <Edit2 size={14} className="text-blue-500" /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete?.(p.id)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
            <MapPin size={12} className="text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-tight">
              {p.location}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col space-y-4 overflow-hidden">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-neutral-900 dark:text-white truncate tracking-tight">
              {p.title}
            </h3>

            <div className="flex items-center gap-2 text-neutral-400">
              <Calendar size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                {formatDate(p.startDate)}{" "}
                {p.endDate ? `- ${formatDate(p.endDate)}` : "• Present"}
              </span>
            </div>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 h-10 leading-relaxed font-medium whitespace-normal break-words overflow-hidden">
            {p.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700/50 mt-auto">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-tighter">
                  Effort
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-neutral-700 dark:text-neutral-200">
                  <Clock size={12} className="text-primary" /> {p.hours}h
                </span>
              </div>

              <div className="h-6 w-px bg-neutral-100 dark:bg-neutral-700" />

              <div className="flex flex-col">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-tighter">
                  Rate
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-neutral-700 dark:text-neutral-200">
                  <DollarSign size={12} className="text-primary" /> ${p.rate}/hr
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal Integration */}
      {isZoomed && (
        <FullImageModal 
          src={imageSrc} 
          onClose={() => setIsZoomed(false)} 
        />
      )}
    </>
  );
}