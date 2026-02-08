"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "@/components/global/IconButton";
import { Plus, Save, X, Lightbulb, TrendingUp, ChevronDown, Check, AlertCircle } from "lucide-react";

interface SkillModalProps {
  onAdd: () => void;
}

const TRADE_SKILLS = [
  "Carpentry", "Plumbing", "Electrical", "HVAC", "Masonry", 
  "Welding", "Painting", "Roofing", "Landscaping", "Flooring",
  "Tiling", "Drywall", "Locksmithing", "Glazing", "Cabinetry",
  "Paving", "Concreting", "Scaffolding", "Demolition", "Insulation"
].sort();

export default function SkillModal({ onAdd }: SkillModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredSkills = TRADE_SKILLS.filter(skill => 
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleEvents = (e: any) => {
      if (e.key === "Escape") setOpen(false);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleEvents);
    window.addEventListener("mousedown", handleEvents);
    return () => {
      window.removeEventListener("keydown", handleEvents);
      window.removeEventListener("mousedown", handleEvents);
    };
  }, []);

  const handleSubmit = async () => {
    if (!name) {
      setShowError(true);
      return;
    }
    
    setLoading(true);
    try {
      await fetch("/api/skills", {
        method: "POST",
        body: JSON.stringify({ name, level }),
      });
      setName("");
      setSearchTerm("");
      setLevel(1);
      setShowError(false);
      setOpen(false);
      onAdd();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = `w-full bg-neutral-100 dark:bg-neutral-700 border ${showError && !name ? 'border-red-500 ring-1 ring-red-500' : 'border-neutral-200 dark:border-neutral-600'} p-3 pl-10 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400 cursor-pointer`;
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
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md shadow-2xl overflow-visible animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Lightbulb className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  Add Skill
                </h2>
              </div>
              <button
                onClick={() => { setOpen(false); setShowError(false); }}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X size={24} className="text-neutral-500" />
              </button>
            </div>

            <div className="p-8 flex flex-col gap-6 overflow-visible">
              {/* Custom Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <label className={labelClasses}>Select Skill *</label>
                <div className="relative">
                  <TrendingUp size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${showError && !name ? 'text-red-500' : 'text-neutral-400'} z-10`} />
                  <input
                    type="text"
                    placeholder="Search trade skills..."
                    value={isDropdownOpen ? searchTerm : name}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                      if (showError) setShowError(false);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    className={inputClasses}
                  />
                  <ChevronDown size={18} className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {showError && !name && (
                  <div className="flex items-center gap-1.5 mt-1.5 text-red-500 text-xs font-bold animate-in slide-in-from-top-1">
                    <AlertCircle size={12} />
                    <span>Please select a skill from the list</span>
                  </div>
                )}

                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-[110] mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto py-2 animate-in fade-in slide-in-from-top-2">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => {
                            setName(skill);
                            setSearchTerm("");
                            setIsDropdownOpen(false);
                            setShowError(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary/10 transition-colors"
                        >
                          {skill}
                          {name === skill && <Check size={14} className="text-primary" />}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-neutral-400">No skills found</div>
                    )}
                  </div>
                )}
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