"use client";

import { useState } from "react";
import { X, CreditCard, Banknote } from "lucide-react";

export default function PayoutMethodModal({ isEdit }: { isEdit: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all bg-foreground/5 border border-foreground/10 text-foreground hover:bg-foreground/10"
      >
        {isEdit ? "Edit Payout Method" : "Add Payout Method"}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="relative bg-background border border-foreground/10 w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter">Payout Method</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Where we send your funds</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Preferred Provider</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" className="flex items-center justify-center gap-2 p-4 border-2 border-primary bg-primary/5 rounded-2xl">
                     <Banknote size={16} className="text-primary" />
                     <span className="text-[10px] font-black uppercase">Bank</span>
                  </button>
                  <button type="button" className="flex items-center justify-center gap-2 p-4 border border-foreground/10 hover:border-foreground/20 rounded-2xl">
                     <CreditCard size={16} className="text-neutral-500" />
                     <span className="text-[10px] font-black uppercase">PayPal</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-2">Account Identification</label>
                <input 
                  type="text" 
                  placeholder="IBAN or Email Address"
                  className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-5 bg-foreground text-background font-black uppercase text-[10px] tracking-[0.2em] rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Confirm & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}