"use client";

import { X } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface SkillPillProps {
  skill: Skill;
  handleDelete?: (id: string) => void;
  uneditable?: boolean; // new prop
}

export default function SkillPill({ skill, handleDelete, uneditable = false }: SkillPillProps) {
  return (
    <div
      className="flex items-center bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 rounded-full pl-4 pr-1 py-1 hover:border-primary/30 transition-all shadow-sm"
    >
      {/* Skill Name & Level */}
      <div className="flex items-center gap-2 mr-2">
        <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
          {skill.name}
        </span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
          {skill.level}Y
        </span>
      </div>

      {/* Delete Button - only show if not uneditable */}
      {!uneditable && handleDelete && (
        <button
          onClick={() => handleDelete(skill.id)}
          className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-red-500 transition-all"
          title="Remove Skill"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}