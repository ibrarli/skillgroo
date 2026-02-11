"use client";

import { useState, useEffect } from "react";
import { X, Star, CheckCircle2, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import IconButton from "@/components/global/IconButton";

interface RatingModalProps {
  order: any; // This is the Proposal/Order object from the dashboard
  onClose: () => void;
}

export default function RatingModal({ order, onClose }: RatingModalProps) {
  const [loading, setLoading] = useState(false);
  const [proofImages, setProofImages] = useState<string[]>(order.proof?.images || []);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [ratings, setRatings] = useState({
    communication: 0,
    described: 0,
    recommend: 0,
  });

  // 1. Fetch proof images if they aren't already in the object
  useEffect(() => {
    if (proofImages.length === 0) {
      fetch(`/api/orders/${order.id}/complete`)
        .then(res => res.json())
        .then(data => {
          if (data.images) setProofImages(data.images);
        })
        .catch(err => console.error("Failed to load gallery:", err));
    }
  }, [order.id, proofImages.length]);

  const handleStarClick = (category: keyof typeof ratings, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    if (!ratings.communication || !ratings.described || !ratings.recommend || !reviewText) {
      alert("Please fill in all ratings and your review comment.");
      return;
    }

    setLoading(true);
    try {
      // Endpoint updated to /rate to match the API we created
      const res = await fetch(`/api/orders/${order.id}/rating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          communication: ratings.communication,
          described: ratings.described,
          recommend: ratings.recommend,
          reviewText,
          showcaseImage: selectedImage,
        }),
      });

      if (res.ok) {
        onClose();
        window.location.reload(); 
      } else {
        const errorData = await res.text();
        alert(`Error: ${errorData}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const StarInput = ({ label, category }: { label: string, category: keyof typeof ratings }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleStarClick(category, s)}
            className={`p-2 rounded-xl transition-all ${s <= ratings[category] ? "bg-amber-500 text-white scale-110 shadow-lg" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-200"}`}
          >
            <Star size={20} fill={s <= ratings[category] ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row relative border dark:border-neutral-800">
        
        {/* GALLERY SELECTION (Left Sidebar) */}
        <div className="w-full md:w-2/5 bg-neutral-50 dark:bg-neutral-800/50 p-8 border-r dark:border-neutral-800 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon size={20} className="text-amber-500" />
            <h3 className="text-xl font-black uppercase tracking-tighter">Work Gallery</h3>
          </div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase mb-6 leading-tight">
            Select one delivery image to showcase with your review
          </p>
          
          {proofImages.length > 0 ? (
            <div className="grid gap-4">
              {proofImages.map((img: string, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedImage(selectedImage === img ? null : img)}
                  className={`aspect-video rounded-[2rem] relative overflow-hidden cursor-pointer transition-all border-4 ${selectedImage === img ? "border-amber-500 scale-[1.02]" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <Image src={img} fill className="object-cover" alt="work proof" />
                  {selectedImage === img && (
                    <div className="absolute top-4 right-4 bg-amber-500 text-white p-1 rounded-full shadow-lg">
                      <CheckCircle2 size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl">
              <p className="text-[10px] font-black uppercase text-neutral-400">No images available</p>
            </div>
          )}
        </div>

        {/* REVIEW FORM (Right Side) */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-8 bg-white dark:bg-neutral-900">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Rate Experience</h2>
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Share your feedback</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl hover:rotate-90 transition-all"
            >
              <X size={20}/>
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6">
              <StarInput label="Communication with Seller" category="communication" />
              <StarInput label="Service as Described" category="described" />
              <StarInput label="Would Recommend" category="recommend" />
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Review Comment</label>
              <textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full h-40 p-6 rounded-[2.5rem] bg-neutral-50 dark:bg-neutral-800/50 border-2 border-transparent focus:border-amber-500/50 outline-none text-sm font-medium transition-all resize-none"
                placeholder="How was the quality of work? Was the delivery on time?"
              />
            </div>

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-6 rounded-[2rem] bg-neutral-900 dark:bg-white dark:text-black text-white uppercase font-black text-[11px] tracking-[0.2em] shadow-2xl shadow-amber-500/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  Submit Public Review
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}