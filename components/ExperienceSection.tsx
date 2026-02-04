"use client"

import { useState } from "react"
import ExperienceModal from "./ExperienceModal"

export default function ExperienceSection({ profile }: any) {
  const [experiences, setExperiences] = useState(profile.experiences)

  const refresh = async () => {
    const res = await fetch("/api/profile")
    const data = await res.json()
    setExperiences(data.experiences)
  }

  return (
    <div className="w-full max-w-3xl bg-white shadow rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Experience</h2>
        <ExperienceModal onAdded={refresh} />
      </div>

      <div className="flex flex-col gap-4">
        {experiences.map((exp: any) => (
          <div key={exp.id} className="border-b pb-3">
            <h3 className="font-semibold">{exp.title}</h3>
            <p className="text-sm text-gray-600">{exp.company}</p>
            <p className="text-sm text-gray-500">
              {new Date(exp.from).getFullYear()} -{" "}
              {exp.present
                ? "Present"
                : exp.to
                ? new Date(exp.to).getFullYear()
                : ""}
            </p>
            <p className="text-sm mt-2">{exp.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}