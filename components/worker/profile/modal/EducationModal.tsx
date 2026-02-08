"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Icons Import
import { Save, X, GraduationCap, AlertCircle } from "lucide-react";

// Child Component
import IconButton from "@/components/global/IconButton";

// Types Declaration
interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string; 
  endDate?: string;   
  current: boolean;   
}

// Component Props
interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  education?: Education | null;
}

// Main Component
export default function EducationModal({ isOpen, onClose, onSaved, education }: EducationModalProps) {

  // States
  const [form, setForm] = useState({
    degree: "",
    institution: "",
    startDate: "",
    endDate: "",
    current: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Storing Today's Date
  const today = new Date().toISOString().split("T")[0];

  // Setting Characters Limits
  const LIMITS = {
    degree: 80,
    institution: 100,
  };

  useEffect(() => {
    setError(null);
    if (education && isOpen) {
      setForm({
        degree: education.degree,
        institution: education.institution,
        startDate: education.startDate ? new Date(education.startDate).toISOString().split("T")[0] : "",
        endDate: education.endDate ? new Date(education.endDate).toISOString().split("T")[0] : "",
        current: education.current,
      });
    } else if (isOpen) {
      setForm({ degree: "", institution: "", startDate: "", endDate: "", current: false });
    }
  }, [education, isOpen]);

  const handleSubmit = async () => {
    // Strict Field Validation
    if (!form.degree.trim()) return setError("Degree title is required.");
    if (!form.institution.trim()) return setError("Institution name is required.");
    if (!form.startDate) return setError("Start date is required.");
    if (!form.current && !form.endDate) return setError("End date is required.");

    // Logic Validation
    if (form.startDate > today) return setError("Start date cannot be in the future.");
    if (!form.current && form.endDate < form.startDate) return setError("End date must be after start date.");

    setLoading(true);
    setError(null);

    try {
      const payload = {
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        startDate: new Date(form.startDate).toISOString(),
        endDate: form.current ? null : new Date(form.endDate).toISOString(),
        current: form.current,
      };

      if (education?.id) {
        await axios.patch(`/api/education/${education.id}`, payload);
      } else {
        await axios.post("/api/education", payload);
      }
      
      onSaved();
      onClose();
    } catch (error: any) {
      console.error(error);
      setError(error.response?.data?.error || "Failed to save education.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses = "w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm dark:text-white";
  const labelClasses = "text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 block";
  const counterClasses = "text-[10px] text-neutral-400 mt-1 text-right block font-medium";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white">
              {education ? "Edit Education" : "Add Education"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-500/20">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Degree *</label>
              <input
                className={inputClasses}
                placeholder="e.g. BS Computer Science"
                value={form.degree}
                maxLength={LIMITS.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
              <span className={counterClasses}>{form.degree.length} / {LIMITS.degree}</span>
            </div>
            <div>
              <label className={labelClasses}>Institution *</label>
              <input
                className={inputClasses}
                placeholder="e.g. Stanford University"
                value={form.institution}
                maxLength={LIMITS.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
              />
              <span className={counterClasses}>{form.institution.length} / {LIMITS.institution}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Start Date *</label>
              <input
                type="date"
                max={today}
                className={inputClasses}
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>

            {!form.current && (
              <div>
                <label className={labelClasses}>End Date *</label>
                <input
                  type="date"
                  min={form.startDate}
                  className={inputClasses}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer w-fit">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-md border-neutral-300 text-primary focus:ring-primary cursor-pointer"
              checked={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: "" })}
            />
            <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
              I am currently studying here
            </span>
          </label>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
        
           <IconButton
            text={loading ? "Saving..." : "Save Education"}
            icon={<Save size={18} />}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}