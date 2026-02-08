"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Save, X, Layout, Clock, 
  DollarSign, Upload, Trash2, MapPin, 
  Info, AlertCircle, Loader2, Check 
} from "lucide-react";

// Suburb list for selection
const AU_SUBURBS = [
  { name: "Sydney", state: "NSW" },
  { name: "Melbourne", state: "VIC" },
  { name: "Brisbane", state: "QLD" },
  { name: "Perth", state: "WA" },
  { name: "Adelaide", state: "SA" },
  { name: "Parramatta", state: "NSW" },
  { name: "Southbank", state: "VIC" },
  { name: "Surry Hills", state: "NSW" },
  { name: "Bondi", state: "NSW" },
];

interface PortfolioModalProps {
  onAdd: () => void;
  isOpen: boolean; // Now strictly required
  onClose: () => void; // Now strictly required
  project?: any;
}

export default function PortfolioModal({ onAdd, isOpen, onClose, project }: PortfolioModalProps) {
  const today = new Date().toISOString().split("T")[0];
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSuburbs, setFilteredSuburbs] = useState(AU_SUBURBS);

  const [form, setForm] = useState({
    title: "",
    description: "",
    projectImage: null as File | string | null,
    hours: "",
    rate: "",
    location: "", 
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || "",
        description: project.description || "",
        projectImage: project.projectImage || null,
        hours: String(project.hours || ""),
        rate: String(project.rate || ""),
        location: project.location || "",
        startDate: project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : "",
        endDate: project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : "",
      });
      setPreview(project.projectImage || null);
      setSearchTerm(project.location || "");
    } else {
      setForm({ title: "", description: "", projectImage: null, hours: "", rate: "", location: "", startDate: "", endDate: "" });
      setPreview(null);
      setSearchTerm("");
    }
    setError(null);
  }, [project, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setIsDropdownOpen(true);
    const filtered = AU_SUBURBS.filter(s => 
      s.name.toLowerCase().includes(val.toLowerCase()) || 
      s.state.toLowerCase().includes(val.toLowerCase())
    );
    setFilteredSuburbs(filtered);
  };

  const selectLocation = (suburb: any) => {
    const locString = `${suburb.name}, ${suburb.state}`;
    setForm({ ...form, location: locString });
    setSearchTerm(locString);
    setIsDropdownOpen(false);
    setError(null);
  };

  const getCroppedImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const targetRatio = 6 / 4;
        let sW = img.width, sH = img.height, sX = 0, sY = 0;
        if (sW / sH > targetRatio) { sW = sH * targetRatio; sX = (img.width - sW) / 2; }
        else { sH = sW / targetRatio; sY = (img.height - sH) / 2; }
        canvas.width = 1200; canvas.height = 800;
        ctx?.drawImage(img, sX, sY, sW, sH, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) resolve(new File([blob], file.name, { type: "image/jpeg" }));
        }, "image/jpeg", 0.9);
      };
      img.onerror = reject;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/jpg"].includes(file.type)) {
        setError("Only JPG images are allowed.");
        return;
      }
      setLoading(true);
      const cropped = await getCroppedImage(file);
      setForm({ ...form, projectImage: cropped });
      setPreview(URL.createObjectURL(cropped));
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation checks for empty fields
    if (!preview) {
      setError("Project image is required.");
      return;
    }
    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }
    if (!form.location.trim()) {
      setError("Location is required. Please select from the list.");
      return;
    }
    if (!form.hours || Number(form.hours) <= 0) {
      setError("Total hours are required and must be greater than 0.");
      return;
    }
    if (!form.rate || Number(form.rate) <= 0) {
      setError("Hourly rate is required and must be greater than 0.");
      return;
    }
    if (!form.startDate) {
      setError("Start date is required.");
      return;
    }
    if (!form.description.trim()) {
      setError("Project description is required.");
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors
    
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "projectImage" && value instanceof File) {
          formData.append("image", value);
        } else if (value) {
          formData.append(key, String(value));
        }
      });

      const res = await fetch(project ? `/api/portfolio/${project.id}` : "/api/portfolio", {
        method: project ? "PATCH" : "POST",
        body: formData,
      });

      if (res.ok) {
        onAdd();
        onClose();
      } else {
        const data = await res.json();
        setError(data.message || "Failed to save project.");
      }
    } catch (err) {
      setError("A server error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm dark:text-white transition-all";
  const labelClasses = "text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 block";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-100 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Layout className="text-primary" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-neutral-800 dark:text-white">
              {project ? "Edit Portfolio" : "Add Portfolio"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full">
            <X size={24} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 scrollbar-hide">
          {/* Left: Image Upload */}
          <div className="lg:col-span-5">
            <label className={labelClasses}>Cover Photo (JPG Only)</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".jpg,.jpeg" className="hidden" />
            <div className="aspect-6/4 w-full relative">
              {!preview ? (
                <button onClick={() => fileInputRef.current?.click()} className="w-full h-full border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group">
                  <Upload size={32} className="text-primary group-hover:scale-110 transition-transform" />
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Select Image</p>
                </button>
              ) : (
                <div className="w-full h-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 group relative">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => {setPreview(null); setForm({...form, projectImage: null})}} className="p-3 bg-red-500 text-white rounded-full">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-medium text-neutral-500 leading-relaxed flex items-start gap-2">
                <Info size={14} className="text-primary shrink-0" />
                <span>Best resolution is <b>1200x800 px</b>. Image will be center-cropped to a 6:4 ratio.</span>
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-500 text-[11px] font-bold rounded-xl flex items-center gap-2 border border-red-200">
                <AlertCircle size={14} /> {error}
              </div>
            )}
          </div>

          {/* Right: Form Details */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            <div>
              <label className={labelClasses}>Project Title *</label>
              <div className="relative">
                <Layout size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input placeholder="e.g. Modern Web Redesign" className={inputClasses} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <label className={labelClasses}>Location (Suburb/State) *</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input 
                  placeholder="Search Suburb..." 
                  className={inputClasses} 
                  value={searchTerm} 
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setIsDropdownOpen(true)}
                />
              </div>
              
              {isDropdownOpen && filteredSuburbs.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl max-h-48 overflow-y-auto py-2">
                  {filteredSuburbs.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => selectLocation(s)}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-primary/10 flex items-center justify-between group"
                    >
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium">{s.name}, {s.state}</span>
                      {form.location === `${s.name}, ${s.state}` && <Check size={14} className="text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Total Hours *</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="number" className={inputClasses} value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Hourly Rate ($)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input type="number" className={inputClasses} value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Start Date *</label>
                <input type="date" className={`${inputClasses} pl-4`} max={today} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div>
                <label className={labelClasses}>End Date</label>
                <input type="date" className={`${inputClasses} pl-4`} min={form.startDate} max={today} value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Description *</label>
              <textarea placeholder="Tell us about the project..." rows={3} className="w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm resize-none dark:text-white" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
          <button onClick={onClose} className="px-6 py-2 text-xs font-bold text-neutral-400 uppercase tracking-widest">Cancel</button>
          <button onClick={handleSubmit} disabled={loading} className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20">
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {loading ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>
    </div>
  );
}