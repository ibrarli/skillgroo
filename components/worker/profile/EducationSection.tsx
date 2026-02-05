"use client";

import { useEffect, useState } from "react";
import EducationModal from "./EducationModal";
import axios from "axios";
import IconButton from "../../global/IconButton";
import { Plus, GraduationCap, Calendar, MoreHorizontal, Edit2, Trash2 } from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  from: string;
  to?: string;
  present: boolean;
}

export default function EducationSection() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);

  const fetchEducations = async () => {
    try {
      const res = await axios.get("/api/education");
      setEducations(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleEdit = (e: React.MouseEvent, edu: Education) => {
    e.stopPropagation();
    setSelectedEdu(edu);
    setModalOpen(true);
    setActiveMenu(null);
  };

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
          <h3 className="text-xl font-bold text-neutral-800 dark:text-white">Education</h3>
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
      {educations.length === 0 ? (
        /* The Dotted Empty State */
        <div className="py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-400 font-medium">No education history added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <div key={edu.id} className="group relative">
              <div className="w-full bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:border-primary/30 transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                      {edu.degree}
                    </h4>
                    <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">
                      {edu.institution}
                    </p>
                    
                    {/* Date Badge */}
                    <div className="flex items-center gap-2 mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-white dark:bg-neutral-800 w-fit px-3 py-1.5 rounded-full border border-neutral-100 dark:border-neutral-700 shadow-sm">
                      <Calendar size={12} />
                      <span>
                        {new Date(edu.from).getFullYear()} — {edu.present ? "Present" : edu.to ? new Date(edu.to).getFullYear() : ""}
                      </span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === edu.id ? null : edu.id);
                      }}
                      className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === edu.id && (
                      <>
                        <div 
                          className="fixed inset-0 z-30" 
                          onClick={() => setActiveMenu(null)}
                        />
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-40 overflow-hidden ring-1 ring-black ring-opacity-5">
                          <button
                            onClick={(e) => handleEdit(e, edu)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700"
                          >
                            <Edit2 size={14} className="text-blue-500" />
                            <span className="font-semibold">Edit Entry</span>
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, edu.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span className="font-semibold">Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
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