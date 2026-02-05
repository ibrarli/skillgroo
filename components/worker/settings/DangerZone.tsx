"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!password) return toast.error("Please enter your password to confirm");
    
    setLoading(true);
    try {
      const res = await fetch("/api/user/delete", {
        method: "POST", // Changed to POST to send password body securely
        body: JSON.stringify({ password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account wiped. Goodbye!");
        signOut({ callbackUrl: "/" });
      } else {
        toast.error(data.error || "Verification failed");
      }
    } catch (err) {
      toast.error("An error occurred during deletion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 p-8 rounded-[2.5rem] space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-red-600">Delete Account Permanently</h3>
          <p className="text-sm text-red-500/70 font-medium leading-relaxed">
            This action is irreversible. It will wipe your profile, gigs, orders, earnings, and all history from Skillgroo.
          </p>
        </div>
      </div>

      {!confirming ? (
        <button 
          onClick={() => setConfirming(true)}
          className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-500/20"
        >
          Begin Deletion Process
        </button>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-red-500 uppercase ml-2 tracking-widest">
              Confirm Identity with Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border-2 border-red-100 dark:border-red-900/30 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              disabled={loading}
              onClick={handleDelete} 
              className="flex-1 px-6 py-4 bg-red-600 text-white rounded-2xl font-black text-sm hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Permanently Wipe Everything"}
            </button>
            <button 
              disabled={loading}
              onClick={() => { setConfirming(false); setPassword(""); }} 
              className="px-6 py-4 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-2xl font-black text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}