"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Icons Import
import {
  Briefcase,
  Plus,
} from "lucide-react";

// Child Components
import IconButton from "../../global/IconButton";
import ExperienceModal from "@/components/worker/profile/modal/ExperienceModal";
import ExperienceCard from "../../subcomponents/experience/Experience Card";

// Main Component
export default function ExperienceSection({ profile }: any) {
  // States
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Updated sorting logic: Latest Start Date first, then Latest End Date (Current is highest)
  const sortExperiences = (data: any[]) => {
    return [...data].sort((a: any, b: any) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();

      if (dateB !== dateA) {
        return dateB - dateA; // Primary: Newest Start Date
      }

      // Secondary: Newest End Date (Current treated as Infinity)
      const endA = a.current ? Infinity : new Date(a.endDate || 0).getTime();
      const endB = b.current ? Infinity : new Date(b.endDate || 0).getTime();

      return endB - endA;
    });
  };

  useEffect(() => {
    if (profile?.experiences) {
      setExperiences(sortExperiences(profile.experiences));
      setLoading(false);
    }
  }, [profile]);

  // Fetching experience from the DB
  const refresh = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setExperiences(sortExperiences(data.experiences || []));
    } catch (error) {
      console.error("Failed to refresh experiences:", error);
    }
  };

  // Opening the Edit Modal
  const handleEdit = (e: React.MouseEvent, exp: any) => {
    e.stopPropagation();
    setSelectedExp(exp);
    setModalOpen(true);
    setActiveMenu(null);
  };

  // Deleting the Experience
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Delete this experience?")) return;
    try {
      await axios.delete(`/api/experience/${id}`);
      refresh();
      setActiveMenu(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Format the Date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mt-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Briefcase size={22} />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
            Experience
          </h2>
        </div>
        <IconButton
          text="Add Experience"
          icon={<Plus size={18} />}
          onClick={() => {
            setSelectedExp(null);
            setModalOpen(true);
          }}
        />
      </div>

      {loading ? (
        // Skeleton Experience
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="w-full h-32 bg-neutral-50 dark:bg-neutral-800/50 animate-pulse rounded-2xl border border-neutral-100 dark:border-neutral-700"
            />
          ))}
        </div>
      ) : // Incase of No Experience
      experiences.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-400 font-medium ">
            No work experience added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              formatDate={formatDate}
            />
          ))}
        </div>
      )}

      <ExperienceModal
        isOpen={modalOpen}
        experience={selectedExp}
        onClose={() => {
          setModalOpen(false);
          setSelectedExp(null);
        }}
        onSaved={refresh}
      />
    </div>
  );
}
