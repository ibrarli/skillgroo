import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

import Header from "@/components/global/Header";
import AuthModal from "@/components/AuthModal"; // Unified Auth
import PublicGigSection from "@/components/customer/PublicGigSection";
import { Search } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  const gigs = await prisma.gig.findMany({
    include: {
      profile: {
        include: { user: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      
      <main className="animate-in fade-in duration-700 pt-20">
        {/* Hero / Search Section */}
        <section className="relative py-20 px-6 border-b border-neutral-100 dark:border-neutral-900/50">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-10">
            
            {session ? (
              <div className="space-y-4">
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">
                  What do you need <span className="text-primary italic">done</span>?
                </h1>
                <p className="text-neutral-500 text-lg max-w-2xl mx-auto font-bold uppercase tracking-widest text-[10px]">
                  Welcome back, {session.user?.name?.split(" ")[0]} • Browse top-rated craft
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                  Local Talent at Your Fingertips
                </div>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] text-neutral-900 dark:text-white">
                  Expert help, <br />
                  <span className="text-primary italic">just a click away.</span>
                </h1>
                <p className="max-w-xl mx-auto text-neutral-500 dark:text-neutral-400 text-lg font-medium">
                  Skillgroo is the elite marketplace to find and hire trusted local professionals.
                </p>
                
                {/* Unified Auth Access */}
                <div className="flex items-center justify-center gap-4 pt-6">
                  <div className="flex items-center gap-4 bg-neutral-50 dark:bg-neutral-900/50 p-3 pl-6 rounded-3xl border border-neutral-200 dark:border-white/5 shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Join or Sign In</p>
                    <AuthModal />
                  </div>
                </div>
              </div>
            )}

            {/* Premium Search Bar */}
            <div className="w-full max-w-3xl relative mt-12 group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" size={24} />
              <input 
                type="text" 
                placeholder="Search for 'Plumbing', 'Web Design', 'Gardening'..."
                className="w-full h-20 pl-16 pr-8 rounded-[2rem] bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-neutral-800 shadow-2xl focus:border-primary outline-none transition-all text-neutral-700 dark:text-white font-bold text-lg relative z-10"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-3 bg-neutral-900 dark:bg-white dark:text-black text-white rounded-2xl font-black text-xs uppercase tracking-widest z-20 hover:scale-105 transition-all">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Gig Marketplace */}
        <div className="py-20 bg-neutral-50/50 dark:bg-neutral-950/30">
          <div className="max-w-7xl mx-auto px-6 mb-12 flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter">Recommended for you</h2>
              <div className="h-1 w-12 bg-primary rounded-full" />
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-primary transition-colors">
              View All Gigs →
            </button>
          </div>
          <PublicGigSection gigs={gigs} />
        </div>
      </main>
    </div>
  );
}