"use client";

import { useState, useEffect } from "react";
import ExperienceModal from "./ExperienceModal";
import axios from "axios";
import IconButton from "../../global/IconButton";
import { Briefcase, Calendar, Building2, MoreHorizontal, Edit2, Trash2, Plus } from "lucide-react";

export default function ExperienceSection({ profile }: any) {
  // FIX: Default to empty array if profile or experiences are null
  const [experiences, setExperiences] = useState(profile?.experiences || []);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedExp, setSelectedExp] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sync state if profile is loaded asynchronously
  useEffect(() => {
    if (profile?.experiences) {
      setExperiences(profile.experiences);
    }
  }, [profile]);

  const refresh = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      setExperiences(data.experiences || []);
    } catch (error) {
      console.error("Failed to refresh experiences:", error);
    }
  };

  const handleEdit = (e: React.MouseEvent, exp: any) => {
    e.stopPropagation();
    setSelectedExp(exp);
    setModalOpen(true);
    setActiveMenu(null);
  };

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

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mt-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Briefcase size={22} />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white">Experience</h2>
        </div>
        <IconButton 
          text="Add Experience" 
          icon={<Plus size={18}/>} 
          onClick={() => { setSelectedExp(null); setModalOpen(true); }} 
        />
      </div>

      {experiences.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-400 font-medium ">No work experience added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp: any) => (
            <div key={exp.id} className="group relative">
              <div className="w-full bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:border-primary/30 transition-all hover:shadow-md">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
                      {exp.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
                      <Building2 size={14} className="text-neutral-400" />
                      <span className="font-medium text-sm">{exp.company}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-white dark:bg-neutral-800 w-fit px-3 py-1.5 rounded-full border border-neutral-100 dark:border-neutral-700 shadow-sm">
                      <Calendar size={12} />
                      <span>
                        {new Date(exp.from).getFullYear()} — {exp.present ? "Present" : exp.to ? new Date(exp.to).getFullYear() : ""}
                      </span>
                    </div>
                  </div>

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === exp.id ? null : exp.id);
                      }}
                      className="p-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-neutral-400 transition-colors"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {activeMenu === exp.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-40 overflow-hidden ring-1 ring-black ring-opacity-5">
                          <button
                            onClick={(e) => handleEdit(e, exp)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700"
                          >
                            <Edit2 size={14} className="text-blue-500" />
                            <span className="font-semibold">Edit Entry</span>
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, exp.id)}
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

                {exp.description && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed pt-3 border-t border-neutral-100/50 dark:border-neutral-700/50">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ExperienceModal 
        isOpen={modalOpen} 
        experience={selectedExp}
        onClose={() => { setModalOpen(false); setSelectedExp(null); }}
        onSaved={refresh}
      />
    </div>
  );
}