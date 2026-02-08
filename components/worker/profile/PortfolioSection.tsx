"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";

// Icons Import
import { Layout, Plus } from "lucide-react";

// Child Components
import PortfolioSkeleton from "../../subcomponents/portfolio/PortfolioSkeleton";
import IconButton from "../../global/IconButton";
import PortfolioModal from "./modal/PortfolioModal";
import PortfolioCard from "../../subcomponents/portfolio/PortfolioCard";

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

// Checking for Validation of Image Source
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

// Main Component
export default function PortfolioSection() {

  // States
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Fetching content from backend
  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      const data = await res.json();
      setPortfolio(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Updating the portfolio after edit
  const handleEdit = (project: PortfolioItem) => {
    setSelectedProject(project);
    setModalOpen(true);
    setActiveMenu(null);
  };

  // Deleting the portfolio
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await axios.delete(`/api/portfolio/${id}`);
      fetchPortfolio();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Horizontal Drag and Scroll logic
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDown.current = true;
    sliderRef.current.classList.add("active");
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown.current = false;
    sliderRef.current?.classList.remove("active");
  };

  const onMouseUp = () => {
    isDown.current = false;
    sliderRef.current?.classList.remove("active");
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll speed
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // Date formating into month and year
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-AU", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-4xl mt-6 shadow-sm overflow-hidden">
      

      <div className="flex justify-between items-center p-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Layout size={22} />
          </div>
          <h2 className="text-xl font-black text-neutral-800 dark:text-white tracking-tighter ">
            Portfolio
          </h2>
        </div>

        <IconButton
          text="Add Project"
          icon={<Plus size={18} />}
          onClick={() => {
            setSelectedProject(null);
            setModalOpen(true);
          }}
        />

        <PortfolioModal
          onAdd={fetchPortfolio}
          isOpen={modalOpen}
          project={selectedProject}
          onClose={() => {
            setModalOpen(false);
            setSelectedProject(null);
          }}
        />
      </div>

      {/* Re-enabled Scrollable Container */}
      <div
        ref={sliderRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        className="flex gap-6 overflow-x-auto px-8 pb-10 scrollbar-hide snap-x snap-mandatory cursor-grab active:cursor-grabbing scroll-smooth"
      >
        {loading ? (
          <>
            <PortfolioSkeleton />
            <PortfolioSkeleton />
            <PortfolioSkeleton />
          </>
        ) : portfolio.length > 0 ? (
          portfolio.map((p) => (
            <PortfolioCard
              key={p.id}
              p={p}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              isValidImageSrc={isValidImageSrc}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div className="w-full py-20 text-center flex flex-col items-center justify-center gap-4 bg-neutral-50 dark:bg-neutral-800/30 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] mx-8">
            <Layout
              size={40}
              className="text-neutral-200 dark:text-neutral-700"
            />
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
              No projects added yet.
            </p>
          </div>
        )}
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
