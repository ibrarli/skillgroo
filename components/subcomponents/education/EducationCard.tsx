"use client";

import { Calendar, MoreHorizontal, Edit2, Trash2 } from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate?: string | Date;
  endDate?: string | Date;
  current?: boolean;
}

interface EducationCardProps {
  edu: Education;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleEdit?: (e: React.MouseEvent, edu: Education) => void;
  handleDelete?: (e: React.MouseEvent, id: string) => void;
  uneditable?: boolean; // NEW optional prop
}

export default function EducationCard({
  edu,
  activeMenu,
  setActiveMenu,
  handleEdit,
  handleDelete,
  uneditable = false, // default to false
}: EducationCardProps) {
  return (
    <div className="group relative">
      <div className="w-full bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-700 hover:border-primary/30 transition-all shadow-sm">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-primary transition-colors leading-tight">
              {edu.degree}
            </h4>

            <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">
              {edu.institution}
            </p>

            <div className="flex items-center gap-2 mt-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-white dark:bg-neutral-800 w-fit px-3 py-1.5 rounded-full border border-neutral-100 dark:border-neutral-700 shadow-sm">
              <Calendar size={12} />
              <span>
                {edu.startDate
                  ? new Date(edu.startDate).getFullYear()
                  : "N/A"}{" "}
                —{" "}
                {edu.current
                  ? "Present"
                  : edu.endDate
                  ? new Date(edu.endDate).getFullYear()
                  : ""}
              </span>
            </div>
          </div>

          {!uneditable && ( // only show menu if not uneditable
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
                      onClick={(e) => handleEdit?.(e, edu)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700"
                    >
                      <Edit2 size={14} className="text-blue-500" />
                      <span className="font-semibold">Edit Entry</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete?.(e, edu.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span className="font-semibold">Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}