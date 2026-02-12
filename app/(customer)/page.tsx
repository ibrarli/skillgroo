import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import Header from "@/components/global/Header";
import AuthModal from "@/components/AuthModal";
import PublicGigSection from "@/components/customer/PublicGigSection";
import { Sparkles, Hammer, Palette, ArrowRight, ShieldCheck } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const allGigs = await prisma.gig.findMany({
    where: { status: "active" },
    include: {
      profile: {
        include: { 
          user: true,
          reviews: true
        },
      },
    },
  });

  const recommendedGigs = [...allGigs].sort((a, b) => {
    const getScore = (gig: any) => {
      const reviews = gig.profile?.reviews || [];
      const avgRating = reviews.length 
        ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
        : 0;
      return (avgRating * 0.7) + (reviews.length * 0.3);
    };
    return getScore(b) - getScore(a);
  });

  return (
    /* Changed bg-white to bg-background */
    <div className="min-h-screen bg-background selection:bg-primary selection:text-white transition-colors duration-300">
      <Header />

      <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000 pt-20">

        {/* --- HERO SECTION --- */}
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            {session ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-4">
                  <ShieldCheck size={14} />
                  Elite Marketplace Access
                </div>
                {/* Changed text-neutral-900 to text-foreground */}
                <h1 className="text-6xl md:text-[7rem] font-black tracking-tighter leading-[0.9] text-foreground">
                  Find your next <br />
                  <span className="text-primary italic">masterpiece.</span>
                </h1>
                <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-[11px] mt-4">
                  Welcome back, {session.user?.name?.split(" ")[0]} • {allGigs.length} experts online
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* Changed bg-neutral-100 to bg-foreground/5 and border-neutral-200 to border-foreground/10 */}
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-foreground/5 rounded-full border border-foreground/10 text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Vetted Professionals Only
                </div>
                
                {/* Changed text-neutral-900 to text-foreground */}
                <h1 className="text-7xl md:text-[11rem] font-black tracking-tighter leading-[0.8] text-foreground">
                  The craft <br />
                  <span className="text-primary italic text-[0.9em]">reimagined.</span>
                </h1>
                
                <p className="max-w-2xl mx-auto text-neutral-500 text-xl font-medium leading-relaxed">
                  Skillgroo connects you with the world’s most skilled craftspeople. 
                </p>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <AuthModal />
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      /* Updated border to use background variable */
                      <div key={i} className="w-10 h-10 rounded-full border-4 border-background bg-foreground/10" />
                    ))}
                    <div className="w-10 h-10 rounded-full border-4 border-background bg-primary flex items-center justify-center text-[10px] font-black text-white">
                      +2k
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- DYNAMIC SECTIONS --- */}
        <div className="pb-32 space-y-32">

          {/* RECOMMENDED */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Top Rated</span>
                </div>
                <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">Recommended</h2>
              </div>
              <button className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-all">
                Browse Full Catalog <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <PublicGigSection gigs={recommendedGigs.slice(0, 8)} />
          </section>

          {/* PLUMBING */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-blue-500">
                  <Hammer size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Maintenance</span>
                </div>
                <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">Master Plumbers</h2>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-blue-500 transition-colors">
                View Category →
              </button>
            </div>
            <PublicGigSection 
              gigs={allGigs.filter(g => g.category === "Plumbing")} 
              category="Plumbing" 
            />
          </section>

          {/* DESIGN */}
          <section className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-purple-500">
                  <Palette size={18} />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">Visual Arts</span>
                </div>
                <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">Creative Directors</h2>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-purple-500 transition-colors">
                View Category →
              </button>
            </div>
            <PublicGigSection 
              gigs={allGigs.filter(g => g.category === "Design")} 
              category="Design" 
            />
          </section>

        </div>
      </main>
    </div>
  );
}