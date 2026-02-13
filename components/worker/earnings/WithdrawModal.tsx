"use client";

import { useState } from "react";
import { X, Banknote, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface WithdrawModalProps {
  balance: number;
  disabled?: boolean; // New prop included
}

export default function WithdrawModal({ balance, disabled = false }: WithdrawModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return; // Guard clause
    
    setLoading(true);
    setError("");

    const withdrawalAmount = parseFloat(amount);

    if (withdrawalAmount > balance) {
      setError("Insufficient balance");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        body: JSON.stringify({ amount: withdrawalAmount }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          setAmount("");
          window.location.reload(); 
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to process withdrawal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all
          ${disabled 
            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed opacity-70" 
            : "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95"
          }`}
      >
        <Banknote size={20} />
        Withdraw Funds
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-neutral-950/60 backdrop-blur-md" 
            onClick={() => !loading && setIsOpen(false)} 
          />

          <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
            {success ? (
              <div className="py-10 text-center space-y-4">
                <div className="flex justify-center">
                  <CheckCircle2 size={60} className="text-emerald-500 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black dark:text-white">Request Sent!</h3>
                <p className="text-neutral-500 font-medium">Your funds are being processed.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black dark:text-white">Withdrawal</h3>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
                  >
                    <X size={20} className="text-neutral-500" />
                  </button>
                </div>

                <form onSubmit={handleWithdraw} className="space-y-6">
                  {/* Warning for disabled state (extra safety) */}
                  {disabled && (
                    <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-500">
                      <AlertCircle size={18} />
                      <p className="text-[10px] font-black uppercase tracking-tight">Add a payout method first</p>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-black text-neutral-400 uppercase tracking-widest">Amount to Withdraw</label>
                      <span className="text-xs font-bold text-primary">Available: ${balance.toFixed(2)}</span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-xl text-neutral-400">$</span>
                      <input
                        type="number"
                        required
                        disabled={disabled}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 p-4 pl-10 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-black text-xl disabled:opacity-50"
                      />
                    </div>
                    {error && <p className="text-red-500 text-xs font-bold mt-2">{error}</p>}
                  </div>

                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-[10px] text-primary font-bold uppercase mb-1">Notice</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      Withdrawals take 3-5 business days to reflect in your bank account.
                    </p>
                  </div>

                  <button
                    disabled={loading || disabled || !amount || parseFloat(amount) <= 0}
                    className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:bg-neutral-400 disabled:shadow-none disabled:scale-100 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : "Confirm Payout"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}