"use client";

import { Building2, Calendar, MoreHorizontal, Edit2, Trash2 } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface ExperienceCardProps {
  exp: Experience;
  activeMenu: string | null;
  setActiveMenu: (id: string | null) => void;
  handleEdit?: (e: React.MouseEvent, exp: Experience) => void;
  handleDelete?: (e: React.MouseEvent, id: string) => void;
  formatDate: (date: string) => string;
  uneditable?: boolean; // new prop
}

export default function ExperienceCard({
  exp,
  activeMenu,
  setActiveMenu,
  handleEdit,
  handleDelete,
  formatDate,
  uneditable = false,
}: ExperienceCardProps) {
  return (
    <div className="group relative">
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
                {formatDate(exp.startDate)} —{" "}
                {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
              </span>
            </div>
          </div>

          {/* Only show menu if editable */}
          {!uneditable && (
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
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setActiveMenu(null)}
                  />
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl z-40 overflow-hidden ring-1 ring-black ring-opacity-5">
                    <button
                      onClick={(e) => handleEdit?.(e, exp)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors border-b border-neutral-100 dark:border-neutral-700"
                    >
                      <Edit2 size={14} className="text-blue-500" />
                      <span className="font-semibold">Edit Entry</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete?.(e, exp.id)}
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

        {exp.description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed pt-3 border-t border-neutral-100/50 dark:border-neutral-700/50 wrap-break-word">
            {exp.description}
          </p>
        )}
      </div>
    </div>
  );
}