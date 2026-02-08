"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, RotateCcw, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";

export default function ReviewDeliveryModal({ orderId, onClose }: { orderId: string, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState<any>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
  fetch(`/api/orders/${orderId}/complete`) 
    .then(res => res.json())
    .then(data => {
      setProof(data);
      setFetching(false);
    });
}, [orderId]);

  const handleAction = async (action: "ACCEPT" | "REJECT") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (response.ok) window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 flex justify-between items-center border-b dark:border-neutral-800">
          <h2 className="text-2xl font-black uppercase tracking-tighter">Review Work</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"><X /></button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {fetching ? <Loader2 className="animate-spin mx-auto" /> : (
            <>
              {/* Image Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {proof?.images?.map((img: string, i: number) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden border dark:border-neutral-800">
                    <Image src={img} alt="Proof" fill className="object-cover" />
                  </div>
                ))}
              </div>

              {/* Description & Link */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-neutral-400">Description</label>
                  <p className="text-sm dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl">
                    {proof?.description || "No description provided."}
                  </p>
                </div>
                {proof?.externalLink && (
                  <a href={proof.externalLink} target="_blank" className="flex items-center gap-2 text-blue-500 font-bold text-xs">
                    <ExternalLink size={14} /> View Work Link
                  </a>
                )}
              </div>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="p-8 bg-neutral-50 dark:bg-neutral-800/50 flex gap-4">
          <button 
            onClick={() => handleAction("REJECT")}
            disabled={loading}
            className="flex-1 py-4 border-2 border-red-500/20 text-red-500 rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-red-500/5"
          >
            <RotateCcw size={16} /> Request Changes
          </button>
          <button 
            onClick={() => handleAction("ACCEPT")}
            disabled={loading}
            className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg shadow-green-500/20"
          >
            <CheckCircle size={16} /> Approve & Pay
          </button>
        </div>
      </div>
    </div>
  );
}