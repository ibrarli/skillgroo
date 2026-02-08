"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// Icons Import
import { Save, X, Briefcase, AlertCircle, Loader2 } from "lucide-react";

// Child Component 
import IconButton from "@/components/global/IconButton";

// Component Props
interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  experience?: any; 
}

// Main Component 
export default function ExperienceModal({ isOpen, onClose, onSaved, experience }: ExperienceModalProps) {

  // State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    from: "",
    to: "",
    present: false,
  });

  // Today Date
  const today = new Date().toISOString().split("T")[0];

  // Character Limits 
  const LIMITS = {
    title: 80,
    company: 100,
    description: 1000
  };

  useEffect(() => {
    setError(null);
    if (experience && isOpen) {
      setForm({
        title: experience.title || "",
        company: experience.company || "",
        description: experience.description || "",
        from: experience.startDate ? new Date(experience.startDate).toISOString().split("T")[0] : "",
        to: experience.endDate ? new Date(experience.endDate).toISOString().split("T")[0] : "",
        present: experience.current || false,
      });
    } else if (isOpen) {
      setForm({ title: "", company: "", description: "", from: "", to: "", present: false });
    }
  }, [experience, isOpen]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Job title is required.");
    if (!form.company.trim()) return setError("Company name is required.");
    if (!form.from) return setError("Start date is required.");
    if (!form.present && !form.to) return setError("End date is required.");

    const startDateObj = new Date(form.from);
    if (isNaN(startDateObj.getTime())) return setError("The start date provided is invalid.");

    let endDateObj = null;
    if (!form.present && form.to) {
      endDateObj = new Date(form.to);
      if (isNaN(endDateObj.getTime())) return setError("The end date provided is invalid.");
    }

    setLoading(true);
    setError(null);

    const payload = {
      title: form.title.trim(),
      company: form.company.trim(),
      description: form.description.trim(),
      startDate: startDateObj.toISOString(), 
      endDate: form.present ? null : (endDateObj ? endDateObj.toISOString() : null), 
      current: form.present, 
    };

    try {
      if (experience?.id) {
        await axios.patch(`/api/experience/${experience.id}`, payload);
      } else {
        await axios.post("/api/experience", payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses = "w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm dark:text-white";
  const labelClasses = "text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 block";
  const counterClasses = "text-[10px] text-neutral-400 mt-1 text-right block font-medium";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Briefcase className="text-primary" size={24} />
            <h2 className="text-xl font-black uppercase tracking-tighter dark:text-white">
              {experience ? "Edit Experience" : "Add Experience"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 text-xs font-bold rounded-xl flex items-center gap-2 border border-red-200 dark:border-red-500/20">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div>
            <label className={labelClasses}>Job Title *</label>
            <input 
              className={inputClasses} 
              placeholder="e.g. Senior Software Engineer"
              value={form.title}
              maxLength={LIMITS.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
            <span className={counterClasses}>{form.title.length} / {LIMITS.title}</span>
          </div>

          <div>
            <label className={labelClasses}>Company *</label>
            <input 
              className={inputClasses} 
              placeholder="e.g. Google"
              value={form.company}
              maxLength={LIMITS.company}
              onChange={(e) => setForm({...form, company: e.target.value})}
            />
            <span className={counterClasses}>{form.company.length} / {LIMITS.company}</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>From *</label>
              <input type="date" className={inputClasses} value={form.from} max={today} onChange={(e) => setForm({...form, from: e.target.value})} />
            </div>
            {!form.present && (
              <div>
                <label className={labelClasses}>To *</label>
                <input type="date" className={inputClasses} value={form.to} min={form.from} max={today} onChange={(e) => setForm({...form, to: e.target.value})} />
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer w-fit p-1 group">
            <input 
              type="checkbox" 
              checked={form.present} 
              onChange={(e) => setForm({...form, present: e.target.checked})} 
              className="w-5 h-5 rounded-md border-neutral-300 text-primary focus:ring-primary transition-all cursor-pointer"
            />
            <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300 group-hover:text-primary transition-colors">
              I currently work here
            </span>
          </label>

          <div>
            <label className={labelClasses}>Description (Optional)</label>
            <textarea 
              rows={3} 
              className={`${inputClasses} resize-none`} 
              placeholder="Describe your key responsibilities..."
              value={form.description}
              maxLength={LIMITS.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
            <span className={counterClasses}>{form.description.length} / {LIMITS.description}</span>
          </div>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
          <button type="button" onClick={onClose} className="px-6 py-2 text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-600 transition-colors">Cancel</button>
          <IconButton
            text={loading ? "Saving..." : "Save Experience"}
            icon={loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}