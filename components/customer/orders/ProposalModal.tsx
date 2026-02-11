"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

// Icons Import
import { 
  X, Clock, Camera, CheckCircle2, Lock 
} from "lucide-react";

// Child Components
import IconButton from "@/components/global/IconButton";

// Props
interface ProposalModalProps {
  gigId: string;
  providerId: string;
  basePrice: number; 
  isOwner: boolean;
  isLoggedIn: boolean;
}

// Main Component 
export default function ProposalModal({ 
  gigId, 
  providerId, 
  basePrice, 
  isOwner, 
  isLoggedIn 
}: ProposalModalProps) {

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    description: "",
    estimatedHours: "1",
    startDate: "",
    deadlineDays: "",
    location: "",
  });

  // --- AUTO-CALCULATION LOGIC ---
  // Using basePrice as a constant hourly rate
  const totalOfferPrice = useMemo(() => {
    const hours = parseFloat(formData.estimatedHours) || 0;
    return (basePrice * hours).toFixed(2);
  }, [formData.estimatedHours, basePrice]);

  // Validation check
  const validate = () => {
    const err: Record<string, string> = {};
    if (formData.description.length < 20) err.description = "Min 20 characters required.";
    if (!formData.estimatedHours || parseInt(formData.estimatedHours) <= 0) err.estimatedHours = "Required";
    if (!formData.startDate) err.startDate = "Select a start date";
    if (!formData.location) err.location = "Location required";
    if (images.length === 0) err.images = "Reference image required.";
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // Submission of Proposal
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const data = new FormData();
      data.append("gigId", gigId);
      data.append("providerId", providerId);
      data.append("description", formData.description);
      data.append("estimatedHours", formData.estimatedHours);
      data.append("startDate", formData.startDate);
      data.append("deadlineDays", formData.deadlineDays);
      data.append("location", formData.location);
      data.append("offeredPrice", totalOfferPrice);
      
      images.forEach((img) => data.append("images", img));

      const res = await fetch("/api/orders/proposal", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => { setIsOpen(false); window.location.reload(); }, 2000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Checks
  if (isOwner || !isLoggedIn) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="w-full py-5 bg-neutral-900 dark:bg-white dark:text-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all"
      >
        Send Your Proposal
      </button>

      {/* Open Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row relative">
            
            {/* LEFT SIDE: References */}
            <div className="w-full md:w-2/5 bg-neutral-50 dark:bg-neutral-800/50 p-8 border-r dark:border-neutral-800 overflow-y-auto">
              <div className="sticky top-0 space-y-6">
                <h3 className="text-2xl font-black ">Reference Work</h3>
                <div className="grid grid-cols-1 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-video rounded-4xl bg-neutral-200 dark:bg-neutral-800 relative overflow-hidden group border-2 border-white dark:border-neutral-700 shadow-sm">
                      <Image src={URL.createObjectURL(img)} fill className="object-cover" alt="preview" />
                      <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full"><X size={14}/></button>
                    </div>
                  ))}
                  {images.length < 2 && (
                    <label className="aspect-video rounded-4xl border-4 border-dashed border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all">
                      <Camera size={24} className="text-neutral-400" />
                      <span className="text-sm font-black  mt-3">Add Reference</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setImages([...images, ...Array.from(e.target.files)])} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="flex-1 p-8 overflow-y-auto space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">Proposal Terms</h2>
                <button onClick={() => setIsOpen(false)} className="p-3 bg-neutral-100 dark:bg-neutral-800 cursor-pointer rounded-2xl"><X size={20}/></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black  text-neutral-400 ml-5">Project Description *</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full h-32 p-6 rounded-[2rem] bg-neutral-50 dark:bg-neutral-800 outline-none text-sm focus:ring-2 ring-primary/20 resize-none"
                    placeholder="Describe your delivery plan..."
                  />
                  {errors.description && <p className="text-red-500 text-[10px] font-black">{errors.description}</p>}
                </div>

                {/* Fixed Rate & Hours Display */}
                <div className="grid grid-cols-2 gap-4 p-6 bg-secondary/10 rounded-[2.5rem] border border-secondary ">
                  <div className="space-y-1">
                    <label className="text-xs font-black  text-white flex items-center gap-1"> Hours to Complete *</label>
                    <input 
                      type="number" 
                      className="w-full bg-transparent text-xl font-black outline-none focus:text-primary transition-colors" 
                      value={formData.estimatedHours}
                      onChange={(e) => setFormData({...formData, estimatedHours: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1 opacity-60">
                    <label className="text-xs font-black  text-neutral-500 flex items-center gap-1"><Lock size={10}/> Fixed Rate / Hr</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-neutral-400">${basePrice}</span>
                      <span className="text-[8px] font-bold bg-neutral-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded uppercase">Locked</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black  text-neutral-400">Start Date *</label>
                    <input type="date" className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 outline-none" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black  text-neutral-400">Location *</label>
                    <input type="text" className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 outline-none" placeholder="Remote/City" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  </div>
                </div>

                {/* Final Price Footer */}
                <div className="pt-4 border-t dark:border-neutral-800">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                      <p className="text-xs font-black text-neutral-400  tracking-widest">Grand Total</p>
                      <h4 className="text-4xl font-black tracking-tighter">${totalOfferPrice}</h4>
                    </div>
                    
                    <IconButton 
                      text={loading ? "Sending..." : "Submit Proposal"}
                      icon={loading ? null : <CheckCircle2 size={18}/>}
                      loading={loading}
                      disabled={loading || status === "success"}
                      onClick={handleSubmit}
                      className="px-10 py-5 rounded-full uppercase font-black text-xs tracking-widest shadow-xl shadow-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}