import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link"; // Added Link
import { ChevronLeft } from "lucide-react"; // Added Icon

// Import your Public Components
import PublicHeader from "@/components/userprofile/PublicHeader";
import PublicPortfolio from "@/components/userprofile/PublicPortfolio";
import PublicSkills from "@/components/userprofile/PublicSkills";
import PublicTimeline from "@/components/userprofile/PublicTimeline";
import PublicGigs from "@/components/userprofile/PublicGigs";
import Header from "@/components/global/Header";

interface Props {
  params: Promise<{ username: string }>;
}

/**
 * GENERATE METADATA
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { name: true, profile: { select: { about: true } } }
  });
  if (!user) return { title: "User Not Found | Skillgroo" };
  return {
    title: `${user.name} (@${username}) | Skillgroo Profile`,
    description: user.profile?.about || `View ${user.name}'s professional portfolio on Skillgroo.`,
  };
}

/**
 * PUBLIC PROFILE PAGE
 */
export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: {
        include: {
          portfolio: { orderBy: { createdAt: "desc" } },
          experiences: { orderBy: { startDate: "desc" } },
          educations: { orderBy: { startDate: "desc" } },
          skills: { orderBy: { name: "asc" } },
          gigs: {
            where: { status: "active" },
            orderBy: { createdAt: "desc" },
            include: {
              profile: {
                include: {
                  user: true 
                }
              }
            }
          },
        },
      },
    },
  });

  if (!user || !user.profile) notFound();

  const { profile } = user;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 relative">
      <Header />
      <div className="absolute top-0 left-0 right-0  -z-10" />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 space-y-16">
        
        {/* MARKETPLACE CTA */}
        <Link 
          href="/" 
          className="group flex items-center gap-2  text-neutral-400 hover:text-primary"
        >
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 group-hover:bg-primary/10 transition-colors">
            <ChevronLeft size={16} />
          </div>
          <span className="text-sm font-black ">
            Back to Marketplace
          </span>
        </Link>

        {/* 1. Header Section */}
        <PublicHeader user={user} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* 2. Left Sidebar */}
          <aside className="lg:col-span-4 space-y-12">
            <section className="space-y-4">
              <h3 className="text-lg font-black text-neutral-400">About Me</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium text-sm">
                {profile.about || "This pro prefers to let their work speak for itself."}
              </p>
            </section>
            <PublicSkills skills={profile.skills} />
            <div className="space-y-12 pt-8 border-t border-neutral-100 dark:border-neutral-800">
              <PublicTimeline experiences={profile.experiences} educations={profile.educations} />
            </div>
          </aside>

          {/* 3. Right Content */}
          <div className="lg:col-span-8 space-y-20">
            <PublicGigs gigs={profile.gigs} />
          </div>
        </div>

        <PublicPortfolio items={profile.portfolio as any} />
      </main>
    </div>
  );
}