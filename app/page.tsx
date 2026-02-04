import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route"
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
    <div>
      <div className="flex flex-col items-center gap-6">

        {session ? (
          <>
            <Header />
            <h1 className="text-2xl font-semibold">
              Welcome back, {session.user?.name}
            </h1>
            {/* Public Gigs Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Latest Gigs</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="border rounded-xl p-4 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{gig.title}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {gig.description}
              </p>

              <p className="mt-2 font-bold">${gig.price}</p>
              <p className="text-sm text-gray-500">{gig.location}</p>

              <p className="text-xs mt-2 text-gray-400">
                By {gig.profile?.title || "Skilled Worker"}
              </p>
            </div>
          ))}
        </div>
      </div>
         
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