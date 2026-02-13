"use client";

import { useState, useRef } from "react";
import { X, Camera, Loader2, Save, MapPin, Languages, User as UserIcon, Radio } from "lucide-react";
import IconButton from "@/components/global/IconButton";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialProfile: any;
  onUpdate: (data: any) => void;
}

export default function ProfileEditModal({ isOpen, onClose, initialProfile, onUpdate }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: initialProfile?.user?.name || "",
    username: initialProfile?.user?.username || "",
    title: initialProfile?.title || "",
    about: initialProfile?.about || "",
    location: initialProfile?.location || "",
    languages: (initialProfile?.languages as string[]) || [],
    isOnline: initialProfile?.isOnline ?? false, // Add this
  });

  if (!isOpen) return null;

  const handleSave = async (selectedFile?: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "languages") formData.append(key, JSON.stringify(value));
        else formData.append(key, String(value)); // Convert boolean to string for FormData
      });
      
      if (selectedFile) formData.append("image", selectedFile);

      const res = await fetch("/api/profile", { method: "PATCH", body: formData });

      if (res.ok) {
        const updated = await res.json();
        onUpdate(updated);
        router.refresh();
        if (!selectedFile) onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl border border-neutral-200 dark:border-neutral-800">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md p-8 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center z-10">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-neutral-900 dark:text-white">Edit Profile</h2>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Update your public presence</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Avatar & Online Toggle Row */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-primary/20 relative">
                <Image 
                   src={initialProfile?.image || "/api/placeholder/128/128"} 
                   alt="Avatar" fill className="object-cover" 
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-transform"
              >
                <Camera size={18} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSave(e.target.files[0])} />
            </div>

            {/* Online Status Toggle */}
            <div 
              onClick={() => setForm({...form, isOnline: !form.isOnline})}
              className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 px-6 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all"
            >
              <div className={`w-3 h-3 rounded-full ${form.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'}`} />
              <span className="text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-300">
                {form.isOnline ? 'You are Online' : 'You are Offline'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" icon={<UserIcon size={14}/>} value={form.name} onChange={(v: any) => setForm({...form, name: v})} />
            <InputField label="Username" prefix="@" value={form.username} onChange={(v: any) => setForm({...form, username: v})} />
            <InputField label="Location" icon={<MapPin size={14}/>} value={form.location} onChange={(v: any) => setForm({...form, location: v})} />
            <InputField label="Title" value={form.title} onChange={(v: any) => setForm({...form, title: v})} placeholder="e.g. Creative Designer" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2">Bio / About</label>
            <textarea 
              value={form.about}
              onChange={(e) => setForm({...form, about: e.target.value})}
              className="w-full bg-neutral-50 dark:bg-neutral-800 p-5 rounded-[2rem] min-h-[120px] outline-none border border-transparent focus:border-primary/30 transition-all text-sm font-medium text-neutral-900 dark:text-white"
            />
          </div>

          <IconButton 
            icon={<Save size={18} />}
            text="Save Changes"
            loading={loading}
            onClick={() => handleSave()}
            className="w-full py-5 bg-primary text-white rounded-full font-black uppercase tracking-widest"
          />
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, prefix, icon, placeholder }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2">{label}</label>
      <div className="relative">
        {(prefix || icon) && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-bold">
            {prefix || icon}
          </div>
        )}
        <input 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-neutral-50 dark:bg-neutral-800 p-4 ${prefix || icon ? 'pl-12' : 'pl-6'} rounded-2xl outline-none border border-transparent focus:border-primary/30 text-sm font-bold text-neutral-900 dark:text-white`}
        />
      </div>
    </div>
  );
}