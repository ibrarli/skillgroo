"use client";

import { X, Star, MessageSquare, Award, TrendingUp } from "lucide-react";
import Image from "next/image";

interface ViewRatingModalProps {
  proposal: any;
  onClose: () => void;
}

export default function ViewRatingModal({ proposal, onClose }: ViewRatingModalProps) {
  const review = proposal?.review;

  const RatingRow = ({
    label,
    score,
    icon: Icon,
  }: {
    label: string;
    score: number;
    icon: any;
  }) => (
    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
          <Icon size={16} className="text-blue-500" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
          {label}
        </span>
      </div>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={
              star <= (score ?? 0)
                ? "text-amber-500"
                : "text-neutral-200 dark:text-neutral-700"
            }
            fill={star <= (score ?? 0) ? "currentColor" : "none"}
          />
        ))}
      </div>
    </div>
  );

  // If review doesn't exist, show safe fallback modal instead of returning null
  if (!review) {
    return (
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-[3rem] shadow-2xl border dark:border-neutral-800 p-10 text-center">
          <h2 className="text-xl font-black mb-4">No Review Found</h2>
          <p className="text-sm text-neutral-500 mb-6">
            This order does not have review data.
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 bg-neutral-900 dark:bg-white dark:text-black text-white rounded-full font-black text-[10px] uppercase tracking-widest"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const safeRating = review.rating ?? 0;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border dark:border-neutral-800">
        
        {/* HEADER */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">
              Order Review
            </h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase mt-2">
              Feedback from {proposal.customer?.name || "Customer"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl hover:scale-105 transition-transform"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          
          {/* TOTAL SCORE BOX */}
          <div className="flex items-center gap-6 p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
            <div className="text-5xl font-black">
              {safeRating.toFixed(1)}
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">
                Overall Score
              </div>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= Math.round(safeRating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* BREAKDOWN */}
          <div className="space-y-3">
            <RatingRow
              label="Communication"
              score={review.communication ?? 0}
              icon={MessageSquare}
            />
            <RatingRow
              label="Service Quality"
              score={review.serviceQuality ?? 0}
              icon={Award}
            />
            <RatingRow
              label="Value for Money"
              score={review.valueForMoney ?? 0}
              icon={TrendingUp}
            />
          </div>

          {/* COMMENT */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
              Comment
            </label>
            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-[2rem] border border-dashed border-neutral-200 dark:border-neutral-700">
              <p className="text-sm italic text-neutral-600 dark:text-neutral-300 leading-relaxed">
                "{review.comment || "No comment provided."}"
              </p>
            </div>
          </div>

          {/* SHOWCASE IMAGE */}
          {review.showcaseImage && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                Work Showcase
              </label>
              <div className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-white dark:border-neutral-800 shadow-lg">
                <Image
                  src={review.showcaseImage}
                  fill
                  className="object-cover"
                  alt="Review showcase"
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-8 pt-0">
          <button
            onClick={onClose}
            className="w-full py-5 bg-neutral-900 dark:bg-white dark:text-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Close Feedback
          </button>
        </div>
      </div>
    </div>
  );
}