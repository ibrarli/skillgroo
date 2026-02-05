import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Import your Public Components
import PublicHeader from "@/components/public-profile/PublicHeader";
import PublicPortfolio from "@/components/public-profile/PublicPortfolio";
import PublicSkills from "@/components/public-profile/PublicSkills";
import PublicTimeline from "@/components/public-profile/PublicTimeline";
import PublicGigs from "@/components/public-profile/PublicGigs";

interface Props {
  params: Promise<{ username: string }>;
}

/**
 * GENERATE METADATA
 * Handles SEO for the public profile
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { 
      name: true, 
      profile: { 
        select: { about: true } 
      } 
    }
  });

  if (!user) return { title: "User Not Found | Skillgroo" };

  return {
    title: `${user.name} (@${username}) | Skillgroo Profile`,
    description: user.profile?.about || `View ${user.name}'s professional portfolio on Skillgroo.`,
  };
}

/**
 * PUBLIC PROFILE PAGE
 * The main server component
 */
export default async function PublicProfilePage({ params }: Props) {
  // Fix: Await params for Next.js 15 compatibility
  const { username } = await params;

  // Fetch all data in a single optimized query
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: {
        include: {
          portfolio: { orderBy: { createdAt: "desc" } },
          experience: { orderBy: { startDate: "desc" } },
          education: { orderBy: { startDate: "desc" } },
          skills: true,
        },
      },
      gigs: {
        where: { status: "active" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // If user or profile doesn't exist, trigger 404
  if (!user || !user.profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 relative">
      {/* Background Gradient Decoration */}
      <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-b from-primary/5 via-transparent to-transparent -z-10" />

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16">
        
        {/* 1. Header Section */}
        <PublicHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* 2. Left Sidebar (Bio, Skills, Timeline) */}
          <aside className="lg:col-span-4 space-y-12">
            
            {/* Bio Section */}
            <section className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                Professional Bio
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium text-sm">
                {user.profile.about || "This pro prefers to let their work speak for itself."}
              </p>
            </section>

            {/* Public Skills Component */}
            <PublicSkills skills={user.profile.skills} />

            {/* Timelines: Experience & Education */}
            <div className="space-y-12 pt-8 border-t border-neutral-100 dark:border-neutral-800">
              <PublicTimeline items={user.profile.experience as any} type="experience" />
              <PublicTimeline items={user.profile.education as any} type="education" />
            </div>
          </aside>

          {/* 3. Right Content (Portfolio & Gigs) */}
          <div className="lg:col-span-8 space-y-20">
            
            {/* Public Portfolio Grid */}
            <PublicPortfolio items={user.profile.portfolio as any} />

            {/* Public Gigs/Services List */}
            <PublicGigs gigs={user.gigs as any} />

          </div>
        </div>
      </main>

      {/* Footer Contact CTA */}
      <footer className="border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/30 py-16 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-neutral-500 font-bold text-sm mb-6 uppercase tracking-widest">
            Ready to start a project?
          </p>
          <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl">
            Contact {user.name?.split(' ')[0]}
          </button>
        </div>
      </footer>
    </div>
  );
}