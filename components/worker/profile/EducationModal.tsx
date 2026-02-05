"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import IconButton from "../../global/IconButton";
import { Save, X, Calendar, GraduationCap } from "lucide-react";

// Match the shape of your data
interface Education {
  id: string;
  degree: string;
  institution: string;
  from: string;
  to?: string;
  present: boolean;
}

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  education?: Education | null; // Added this to fix the TypeScript error
}

export default function EducationModal({ isOpen, onClose, onSaved, education }: EducationModalProps) {
  const [form, setForm] = useState({
    degree: "",
    institution: "",
    from: "",
    to: "",
    present: false,
  });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Populate form if editing, reset if adding
  useEffect(() => {
    if (education) {
      setForm({
        degree: education.degree,
        institution: education.institution,
        from: education.from ? education.from.split("T")[0] : "",
        to: education.to ? education.to.split("T")[0] : "",
        present: education.present,
      });
    } else {
      setForm({ degree: "", institution: "", from: "", to: "", present: false });
    }
  }, [education, isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const isValidDates = () => {
    if (!form.from) return false;
    if (form.from > today) {
      alert("Start date cannot be in the future");
      return false;
    }
    if (!form.present) {
      if (!form.to) {
        alert("End date is required");
        return false;
      }
      if (form.to < form.from) {
        alert("End date must be after start date");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!form.degree || !form.institution) return alert("Degree and Institution are required");
    if (!isValidDates()) return;

    setLoading(true);
    try {
      if (education?.id) {
        // UPDATE MODE
        await axios.patch(`/api/education/${education.id}`, {
          ...form,
          to: form.present ? null : form.to,
        });
      } else {
        // CREATE MODE
        await axios.post("/api/education", {
          ...form,
          to: form.present ? null : form.to,
        });
      }
      
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save education");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses =
    "w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-neutral-900 dark:text-white placeholder:text-neutral-400";
  const labelClasses =
    "text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
              {education ? "Edit Education" : "Add Education"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X size={24} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Degree</label>
              <input
                className={inputClasses}
                placeholder="e.g. Bachelor of Science"
                value={form.degree}
                onChange={(e) => setForm({ ...form, degree: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClasses}>Institution</label>
              <input
                className={inputClasses}
                placeholder="e.g. Stanford University"
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Start Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="date"
                  max={today}
                  className={`${inputClasses} pl-10`}
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                />
              </div>
            </div>

            {!form.present && (
              <div className="animate-in slide-in-from-top-1">
                <label className={labelClasses}>End Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="date"
                    min={form.from || undefined}
                    className={`${inputClasses} pl-10`}
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-neutral-300 text-primary focus:ring-primary cursor-pointer"
              checked={form.present}
              onChange={(e) => setForm({ ...form, present: e.target.checked, to: "" })}
            />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300 group-hover:text-primary transition-colors">
              I am currently studying here
            </span>
          </label>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
           <button onClick={onClose} className="px-6 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-700 transition-colors">
              Cancel
           </button>
           <IconButton
            text={loading ? "Saving..." : education ? "Update Education" : "Save Education"}
            icon={<Save size={18} />}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}