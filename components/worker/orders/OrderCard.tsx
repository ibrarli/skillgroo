"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, X, Clock, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderCard({ order, type }: { order: any; type: "buying" | "selling" }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) router.refresh();
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 transition-all hover:border-primary/30">
      {/* Gig Image */}
      <div className="relative w-24 h-24 rounded-3xl overflow-hidden bg-neutral-100 shrink-0 shadow-inner">
        <Image src={order.gig.image || "/placeholder.jpg"} alt="" fill className="object-cover" />
      </div>

      {/* Info Container */}
      <div className="flex-1 space-y-2 text-center md:text-left">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
            order.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
            order.status === "cancelled" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
          }`}>
            {order.status}
          </span>
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Ref: {order.id.slice(-8)}</span>
        </div>
        
        <h3 className="text-lg font-black dark:text-white group-hover:text-primary transition-colors">
          {order.gig.title}
        </h3>
        
        <p className="text-xs font-bold text-neutral-500 italic">
          {type === "selling" ? `Buyer: ${order.customer.name}` : `Provider: ${order.provider.name}`}
        </p>
      </div>

      {/* Price and Actions */}
      <div className="flex items-center gap-6 pr-4">
        <div className="text-right">
          <p className="text-[10px] font-black text-neutral-400 uppercase">Total</p>
          <p className="text-2xl font-black text-neutral-900 dark:text-white">${order.totalPrice}</p>
        </div>

        {type === "selling" && order.status === "pending" && (
          <div className="flex gap-2">
            <button
              disabled={loading}
              onClick={() => handleStatusUpdate("completed")}
              className="p-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Check size={20} />
            </button>
            <button
              disabled={loading}
              onClick={() => handleStatusUpdate("cancelled")}
              className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-red-500 rounded-2xl transition-all"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}