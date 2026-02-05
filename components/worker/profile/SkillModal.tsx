"use client";

import { useState, useEffect } from "react";
import IconButton from "../../global/IconButton";
import { Plus, Save, X, Lightbulb, TrendingUp } from "lucide-react";

interface SkillModalProps {
  onAdd: () => void;
}

export default function SkillModal({ onAdd }: SkillModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSubmit = async () => {
    if (!name) return;
    setLoading(true);
    await fetch("/api/skills", {
      method: "POST",
      body: JSON.stringify({ name, level }),
    });
    setLoading(false);
    setName("");
    setLevel(1);
    setOpen(false);
    onAdd();
  };

  const inputClasses = "w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 pl-10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400";
  const labelClasses = "text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-1 block";

  return (
    <>
      <IconButton
        text="Add Skill"
        icon={<Plus size={18} />}
        onClick={() => setOpen(true)}
      />

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  Add Skill
                </h2>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X size={24} className="text-neutral-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col gap-6">
              <div>
                <label className={labelClasses}>Skill Name</label>
                <div className="relative">
                  <TrendingUp size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="e.g. React, Project Management"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className={labelClasses + " mb-0"}>Experience Level</label>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                    {level} {level === 1 ? 'Year' : 'Years'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-2 text-[10px] text-neutral-400 font-bold uppercase">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-3">
             
              <IconButton
                text={loading ? "Saving..." : "Save Skill"}
                icon={<Save size={18} />}
                onClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}