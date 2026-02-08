import { Metadata } from "next"; // Added for type safety
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Types
import { FullProfile } from "@/components/worker/profile/ProfileHeader";

// Unified Auth
import AuthModal from "@/components/AuthModal";

// Worker Profile Components
import ProfileHeader from "@/components/worker/profile/ProfileHeader";
import ExperienceSection from "@/components/worker/profile/ExperienceSection";
import EducationSection from "@/components/worker/profile/EducationSection";
import SkillSection from "@/components/worker/profile/SkillSection";
import PortfolioSection from "@/components/worker/profile/PortfolioSection";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";

// Client Component for Interactivity
import ProfileActions from "@/components/worker/ProfileActions";

// Metadata Export
export const metadata: Metadata = {
  title: "Worker Dashboard | Skillgroo",
  description: "Manage your professional trade profile, portfolio, and skills on Skillgroo.",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  let profile: FullProfile | null = null;

  if (session) {
    // 1. Fetch full profile with relations
    const profileData = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
        experiences: true,
        educations: true,
        skills: true,
        portfolio: true,
        reviews: true, 
      },
    });

    profile = profileData as FullProfile | null;

    // 2. FALLBACK LOGIC
    if (!profile) {
      profile = {
        id: "temp",
        userId: session.user.id,
        title: "",
        about: "",
        location: "",
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: session.user.id,
          name: session.user.name || "User",
          username: (session.user as any).username || "username",
          email: session.user.email || "",
          password: "", 
          role: "WORKER",
          notificationsEnabled: true,
          createdAt: new Date(),
        },
        experiences: [],
        educations: [],
        skills: [],
        portfolio: [],
      } as FullProfile;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black transition-colors overflow-x-hidden">
      {session ? (
        <>
          <Header />
          <div className="flex flex-1 min-w-0">
            <Sidebar />
            <main className="flex-1 ml-24 p-8 min-w-0 overflow-hidden">
              <div className="max-w-full mx-auto space-y-10 mt-15">
                
                <ProfileActions username={profile?.user?.username || "username"} />

                <ProfileHeader profile={profile} />

                <div className="space-y-8 w-full max-w-full">
                  <PortfolioSection />
                  <ExperienceSection profile={profile} />
                  <EducationSection profile={profile} />
                  <SkillSection />
                </div>
              </div>
            </main>
          </div>
        </>
      ) : (
        /* LOGGED OUT STATE */
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="space-y-6 max-w-md">
            <h1 className="text-7xl font-black text-neutral-900 dark:text-white tracking-tighter">
              Skill<span className="text-primary italic">groo</span>
            </h1>
            <p className="text-lg text-neutral-500 font-medium leading-tight">
              The elite marketplace for <br />
              <span className="text-neutral-900 dark:text-white font-black italic">
                skilled craft.
              </span>
            </p>

            <div className="flex items-center justify-center gap-4 pt-6">
              <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-900/50 p-3 rounded-3xl border border-neutral-200 dark:border-white/5 shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-2">
                  Access Portal
                </p>
                <AuthModal />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}