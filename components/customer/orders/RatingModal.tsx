"use client";

import { useState } from "react";
import { X, Star, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import IconButton from "@/components/global/IconButton";

interface RatingModalProps {
  order: any;
  onClose: () => void;
}

export default function RatingModal({ order, onClose }: RatingModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [ratings, setRatings] = useState({
    communication: 0,
    described: 0,
    recommend: 0,
  });

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
        alert("Something went wrong saving your review.");
      }
    } catch (err) {
      console.error(err);
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
            onClick={() => handleStarClick(category, s)}
            className={`p-2 rounded-xl transition-all ${s <= ratings[category] ? "bg-amber-500 text-white scale-110 shadow-lg" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"}`}
          >
            <Star size={20} fill={s <= ratings[category] ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3.5rem] shadow-2xl flex flex-col md:flex-row relative border dark:border-neutral-800">
        
        {/* Gallery Selection */}
        <div className="w-full md:w-2/5 bg-neutral-50 dark:bg-neutral-800/50 p-8 border-r dark:border-neutral-800 overflow-y-auto">
          <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Work Gallery</h3>
          <p className="text-[10px] font-bold text-neutral-400 uppercase mb-6 leading-tight">Pick one to show on your review</p>
          <div className="grid gap-4">
            {order.proof?.images?.map((img: string, i: number) => (
              <div 
                key={i} 
                onClick={() => setSelectedImage(selectedImage === img ? null : img)}
                className={`aspect-video rounded-[2rem] relative overflow-hidden cursor-pointer transition-all border-4 ${selectedImage === img ? "border-amber-500 scale-[1.02]" : "border-transparent opacity-60"}`}
              >
                <Image src={img} fill className="object-cover" alt="work proof" />
                {selectedImage === img && (
                  <div className="absolute top-4 right-4 bg-amber-500 text-white p-1 rounded-full"><CheckCircle2 size={16} /></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 p-8 overflow-y-auto space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Rate Service</h2>
              <p className="text-[10px] text-amber-500 font-bold uppercase mt-2">Final Step to Close Order</p>
            </div>
            <button onClick={onClose} className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl"><X size={20}/></button>
          </div>

          <div className="space-y-6">
            <StarInput label="Seller Communication" category="communication" />
            <StarInput label="Service as Described" category="described" />
            <StarInput label="Recommend to Others" category="recommend" />

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black uppercase text-neutral-400">Your Experience</label>
              <textarea 
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full h-32 p-6 rounded-[2rem] bg-neutral-50 dark:bg-neutral-800 outline-none text-sm focus:ring-2 ring-amber-500/20 resize-none"
                placeholder="What was it like working with this seller?"
              />
            </div>

            <IconButton 
              text={loading ? "Publishing..." : "Submit Review"}
              icon={loading ? null : <CheckCircle2 size={18}/>}
              loading={loading}
              onClick={handleSubmit}
              className="w-full py-6 rounded-full bg-neutral-900 dark:bg-white dark:text-black text-white uppercase font-black text-[10px] tracking-widest shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}