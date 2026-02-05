"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "../../global/IconButton";
import { Plus, Save, X, Calendar, Layout, Clock, DollarSign, Upload, Trash2 } from "lucide-react";

interface PortfolioModalProps {
  onAdd: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  project?: any; // Pass the project object when editing
}

export default function PortfolioModal({ onAdd, isOpen: controlledOpen, onClose, project }: PortfolioModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (onClose || (() => {})) : setInternalOpen;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectImage: null as File | string | null,
    hours: 0,
    rate: 0,
    startDate: "",
    endDate: "",
  });

  const today = new Date().toISOString().split("T")[0];

  // Sync form when project changes (Edit Mode)
  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        projectImage: project.projectImage || null,
        hours: project.hours || 0,
        rate: project.rate || 0,
        startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "",
      });
      setPreview(project.projectImage || null);
    } else {
      setForm({ title: "", description: "", projectImage: null, hours: 0, rate: 0, startDate: "", endDate: "" });
      setPreview(null);
    }
  }, [project, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, projectImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.startDate) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      
      // Only append if it's a new file
      if (form.projectImage instanceof File) {
        formData.append("image", form.projectImage);
      }
      
      formData.append("hours", String(form.hours));
      formData.append("rate", String(form.rate));
      formData.append("startDate", form.startDate);
      formData.append("endDate", form.endDate || "");

      const url = project ? `/api/portfolio/${project.id}` : "/api/portfolio";
      const method = project ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        body: formData,
      });

      if (res.ok) {
        if (!isControlled) setOpen(false);
        onAdd();
        if (onClose) onClose();
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm dark:text-white";
  const labelClasses = "text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-1 block";

  if (!open) return !isControlled ? <IconButton text="Add Portfolio" icon={<Plus size={18} />} onClick={() => setOpen(true)} /> : null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Layout className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
              {project ? "Edit Project" : "New Project"}
            </h2>
          </div>
          <button onClick={() => isControlled ? onClose?.() : setOpen(false)} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X size={24} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDE: Image Upload */}
          <div className="lg:col-span-5">
            <label className={labelClasses}>Project Cover</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            
            <div className="aspect-square w-full relative">
              {!preview ? (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group"
                >
                  <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                    <Upload size={32} className="text-primary" />
                  </div>
                  <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300 uppercase tracking-widest">Select Image</p>
                </button>
              ) : (
                <div className="w-full h-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 shadow-sm group relative">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => {setPreview(null); setForm({...form, projectImage: null})}}
                      className="p-3 bg-red-500 text-white rounded-full shadow-xl hover:bg-red-600 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: Details */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <label className={labelClasses}>Project Title</label>
              <div className="relative">
                <Layout size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  value={form.title}
                  placeholder="e.g. Modern Web Dashboard"
                  className={inputClasses}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Description</label>
              <textarea
                value={form.description}
                placeholder="Describe your work..."
                rows={4}
                className="w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm resize-none dark:text-white"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Total Hours</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="number" value={form.hours} className={inputClasses} onChange={(e) => setForm({ ...form, hours: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Hourly Rate ($)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="number" value={form.rate} className={inputClasses} onChange={(e) => setForm({ ...form, rate: Number(e.target.value) })} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Start Date</label>
                <input type="date" value={form.startDate} max={today} className={`${inputClasses} pl-4`} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>End Date</label>
                <input type="date" value={form.endDate} min={form.startDate} className={`${inputClasses} pl-4`} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
          <IconButton text={loading ? "Saving..." : "Save Project"} icon={<Save size={18} />} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}