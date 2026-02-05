
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast"; // Recommended for feedback

export default function OrderButton({ gigId, providerId, price, isOwner, isLoggedIn }: any) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePurchase = async () => {
    if (!isLoggedIn) return router.push("/api/auth/signin");
    
    setLoading(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        body: JSON.stringify({ gigId, providerId, totalPrice: price }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        toast.success("Order placed successfully!");
        router.push("/orders");
      } else {
        toast.error("Failed to place order.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (isOwner) {
    return (
      <button 
        disabled 
        className="w-full bg-neutral-200 dark:bg-neutral-800 text-neutral-400 py-5 rounded-2xl font-black text-lg cursor-not-allowed opacity-60"
      >
        You own this gig
      </button>
    );
  }

  return (
    <button
      disabled={loading}
      onClick={handlePurchase}
      className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
    >
      {loading ? <Loader2 className="animate-spin" /> : (
        <>
          <ShoppingCart size={20} />
          Secure This Gig
        </>
      )}
    </button>
  );
}