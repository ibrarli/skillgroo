import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

// Unified Auth
import AuthModal from "@/components/AuthModal"

// Worker Profile Components
import ProfileHeader from "@/components/worker/profile/ProfileHeader"
import ExperienceSection from "@/components/worker/profile/ExperienceSection"
import EducationSection from "@/components/worker/profile/EducationSection"
import SkillSection from "@/components/worker/profile/SkillSection"
import PortfolioSection from "@/components/worker/profile/PortfolioSection"
import Header from "@/components/global/Header"
import Sidebar from "@/components/worker/Sidebar"

export default async function Home() {
  const session = await getServerSession(authOptions)

  let profile = null

  if (session) {
    // 1. Try to fetch the full profile from DB
    profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
        experiences: true,
        educations: true,
        skills: true,
        portfolio: true
      },
    })

    // 2. FALLBACK LOGIC: If no profile record exists in the DB yet,
    // we create a temporary object using the data from the registration session.
    if (!profile) {
      profile = {
        userId: session.user.id,
        user: {
          name: session.user.name,
          username: (session.user as any).username, // From our updated NextAuth callback
          email: session.user.email,
        },
        // Set defaults for the rest so components don't crash
        title: "",
        about: "",
        location: "",
        image: null,
        experiences: [],
        educations: [],
        skills: [],
        portfolio: []
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black transition-colors">
      {session ? (
        <>
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 ml-24 p-8 ">
              <div className="max-w-full mx-auto space-y-10">
                
                <ProfileHeader profile={profile} />

                <div className="space-y-8">
                  <PortfolioSection />
                  <ExperienceSection profile={profile} />
                  <EducationSection />
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
              The elite marketplace for <br/> 
              <span className="text-neutral-900 dark:text-white font-black italic">skilled craft.</span>
            </p>

            <div className="flex items-center justify-center gap-4 pt-6">
               <div className="flex items-center gap-4 bg-neutral-100 dark:bg-neutral-900/50 p-3 rounded-3xl border border-neutral-200 dark:border-white/5 shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 px-2">Access Portal</p>
                <AuthModal />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}