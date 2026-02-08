import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import Header from "@/components/global/Header";
import AuthModal from "@/components/AuthModal";
import PublicGigSection from "@/components/customer/PublicGigSection";
import { Search, Sparkles, Hammer, Palette } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Fetch all gigs with profile and reviews
  const gigs = await prisma.gig.findMany({
    include: {
      profile: {
        include: { 
          user: true,
          reviews: true
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />

      <main className="animate-in fade-in duration-700 pt-20">

        {/* Hero Section */}
        <section className="relative py-24 px-6 border-b border-neutral-100 dark:border-neutral-900/50">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
            {session ? (
              <div className="space-y-4">
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none text-neutral-900 dark:text-white">
                  What do you need <span className="text-primary italic">done</span>?
                </h1>
                <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                  Welcome back, {session.user?.name?.split(" ")[0]} • Discover local experts
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="inline-block px-5 py-2 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  Local Talent at Your Fingertips
                </div>
                <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.8] text-neutral-900 dark:text-white">
                  Expert help, <br />
                  <span className="text-primary italic">just a click.</span>
                </h1>
                <p className="max-w-xl mx-auto text-neutral-400 text-lg font-medium">
                  Skillgroo is the elite marketplace to find and hire trusted local professionals.
                </p>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-3 pl-8 rounded-[2.5rem] border border-neutral-200 dark:border-white/5 shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Ready to start?</p>
                    <AuthModal />
                  </div>
                </div>
              </div>
            )}

            {/* Premium Search Bar */}
            <div className="w-full max-w-3xl relative mt-12 group">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-20 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-neutral-400" size={24} />
              <input 
                type="text" 
                placeholder="Search for 'Plumbing', 'Web Design'..."
                className="w-full h-24 pl-20 pr-10 rounded-[2.5rem] bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl focus:border-primary outline-none transition-all text-neutral-700 dark:text-white font-bold text-xl relative z-10"
              />
              <button className="absolute right-5 top-1/2 -translate-y-1/2 px-8 py-4 bg-neutral-900 dark:bg-white dark:text-black text-white rounded-3xl font-black text-xs uppercase tracking-widest z-20 hover:scale-105 active:scale-95 transition-all shadow-xl">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Carousel Sections */}
        <div className="py-20 space-y-24 bg-neutral-50/30 dark:bg-neutral-950/20 overflow-hidden">

          {/* Section 1: Recommended */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Curated for you</span>
                </div>
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tighter">Recommended</h2>
              </div>
              <button className="pb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
                Explore All →
              </button>
            </div>
            {/* Uneditable cards */}
            <PublicGigSection gigs={gigs.map(g => ({ ...g, editable: false }))} />
          </div>

          {/* Section 2: Plumbing */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-blue-500">
                  <Hammer size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Maintenance</span>
                </div>
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tighter">Plumbing Experts</h2>
              </div>
              <button className="pb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
                View Category →
              </button>
            </div>
            <PublicGigSection 
              gigs={gigs
                .filter(g => g.category === "Plumbing")
                .map(g => ({ ...g, editable: false }))
              } 
              category="Plumbing" 
            />
          </div>

          {/* Section 3: Design */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-purple-500">
                  <Palette size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Creative</span>
                </div>
                <h2 className="text-4xl font-black text-neutral-900 dark:text-white tracking-tighter">Design & Creative</h2>
              </div>
              <button className="pb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary">
                View Category →
              </button>
            </div>
            <PublicGigSection 
              gigs={gigs
                .filter(g => g.category === "Design")
                .map(g => ({ ...g, editable: false }))
              } 
              category="Design" 
            />
          </div>

        </div>
      </main>
    </div>
  );
}