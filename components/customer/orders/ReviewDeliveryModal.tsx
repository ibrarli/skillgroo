"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, RotateCcw, Loader2, ExternalLink, AlertCircle, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ReviewDeliveryModalProps {
  orderId: string;
  onClose: () => void;
}

export default function ReviewDeliveryModal({ orderId, onClose }: ReviewDeliveryModalProps) {
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch the Work Proof (Images & Description)
  useEffect(() => {
    const fetchProof = async () => {
      try {
        setFetching(true);
        setError("");
        
        // This calls the GET handler in api/orders/[id]/complete/route.ts
        const res = await fetch(`/api/orders/${orderId}/complete`);
        
        if (!res.ok) {
          throw new Error("Work proof not found. The worker may not have submitted yet.");
        }
        
        const data = await res.json();
        setProof(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    if (orderId) fetchProof();
  }, [orderId]);

  // 2. Handle Approve (Accept) or Request Changes (Reject)
  const handleAction = async (action: "ACCEPT" | "REJECT") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      
      if (!response.ok) throw new Error("Failed to process your request.");
      
      // Refresh to update the tabs (moves from Active to Completed)
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border dark:border-neutral-800 flex flex-col max-h-[90vh]">
        
        {/* HEADER */}
        <div className="p-8 flex justify-between items-center border-b dark:border-neutral-800">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white">Review Delivery</h2>
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Inspect the work before final approval</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all hover:rotate-90"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          {fetching ? (
            <div className="py-20 flex flex-col items-center gap-4 text-neutral-500">
              <Loader2 className="animate-spin" size={40} />
              <span className="text-[10px] font-black uppercase tracking-widest">Fetching Work Proof...</span>
            </div>
          ) : error ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} />
              </div>
              <p className="text-sm font-bold text-neutral-500 max-w-xs mx-auto">{error}</p>
            </div>
          ) : (
            <>
              {/* Image Gallery */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest flex items-center gap-2">
                  <ImageIcon size={12} /> Submitted Assets
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proof?.images?.map((img: string, i: number) => (
                    <div key={i} className="relative aspect-video rounded-[2rem] overflow-hidden border-4 border-neutral-100 dark:border-neutral-800 group">
                      <Image 
                        src={img} 
                        alt={`Proof ${i + 1}`} 
                        fill 
                        className="object-cover transition-transform group-hover:scale-110" 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Worker's Message</label>
                <div className="text-sm font-medium dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 leading-relaxed">
                  {proof?.description || "No specific details provided."}
                </div>
              </div>

              {/* External Link */}
              {proof?.externalLink && (
                <div className="pt-2">
                  <a 
                    href={proof.externalLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-500/5 px-6 py-3 rounded-full border border-blue-500/10 transition-all hover:bg-blue-500/10"
                  >
                    <ExternalLink size={14} /> View External Work Link
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        {!fetching && !error && (
          <div className="p-8 bg-neutral-50 dark:bg-neutral-800/30 border-t dark:border-neutral-800 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => handleAction("REJECT")}
              disabled={loading}
              className="flex-1 py-5 border-2 border-red-500/20 text-red-500 rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
            >
              <RotateCcw size={16} /> Request Changes
            </button>
            <button 
              onClick={() => handleAction("ACCEPT")}
              disabled={loading}
              className="flex-1 py-5 bg-green-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-green-500/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><CheckCircle size={16} /> Approve & Complete</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}