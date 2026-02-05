"use client";

import { useEffect, useState, useRef } from "react";
import PortfolioModal from "./PortfolioModal";
import Image from "next/image";
import axios from "axios";
import IconButton from "../../global/IconButton"; // Ensure this import exists
import { Layout, Calendar, Clock, DollarSign, MoreHorizontal, Edit2, Trash2, Plus } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  projectImage?: string;
  hours: number;
  rate: number;
  cost: number;
  startDate: string;
  endDate?: string;
}

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

export default function PortfolioSection() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setPortfolio(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error", error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleEdit = (project: PortfolioItem) => {
    setSelectedProject(project);
    setModalOpen(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/portfolio/${id}`);
      fetchPortfolio();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  /* ---------- Drag slider logic ---------- */
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl mt-6 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Layout size={22} />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white">Portfolio</h2>
        </div>
        
        {/* ADD BUTTON IS NOW HERE */}
        <div className="flex gap-2">
           <IconButton 
            text="Add Project" 
            icon={<Plus size={18} />} 
            onClick={() => {
              setSelectedProject(null);
              setModalOpen(true);
            }} 
          />
        </div>

        <PortfolioModal 
          onAdd={fetchPortfolio} 
          isOpen={modalOpen} 
          project={selectedProject} 
          onClose={() => { setModalOpen(false); setSelectedProject(null); }}
        />
      </div>

      <div
        ref={sliderRef}
        onMouseDown={onMouseDown}
        onMouseLeave={() => (isDown.current = false)}
        onMouseUp={() => (isDown.current = false)}
        onMouseMove={(e) => {
            if (!isDown.current || !sliderRef.current) return;
            e.preventDefault();
            const x = e.pageX - sliderRef.current.offsetLeft;
            const walk = (x - startX.current) * 1.5;
            sliderRef.current.scrollLeft = scrollLeft.current - walk;
        }}
        className="flex gap-6 overflow-x-auto px-6 pb-8 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing"
      >
        {portfolio.length > 0 ? (
          portfolio.map((p) => (
            <div key={p.id} className="min-w-[320px] md:min-w-[400px] flex-shrink-0 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-700 snap-center hover:border-primary/30 transition-all hover:shadow-md group relative">
              <div className="h-48 w-full relative overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                <Image
                  src={isValidImageSrc(p.projectImage) ? p.projectImage! : "/hello.webp"}
                  alt="project"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-primary shadow-sm border border-neutral-100 dark:border-neutral-700">
                  ${p.cost}
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === p.id ? null : p.id); }}
                    className="p-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full shadow-lg text-neutral-600 dark:text-neutral-300"
                  >
                    <MoreHorizontal size={18} />
                  </button>
                  {activeMenu === p.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-50 overflow-hidden">
                      <button onClick={() => handleEdit(p)} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 border-b border-neutral-100 dark:border-neutral-700">
                        <Edit2 size={14} className="text-blue-500" /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white truncate">{p.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 h-10 leading-relaxed">{p.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700/50">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400"><Clock size={12}/>{p.hours}h</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-neutral-400"><DollarSign size={12}/>${p.rate}/hr</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-12 text-center text-neutral-400 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl mx-6">
            No projects added yet.
          </div>
        )}
      </div>
      <style jsx>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}