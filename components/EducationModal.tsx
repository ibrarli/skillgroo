"use client"

import { useState } from "react"
import axios from "axios"

interface EducationModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export default function EducationModal({ isOpen, onClose, onSaved }: EducationModalProps) {
  const [degree, setDegree] = useState("")
  const [institution, setInstitution] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [present, setPresent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!degree || !institution || !from) return alert("Degree, Institution, and From date are required")
    setLoading(true)
    try {
      await axios.post("/api/education", { degree, institution, from, to: present ? null : to, present })
      onSaved()
      setDegree("")
      setInstitution("")
      setFrom("")
      setTo("")
      setPresent(false)
      onClose()
    } catch (error) {
      console.error(error)
      alert("Failed to save education")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-xl font-semibold mb-4">Add Education</h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Degree"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Institution"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            className="border p-2 rounded"
          />
          <label className="flex flex-col">
            From:
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border p-2 rounded"
            />
          </label>
          {!present && (
            <label className="flex flex-col">
              To:
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border p-2 rounded"
              />
            </label>
          )}
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={present}
              onChange={(e) => setPresent(e.target.checked)}
            />
            Currently studying / Present
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-apen text-white rounded hover:bg-apen/90"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  )
}