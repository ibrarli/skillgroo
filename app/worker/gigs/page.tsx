import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

import LogoutButton from "@/components/LogoutButton"
import LoginModal from "@/components/LoginModal"
import RegisterModal from "@/components/RegisterModal"
import GigModal from "@/components/GigModal"
import ProfileHeader from "@/components/ProfileHeader"
import ExperienceSection from "@/components/ExperienceSection"
import EducationSection from "@/components/EducationSection"
import SkillSection from "@/components/SkillSection"
import PortfolioSection from "@/components/PortfolioSection"
import PersonalGigSection from "@/components/PersonalGigSection"
import Header from "@/components/Header"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // Fetch profile only if logged in
  let profile = null

  if (session) {
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
  }

  // Fetch gigs directly from DB (better than calling your own API)
  const gigs = await prisma.gig.findMany({
    include: {
      profile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="p-10">
      <div className="flex flex-col items-center gap-6">

        {session ? (
          <>
            <Header />
            

            {profile && <ProfileHeader profile={profile} />}
              <PersonalGigSection />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Welcome to Skillgroo</h1>
            <p>Find trusted skilled workers near you.</p>

            <div className="flex gap-4">
              <LoginModal />
              <RegisterModal />
            </div>
          </>
        )}
      </div>

      
    </div>
  )
}