import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation"; // Added for server-side redirect

// Types
import { FullProfile } from "@/components/worker/profile/ProfileHeader";

// Components
import ProfileHeader from "@/components/worker/profile/ProfileHeader";
import ExperienceSection from "@/components/worker/profile/ExperienceSection";
import EducationSection from "@/components/worker/profile/EducationSection";
import SkillSection from "@/components/worker/profile/SkillSection";
import PortfolioSection from "@/components/worker/profile/PortfolioSection";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import ProfileActions from "@/components/worker/ProfileActions";

export const metadata: Metadata = {
  title: "Worker Dashboard | Skillgroo",
  description: "Manage your professional trade profile, portfolio, and skills on Skillgroo.",
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  // --- 1. REDIRECT IF NOT LOGGED IN ---
  // We send them to home with a query param to trigger the AuthModal
  if (!session) {
    redirect("/?auth=login");
  }

  // --- 2. FETCH DATA ---
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

  // --- 3. FALLBACK LOGIC ---
  let profile: FullProfile;

  if (profileData) {
    profile = profileData as FullProfile;
  } else {
    profile = {
      id: "temp",
      userId: session.user.id,
      title: "",
      about: "",
      location: "",
      image: session.user.image || null,
      languages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        id: session.user.id,
        name: session.user.name || "User",
        username: (session.user as any).username || 
                  session.user.name?.toLowerCase().replace(/\s+/g, "") || 
                  "user",
        email: session.user.email || "",
        role: "WORKER",
        notificationsEnabled: true,
        createdAt: new Date(),
      },
      experiences: [],
      educations: [],
      skills: [],
      portfolio: [],
    } as unknown as FullProfile;
  }

  return (
    /* Updated bg-white dark:bg-black to bg-background */
    <div className="min-h-screen flex flex-col bg-background transition-colors duration-300 overflow-x-hidden">
      <Header />
      <div className="flex flex-1 min-w-0">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 min-w-0 overflow-hidden">
          <div className="max-w-full mx-auto space-y-10 mt-15">
            
            {/* Header Actions (View Public Profile, etc.) */}
            <ProfileActions username={profile.user.username || "username"} />

            {/* Profile Content */}
            <ProfileHeader profile={profile} />

            <div className="space-y-8 w-full max-w-full pb-20">
              <PortfolioSection />
              <ExperienceSection profile={profile} />
              <EducationSection profile={profile} />
              <SkillSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}