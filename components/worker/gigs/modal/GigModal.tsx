"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save,
  X,
  Briefcase,
  MapPin,
  Tag,
  DollarSign,
  Upload,
  Trash2,
  Loader2,
  AlertCircle,
  Search,
  Check,
  Eye,
  EyeOff,
  FileText,
} from "lucide-react";

const CATEGORIES = [
  "Carpentry",
  "Plumbing",
  "Electrical",
  "HVAC",
  "Masonry",
  "Painting",
  "Landscaping",
  "Flooring",
  "Cleaning",
  "General Labor",
].sort();
const SERVICE_TYPES = [
  "One-time Task",
  "Recurring Service",
  "Emergency Repair",
  "Consultation",
  "Project-based",
];
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

export default function GigModal({
  onSuccess,
  onClose,
  gig,
  forceOpen = false,
}: any) {
  const [open, setOpen] = useState(forceOpen);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);

  // Suburb Dropdown State
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredSuburbs, setFilteredSuburbs] = useState(AU_SUBURBS);

  // Keywords State
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "",
    serviceType: "",
    status: "active",
    imageFile: null as File | null,
  });

  useEffect(() => {
    setOpen(forceOpen);
  }, [forceOpen]);

  useEffect(() => {
    if (gig) {
      setForm({
        title: gig.title || "",
        description: gig.description || "",
        price: String(gig.price || ""),
        location: gig.location || "",
        category: gig.category || "",
        serviceType: gig.serviceType || "",
        status: gig.status || "active",
        imageFile: null,
      });
      setPreview(gig.image || null);
      setKeywords(gig.keywords ? gig.keywords.split(",") : []);
      setSearchTerm(gig.location || "");
    } else {
      setForm({
        title: "",
        description: "",
        price: "",
        location: "",
        category: "",
        serviceType: "",
        status: "active",
        imageFile: null,
      });
      setPreview(null);
      setKeywords([]);
      setSearchTerm("");
    }
    setShowErrors(false);
    setError(null);
  }, [gig, open]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [dropdownRef]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && keywordInput.trim()) {
      e.preventDefault();
      if (keywords.length >= 4) return;
      const val = keywordInput.trim().substring(0, 20);
      if (!keywords.includes(val)) setKeywords([...keywords, val]);
      setKeywordInput("");
    }
  };

  const removeKeyword = (tag: string) =>
    setKeywords(keywords.filter((k) => k !== tag));

  const handleSuburbSearch = (val: string) => {
    setSearchTerm(val);
    setIsDropdownOpen(true);
    setFilteredSuburbs(
      AU_SUBURBS.filter((s) =>
        s.name.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  const selectLocation = (suburb: any) => {
    const loc = `${suburb.name}, ${suburb.state}`;
    setForm({ ...form, location: loc });
    setSearchTerm(loc);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async () => {
    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.serviceType ||
      !form.location ||
      !form.price ||
      (!preview && !form.imageFile)
    ) {
      setShowErrors(true);
      setError("Please fill all required fields marked with *");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    Object.entries(form).forEach(
      ([k, v]) => v && formData.append(k, v.toString())
    );
    formData.append("keywords", keywords.join(","));
    if (form.imageFile) formData.append("image", form.imageFile);

    try {
      const res = await fetch(gig ? `/api/gigs/${gig.id}` : "/api/gigs", {
        method: gig ? "PUT" : "POST",
        body: formData,
      });
      if (res.ok) {
        onSuccess?.();
        handleClose();
      }
    } catch (err) {
      setError("Failed to save.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const inputClasses = (val: any) =>
    `w-full bg-neutral-100 dark:bg-neutral-700 border ${
      showErrors && !val
        ? "border-red-500 ring-1 ring-red-500"
        : "border-neutral-200 dark:border-neutral-600"
    } p-3 pl-10 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-sm text-neutral-900 dark:text-white`;
  const labelClasses =
    "text-[11px] font-black text-neutral-400 uppercase tracking-widest mb-1.5 block";

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Briefcase className="text-primary" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tighter text-neutral-800 dark:text-white">
              {gig ? "Edit Gig Service" : "Add New Gig Service"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X size={24} className="text-neutral-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 scrollbar-hide">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <label className={labelClasses}>Gig Showcase Image *</label>
              <div
                className={`aspect-[6/4] rounded-3xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
                  showErrors && !preview
                    ? "border-red-500 bg-red-50/50"
                    : "border-neutral-200 dark:border-neutral-700"
                }`}
              >
                {preview ? (
                  <div className="relative w-full h-full group">
                    <img
                      src={preview}
                      className="object-cover w-full h-full"
                      alt="Gig"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        onClick={() => {
                          setPreview(null);
                          setForm({ ...form, imageFile: null });
                        }}
                        className="p-3 bg-red-500 text-white rounded-full shadow-lg"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-3 text-neutral-400 font-bold uppercase text-[10px] tracking-widest hover:text-primary transition-colors"
                  >
                    <Upload size={32} className="text-primary" />
                    <span>Upload JPG (1200x800)</span>
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Search Tags (Max 4)</label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-3.5 text-neutral-400"
                  size={16}
                />
                <input
                  className={inputClasses(true)}
                  placeholder={
                    keywords.length >= 4
                      ? "Limit reached"
                      : "Type tag & hit Enter..."
                  }
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleAddKeyword}
                  disabled={keywords.length >= 4}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {keywords.map((k) => (
                  <span
                    key={k}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border border-primary/20"
                  >
                    {k}
                    <X
                      size={12}
                      className="cursor-pointer hover:text-red-500"
                      onClick={() => removeKeyword(k)}
                    />
                  </span>
                ))}
              </div>
            </div>

            {/* Replaced info box with dynamic error display */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-black uppercase tracking-tight rounded-2xl flex items-center gap-2 border border-red-100 dark:border-red-900/30 animate-shake">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className={labelClasses}>Gig Title *</label>
                <span className="text-[10px] text-neutral-400 font-bold">{form.title.length}/70</span>
              </div>
              <div className="relative">
                <Briefcase
                  className={`absolute left-3 top-3.5 ${
                    showErrors && !form.title ? "text-red-500" : "text-neutral-400"
                  }`}
                  size={16}
                />
                <input
                  className={inputClasses(form.title)}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  maxLength={70}
                  placeholder="e.g. Professional Home Painting Service"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5">
                <label className={labelClasses}>Service Description *</label>
                <span className="text-[10px] text-neutral-400 font-bold">{form.description.length}/500</span>
              </div>
              <div className="relative">
                <FileText
                  className={`absolute left-3 top-4 ${
                    showErrors && !form.description ? "text-red-500" : "text-neutral-400"
                  }`}
                  size={16}
                />
                <textarea
                  className={`w-full bg-neutral-100 dark:bg-neutral-700 p-4 pl-10 rounded-xl text-sm whitespace-pre-wrap border outline-none focus:ring-2 focus:ring-primary transition-all text-neutral-900 dark:text-white ${
                    showErrors && !form.description
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-neutral-200 dark:border-neutral-600"
                  }`}
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  maxLength={500}
                  placeholder="Detail your services..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Category *</label>
                <div className="relative">
                  <select
                    className={inputClasses(form.category)}
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Service Type *</label>
                <div className="relative">
                  <select
                    className={inputClasses(form.serviceType)}
                    value={form.serviceType}
                    onChange={(e) =>
                      setForm({ ...form, serviceType: e.target.value })
                    }
                  >
                    <option value="">Select Type</option>
                    {SERVICE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative z-50" ref={dropdownRef}>
                <label className={labelClasses}>Suburb / Location *</label>
                <div className="relative">
                  <MapPin
                    className={`absolute left-3 top-3.5 z-10 ${
                      showErrors && !form.location ? "text-red-500" : "text-neutral-400"
                    }`}
                    size={16}
                  />
                  <input
                    className={inputClasses(form.location)}
                    value={searchTerm}
                    placeholder="Search Suburb..."
                    onChange={(e) => handleSuburbSearch(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                  />
                </div>
                {isDropdownOpen && filteredSuburbs.length > 0 && (
                  <div className="absolute left-0 right-0 z-[110] w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl mt-1 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-h-48 overflow-y-auto py-2">
                    {filteredSuburbs.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => selectLocation(s)}
                        className="w-full text-left px-4 py-2.5 text-xs hover:bg-primary/10 flex items-center justify-between group"
                      >
                        <span className="font-bold text-neutral-600 dark:text-neutral-300">
                          {s.name}, {s.state}
                        </span>
                        <Check size={12} className="text-primary opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className={labelClasses}>Price ($) *</label>
                <div className="relative">
                  <DollarSign
                    className={`absolute left-3 top-3.5 ${
                      showErrors && !form.price ? "text-red-500" : "text-neutral-400"
                    }`}
                    size={16}
                  />
                  <input
                    type="number"
                    className={inputClasses(form.price)}
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Public Visibility</label>
              <div className="flex bg-neutral-100 dark:bg-neutral-700 rounded-2xl p-1.5 gap-1.5">
                <button
                  onClick={() => setForm({ ...form, status: "active" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                    form.status === "active"
                      ? "bg-white dark:bg-neutral-600 shadow-md text-green-600"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  <Eye size={14} /> Active
                </button>
                <button
                  onClick={() => setForm({ ...form, status: "inactive" })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                    form.status === "inactive"
                      ? "bg-white dark:bg-neutral-600 shadow-md text-red-500"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  <EyeOff size={14} /> Inactive
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 flex justify-end gap-4 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-xs font-bold text-neutral-400 uppercase tracking-widest hover:text-neutral-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {loading ? "Publishing..." : "Save Gig Service"}
          </button>
        </div>
      </div>
    </div>
  );
}