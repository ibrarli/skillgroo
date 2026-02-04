"use client"
import { useState } from "react"

interface SkillModalProps {
  onAdd: () => void
}

export default function SkillModal({ onAdd }: SkillModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [level, setLevel] = useState(1)

  const handleSubmit = async () => {
    if (!name) return
    await fetch("/api/skills", {
      method: "POST",
      body: JSON.stringify({ name, level }),
    })
    setName("")
    setLevel(1)
    setOpen(false)
    onAdd()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-apen text-white rounded"
      >
        + Add Skill
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Add Skill</h2>
            <input
              type="text"
              placeholder="Skill name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="number"
              placeholder="Experience in years"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full border p-2 mb-3 rounded"
              min={0}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-apen text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}