"use client"
import { useEffect, useState } from "react"
import SkillModal from "./SkillModal"

interface Skill {
  id: string
  name: string
  level: number
}

export default function SkillSection() {
  const [skills, setSkills] = useState<Skill[]>([])

  const fetchSkills = async () => {
    const res = await fetch("/api/skills")
    const data = await res.json()
    setSkills(data)
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-gray-100 px-3 py-1 rounded-full">
            {skill.name} ({skill.level} yrs)
          </div>
        ))}
      </div>

      <div className="mt-4">
        <SkillModal onAdd={fetchSkills} />
      </div>
    </div>
  )
}