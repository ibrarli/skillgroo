"use client";

import { useEffect, useState } from "react";
import SkillModal from "./SkillModal";
import { Lightbulb, X, Award } from "lucide-react";
import axios from "axios";

interface Skill {
  id: string;
  name: string;
  level: number;
}

export default function SkillSection() {
  const [skills, setSkills] = useState<Skill[]>([]);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/skills/${id}`);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mt-6 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Lightbulb size={22} />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
            Skills
          </h2>
        </div>
        <SkillModal onAdd={fetchSkills} />
      </div>

      {skills.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-400 font-medium">No skills added yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
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
              
              {/* Delete Button - Styled as a circular end-cap */}
              <button
                onClick={() => handleDelete(skill.id)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-red-500 transition-all"
                title="Remove Skill"
              >
                <X size={14} strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}