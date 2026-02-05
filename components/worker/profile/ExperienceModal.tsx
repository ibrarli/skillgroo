"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import IconButton from "../../global/IconButton";
import { Save, X, Briefcase, Building2, Calendar } from "lucide-react";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  experience?: any; // The experience object if editing
}

export default function ExperienceModal({ isOpen, onClose, onSaved, experience }: ExperienceModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    from: "",
    to: "",
    present: false,
  });

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (experience) {
      setForm({
        title: experience.title || "",
        company: experience.company || "",
        description: experience.description || "",
        from: experience.from ? new Date(experience.from).toISOString().split("T")[0] : "",
        to: experience.to ? new Date(experience.to).toISOString().split("T")[0] : "",
        present: experience.present || false,
      });
    } else {
      setForm({ title: "", company: "", description: "", from: "", to: "", present: false });
    }
  }, [experience, isOpen]);

  const handleSubmit = async () => {
    if (!form.title || !form.company || !form.from) {
      return alert("Title, Company, and Start Date are required");
    }

    setLoading(true);
    try {
      if (experience?.id) {
        await axios.patch(`/api/experience/${experience.id}`, form);
      } else {
        await axios.post("/api/experience", form);
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error saving experience");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses = "w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 rounded-xl outline-none focus:ring-2 focus:ring-primary transition-all text-sm";
  const labelClasses = "text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-1 block";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Briefcase className="text-primary" size={24} />
            <h2 className="text-xl font-bold dark:text-white">
              {experience ? "Edit Experience" : "Add Experience"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className={labelClasses}>Job Title</label>
            <input 
              className={inputClasses} 
              placeholder="e.g. Senior Software Engineer"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>

          <div>
            <label className={labelClasses}>Company</label>
            <input 
              className={inputClasses} 
              placeholder="e.g. Google"
              value={form.company}
              onChange={(e) => setForm({...form, company: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>From</label>
              <input type="date" className={inputClasses} value={form.from} max={today} onChange={(e) => setForm({...form, from: e.target.value})} />
            </div>
            {!form.present && (
              <div>
                <label className={labelClasses}>To</label>
                <input type="date" className={inputClasses} value={form.to} min={form.from} onChange={(e) => setForm({...form, to: e.target.value})} />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <input 
              type="checkbox" 
              checked={form.present} 
              onChange={(e) => setForm({...form, present: e.target.checked})} 
              className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">I currently work here</span>
          </label>

          <div>
            <label className={labelClasses}>Description (Optional)</label>
            <textarea 
              rows={3} 
              className={`${inputClasses} resize-none`} 
              placeholder="Describe your responsibilities..."
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-neutral-500">Cancel</button>
          <IconButton
            text={loading ? "Saving..." : "Save Experience"}
            icon={<Save size={18} />}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}