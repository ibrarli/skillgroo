"use client";

import { useState, useEffect, useRef } from "react";
import IconButton from "../../global/IconButton";
import { Plus, Save, X, Briefcase, MapPin, Tag, DollarSign, Upload, Trash2, Loader2 } from "lucide-react";

interface GigModalProps {
  onSuccess?: () => void;
  onClose?: () => void;
  gig?: any;
  forceOpen?: boolean; // used to control from parent
}

export default function GigModal({ onSuccess, onClose, gig, forceOpen = false }: GigModalProps) {
  const [open, setOpen] = useState(forceOpen);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    location: "",
    category: "",
    status: "active",
    imageFile: null as File | null, // Store the actual file
  });

  useEffect(() => {
    setOpen(forceOpen);
  }, [forceOpen]);

  useEffect(() => {
    if (gig) {
      setForm({
        title: gig.title || "",
        description: gig.description || "",
        price: gig.price || 0,
        location: gig.location || "",
        category: gig.category || "",
        status: gig.status || "active",
        imageFile: null,
      });
      if (gig.image) setPreview(gig.image);
    } else {
      setForm({
        title: "",
        description: "",
        price: 0,
        location: "",
        category: "",
        status: "active",
        imageFile: null,
      });
      setPreview(null);
    }
  }, [gig, open]);

  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, imageFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.location) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());
    formData.append("location", form.location);
    formData.append("category", form.category);
    formData.append("status", form.status);

    if (form.imageFile) {
      formData.append("image", form.imageFile);
    } else if (gig?.image) {
      formData.append("image", gig.image);
    }

    const url = gig ? `/api/gigs/${gig.id}` : "/api/gigs";
    const method = gig ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Update failed");
      handleClose();
      onSuccess?.();
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save gig. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm text-neutral-900 dark:text-white";
  const labelClasses = "text-sm font-semibold text-neutral-600 dark:text-neutral-300 mb-1 block";

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Briefcase className="text-primary" size={24} />
                <h2 className="text-2xl font-bold text-neutral-800 dark:text-white">
                  {gig ? "Edit Gig" : "Create New Gig"}
                </h2>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                <X size={24} className="text-neutral-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Image Upload */}
              <div className="lg:col-span-5">
                <label className={labelClasses}>Gig Image</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                
                <div className="aspect-square w-full relative">
                  {!preview ? (
                    <button onClick={() => fileInputRef.current?.click()} className="w-full h-full border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all group overflow-hidden">
                      <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                        <Upload size={32} className="text-primary" />
                      </div>
                      <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300 uppercase">Select Image</p>
                    </button>
                  ) : (
                    <div className="w-full h-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 relative group">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => {setPreview(null); setForm({...form, imageFile: null})}}
                          className="p-3 bg-red-500 text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                <div>
                  <label className={labelClasses}>Gig Title</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input placeholder="e.g. Full Stack Development" className={inputClasses} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className={labelClasses}>Description</label>
                  <textarea placeholder="Tell clients about your service..." rows={4} className="w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm resize-none text-neutral-900 dark:text-white" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Price ($)</label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input type="number" className={inputClasses} value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Category</label>
                    <div className="relative">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input placeholder="e.g. Web Dev" className={inputClasses} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClasses}>Location</label>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input placeholder="Remote / City" className={inputClasses} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Status</label>
                    <select className="w-full bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm text-neutral-800 dark:text-white" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800">
              <button onClick={handleClose} className="px-6 py-2 text-sm font-semibold text-neutral-500 hover:text-neutral-700 transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-primary text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {loading ? "Saving..." : "Save Gig"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}