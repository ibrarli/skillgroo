"use client";

import { useState } from "react";
import { X, Send, CheckCircle, AlertCircle, Loader2, Camera, Trash2, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

interface OrderCompletionModalProps {
  orderId: string;
  onClose: () => void;
}

export default function OrderCompletionModal({ orderId, onClose }: OrderCompletionModalProps) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      setError("Maximum 3 images allowed.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (images.length === 0) {
    setError("Please upload at least one image.");
    return;
  }

  setLoading(true);
  try {
    // Changed URL to match your [id] folder structure
    const response = await fetch(`/api/orders/${orderId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, externalLink, images }),
    });

    if (!response.ok) throw new Error("Failed to submit");
    setSuccess(true);
    setTimeout(() => window.location.reload(), 1500);
  } catch (err: any) {
    setError(err.message);
    setLoading(false);
  }
};

  if (success) {
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-[3.5rem] p-12 text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center italic">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase">Work Delivered!</h2>
          <p className="text-neutral-500 font-bold text-sm">Waiting for buyer approval...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-[3.5rem] relative my-auto shadow-2xl">
        
        <div className="p-8 pb-0 flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Complete Order</h2>
            <p className="text-xs font-bold text-neutral-500">Upload 1-3 images as proof of work.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-full hover:rotate-90 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Image Upload Area */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Work Proof (Images)*</label>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                  <Image src={img} alt="Proof" fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <label className="aspect-square rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-green-500 transition-all text-neutral-400 hover:text-green-500">
                  <Camera size={24} />
                  <span className="text-[8px] font-black uppercase">Add Photo</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Optional Link */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-2">
              <LinkIcon size={12} /> External Link (Optional)
            </label>
            <input 
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="e.g. Figma, Google Drive, or Live Site"
              className="w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-blue-500/50 outline-none text-xs font-bold"
            />
          </div>

          {/* Optional Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Details (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you've delivered..."
              className="w-full min-h-[100px] p-5 rounded-[2rem] bg-neutral-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-green-500/50 outline-none text-xs font-medium resize-none"
            />
          </div>

          {error && <div className="text-red-500 text-[10px] font-black uppercase text-center bg-red-500/10 py-3 rounded-xl">{error}</div>}

          <button 
            type="submit"
            disabled={loading || images.length === 0}
            className="w-full py-5 bg-black dark:bg-white dark:text-black text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Submit Work</>}
          </button>
        </form>
      </div>
    </div>
  );
}