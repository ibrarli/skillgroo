"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Icons Import
import {
  Plus,
  GraduationCap,
} from "lucide-react";

// Child Component
import IconButton from "../../global/IconButton";
import EducationModal from "@/components/worker/profile/modal/EducationModal";
import SkeletonEducation from "../../subcomponents/education/SkeletonEducation";
import EducationCard from "../../subcomponents/education/EducationCard";



// Components Props
interface EducationSectionProps {
  profile: any;
}

// Main Component
export default function EducationSection({ profile }: any) {
  // States
  const [educations, setEducations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedEdu, setSelectedEdu] = useState<any | null>(null);

  // Sorting Logic: Latest on top (Start Date, then End Date)
  const sortEducations = (data: any[]) => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();

      if (dateB !== dateA) {
        return dateB - dateA; // Primary: Newest Start Date
      }

      // Secondary: Newest End Date (Current/Present is treated as the highest possible date)
      const endA = a.current ? Infinity : new Date(a.endDate || 0).getTime();
      const endB = b.current ? Infinity : new Date(b.endDate || 0).getTime();

      return endB - endA;
    });
  };

  useEffect(() => {
    if (profile?.educations) {
      setEducations(sortEducations(profile.educations));
      setLoading(false);
    } else {
      fetchEducations();
    }
  }, [profile]);

  // Fetching Data from the DB
  const fetchEducations = async () => {
    try {
      const res = await axios.get("/api/education");
      setEducations(sortEducations(res.data));
    } catch (error) {
      console.error("Failed to fetch educations:", error);
    } finally {
      setLoading(false);
    }
  };

  // For Updating the data of the Card
  const handleEdit = (e: React.MouseEvent, edu: any) => {
    e.stopPropagation();
    setSelectedEdu(edu);
    setModalOpen(true);
    setActiveMenu(null);
  };

  // For Deleting the Education Card
  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await axios.delete(`/api/education/${id}`);
      fetchEducations();
      setActiveMenu(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mt-6 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <GraduationCap size={22} />
          </div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
            Education
          </h3>
        </div>

        <IconButton
          text="Add Education"
          icon={<Plus size={18} />}
          onClick={() => {
            setSelectedEdu(null);
            setModalOpen(true);
          }}
        />
      </div>

      {/* Content Logic */}
      {loading ? (
        <SkeletonEducation />
      ) : educations.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-400 font-medium">
            No education history added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <EducationCard
              key={edu.id}
              edu={edu}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <EducationModal
        isOpen={modalOpen}
        education={selectedEdu}
        onClose={() => {
          setModalOpen(false);
          setSelectedEdu(null);
        }}
        onSaved={fetchEducations}
      />
    </div>
  );
}
