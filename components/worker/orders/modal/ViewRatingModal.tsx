"use client";

import { useState, useEffect } from "react";
import { X, Star, MessageSquare, Award, TrendingUp, Loader2 } from "lucide-react";
import Image from "next/image";

interface ViewRatingModalProps {
  proposal: any;
  onClose: () => void;
}

export default function ViewRatingModal({ proposal, onClose }: ViewRatingModalProps) {
  const [review, setReview] = useState<any>(proposal?.review || null);
  const [loading, setLoading] = useState(!proposal?.review);

  // Fallback: If review wasn't included in the proposal object, fetch it
  useEffect(() => {
    if (!review && proposal?.id) {
      setLoading(true);
      fetch(`/api/orders/${proposal.id}/rating`) // Re-using the rate GET or similar
        .then(res => res.json())
        .then(data => setReview(data))
        .catch(err => console.error("Error fetching review:", err))
        .finally(() => setLoading(false));
    }
  }, [proposal.id, review]);

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

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border dark:border-neutral-800">
        
        {/* HEADER */}
        <div className="p-8 pb-0 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none dark:text-white">
              Order Review
            </h2>
            <p className="text-[10px] text-blue-500 font-bold uppercase mt-2">
              Feedback from {proposal.customer?.name || "Customer"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl hover:scale-105 transition-transform dark:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4 text-neutral-500">
              <Loader2 className="animate-spin" size={40} />
              <span className="text-[10px] font-black uppercase tracking-widest">Loading Review...</span>
            </div>
          ) : !review ? (
            <div className="py-10 text-center space-y-4">
              <p className="text-sm text-neutral-500">
                This order hasn't been reviewed by the customer yet.
              </p>
            </div>
          ) : (
            <>
              {/* TOTAL SCORE BOX */}
              <div className="flex items-center gap-6 p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
                <div className="text-5xl font-black">
                  {(review.rating ?? 0).toFixed(1)}
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
                        fill={s <= Math.round(review.rating ?? 0) ? "currentColor" : "none"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}