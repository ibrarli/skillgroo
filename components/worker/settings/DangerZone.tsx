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
        method: "POST",
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
    /* Changed bg-red-50/50 to bg-red-500/[0.03] for a more dynamic light/dark transparency */
    <div className="bg-red-500/[0.03] border border-red-500/10 p-8 rounded-[2.5rem] space-y-6 transition-colors">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h3 className="text-lg font-black text-red-500">Delete Account Permanently</h3>
          <p className="text-sm text-red-500/60 font-medium leading-relaxed">
            This action is irreversible. It will wipe your profile, gigs, orders, earnings, and all history from Skillgroo.
          </p>
        </div>
      </div>

      {!confirming ? (
        <button 
          onClick={() => setConfirming(true)}
          className="px-8 py-4 bg-red-500 text-white rounded-2xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-red-500/20"
        >
          Begin Deletion Process
        </button>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-red-500 uppercase ml-2 tracking-widest">
              Confirm Identity with Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              /* Updated input to use background variables and red borders */
              className="w-full bg-background border-2 border-red-500/20 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-red-500 font-bold text-sm text-foreground placeholder:text-red-500/30"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              disabled={loading}
              onClick={handleDelete} 
              className="flex-1 px-6 py-4 bg-red-500 text-white rounded-2xl font-black text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Permanently Wipe Everything"}
            </button>
            <button 
              disabled={loading}
              onClick={() => { setConfirming(false); setPassword(""); }} 
              /* Replaced neutral-200 with foreground/10 for adaptive cancel button */
              className="px-6 py-4 bg-foreground/10 text-foreground rounded-2xl font-black text-sm hover:bg-foreground/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}