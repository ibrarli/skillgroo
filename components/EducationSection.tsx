"use client"

import { useEffect, useState } from "react"
import EducationModal from "./EducationModal"
import axios from "axios"

interface Education {
  id: string
  degree: string
  institution: string
  from: string
  to?: string
  present: boolean
}

export default function EducationSection() {
  const [educations, setEducations] = useState<Education[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const fetchEducations = async () => {
    try {
      const res = await axios.get("/api/education")
      setEducations(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchEducations()
  }, [])

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Education</h3>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1 bg-apen text-white rounded hover:bg-apen/90"
        >
          + Add
        </button>
      </div>

      {educations.length === 0 ? (
        <p className="text-gray-500">No education added yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {educations.map((edu) => (
            <li key={edu.id} className="border p-3 rounded">
              <p className="font-semibold">{edu.degree}</p>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-sm text-gray-500">
                {new Date(edu.from).toLocaleDateString()} -{" "}
                {edu.present ? "Present" : edu.to ? new Date(edu.to).toLocaleDateString() : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      <EducationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchEducations}
      />
    </div>
  )
}