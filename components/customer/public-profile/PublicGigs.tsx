import { ArrowUpRight, Briefcase } from "lucide-react";

export default function PublicGigs({ gigs }: { gigs: any[] }) {
  if (!gigs?.length) return null;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-black tracking-tight italic">Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gigs.map((gig) => (
          <div 
            key={gig.id} 
            className="p-6 bg-primary/5 border border-primary/10 rounded-[2rem] hover:bg-primary/10 transition-colors group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm">
                <Briefcase size={20} className="text-primary" />
              </div>
              <ArrowUpRight size={20} className="text-neutral-300 group-hover:text-primary transition-colors" />
            </div>
            <h4 className="font-black text-lg mb-1">{gig.title}</h4>
            <p className="text-sm text-neutral-500 font-medium mb-4 line-clamp-2">
              {gig.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Starting from</span>
              <span className="text-xl font-black text-primary">${gig.price}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}