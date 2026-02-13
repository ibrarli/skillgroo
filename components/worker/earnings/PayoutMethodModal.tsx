"use client";

import { useState, useMemo } from "react";
import { X, CreditCard, Banknote, Globe, Loader2, Zap, CheckCircle2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PayoutMethodModal({ isEdit }: { isEdit: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [provider, setProvider] = useState<"BANK" | "PAYPAL" | "STRIPE" | "WISE">("BANK");
  const [details, setDetails] = useState("");
  const router = useRouter();

  const isValid = useMemo(() => {
    if (!details) return false;
    switch (provider) {
      case "BANK":
        const bsbAccountRegex = /^\d{3}-?\d{3}\s?\d{6,9}$/;
        return bsbAccountRegex.test(details);
      case "PAYPAL":
      case "WISE":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details);
      case "STRIPE":
        return details.startsWith("acct_") && details.length > 10;
      default:
        return false;
    }
  }, [provider, details]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/payout-method", {
        method: "POST",
        body: JSON.stringify({ type: provider, details }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to save", error);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW DELETE LOGIC ---
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove this payout method?")) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch("/api/payout-method", {
        method: "DELETE",
      });
      if (res.ok) {
        setDetails("");
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-foreground/5 border border-foreground/10 text-foreground hover:bg-foreground/10"
      >
        {isEdit ? "Edit Payout Method" : "Add Payout Method"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md" 
            onClick={() => !loading && !isDeleting && setIsOpen(false)} 
          />
          <div className="relative bg-background border border-foreground/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Payout Method</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Verification Required</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-foreground/5 rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Select Provider</label>
                <div className="grid grid-cols-2 gap-3">
                  {["BANK", "STRIPE", "PAYPAL", "WISE"].map((p) => (
                    <button 
                      key={p}
                      type="button" 
                      onClick={() => { setProvider(p as any); setDetails(""); }}
                      className={`flex items-center gap-3 p-4 border-2 rounded-2xl transition-all ${provider === p ? "border-primary bg-primary/5" : "border-foreground/10 opacity-60"}`}
                    >
                       {p === "BANK" && <Banknote size={16} />}
                       {p === "STRIPE" && <Zap size={16} />}
                       {p === "PAYPAL" && <CreditCard size={16} />}
                       {p === "WISE" && <Globe size={16} />}
                       <span className="text-[10px] font-black uppercase">{p === "BANK" ? "AU Bank" : p}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Account Details</label>
                  {isValid && <span className="flex items-center gap-1 text-[8px] text-emerald-500 font-black uppercase"><CheckCircle2 size={10}/> Valid Format</span>}
                </div>
                <div className="relative">
                   <input 
                    type="text" 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder={
                      provider === "BANK" ? "BSB-Account (e.g. 062-000 12345678)" : 
                      provider === "STRIPE" ? "acct_xxxxxxxxxxxx" : 
                      "Enter account email address"
                    }
                    className={`w-full bg-foreground/[0.03] border rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-all ${isValid ? "border-emerald-500/50 focus:border-emerald-500" : "border-foreground/10 focus:border-primary"}`}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  type="submit"
                  disabled={loading || isDeleting || !isValid}
                  className="w-full py-5 bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : "Confirm & Save"}
                </button>

                {/* --- REMOVE BUTTON (Only shown when editing) --- */}
                {isEdit && (
                  <button 
                    type="button"
                    onClick={handleDelete}
                    disabled={loading || isDeleting}
                    className="w-full py-4 border border-red-500/20 text-red-500 hover:bg-red-500/5 font-black uppercase text-[10px] tracking-[0.2em] rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <><Trash2 size={14} /> Remove Method</>}
                  </button>
                )}

                {!isValid && details && !isDeleting && (
                   <p className="text-center text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-4">Please enter a valid {provider} format to continue</p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}