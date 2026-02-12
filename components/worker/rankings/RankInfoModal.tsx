export default function RankInfoModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const ranks = [
    { name: "Rookie", requirement: "Sign up & first gig", benefit: "Standard 10% Fee" },
    { name: "Pro", requirement: "$1,000 Earned", benefit: "Priority Support" },
    { name: "Elite", requirement: "$5,000 Earned", benefit: "Reduced 8% Fee" },
    { name: "Legend", requirement: "$20,000 Earned", benefit: "Custom Badge & 0% Instant Payouts" },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-background border border-foreground/10 w-full max-w-xl rounded-[3rem] p-10 shadow-2xl">
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Ranking System</h2>
        
        <div className="space-y-4">
          {ranks.map((r) => (
            <div key={r.name} className="flex items-center justify-between p-5 bg-foreground/[0.02] rounded-3xl border border-foreground/5">
              <div>
                <p className="font-black uppercase text-xs tracking-widest text-primary">{r.name}</p>
                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">{r.requirement}</p>
              </div>
              <p className="text-xs font-black text-foreground">{r.benefit}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 py-4 bg-foreground text-background font-black uppercase text-[10px] tracking-widest rounded-full"
        >
          Got it
        </button>
      </div>
    </div>
  );
}