import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

import LoginModal from "@/components/login/LoginModal"
import RegisterModal from "@/components/register/RegisterModal"
import Header from "@/components/global/Header"
import Sidebar from "@/components/worker/Sidebar"
import PersonalGigSection from "@/components/worker/gigs/PersonalGigSection"

export default async function Home() {
  const session = await getServerSession(authOptions)

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

  const gigs = await prisma.gig.findMany({
    include: { profile: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen  flex flex-col">
      {session ? (
        <>
          {/* 1. HEADER: Full width at the top */}
          <Header />

          <div className="flex flex-1">
            {/* 2. SIDEBAR: Fixed/Sticky on the left, but below header */}
            <Sidebar />

            {/* 3. MAIN CONTENT: Fills remaining space */}
            <main className="flex-1 ml-24 p-8">
              <div className="max-w-6xl mx-auto space-y-10">
                {profile && <PersonalGigSection/>}
              </div>
            </main>
          </div>
        </>
      ) : (
        /* LOGGED OUT STATE */
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="space-y-4 max-w-md">
            <h1 className="text-5xl font-extrabold text-neutral-900 tracking-tight">
              Skill<span className="text-primary">groo</span>
            </h1>
            <p className="text-lg text-neutral-600">
              Find trusted skilled workers near you or showcase your own craft to the world.
            </p>

            <div className="flex items-center justify-center gap-4 pt-6">
              <LoginModal />
              <div className="w-[1px] h-6 bg-neutral-300" />
              <RegisterModal />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}