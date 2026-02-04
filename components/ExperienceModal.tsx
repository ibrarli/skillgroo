"use client"

import { useState } from "react"

export default function ExperienceModal({ onAdded }: any) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    from: "",
    to: "",
    present: false,
  })

  const handleSubmit = async () => {
    await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    setOpen(false)
    onAdded()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        + Add Experience
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md flex flex-col gap-3">
            <input
              placeholder="Job Title"
              className="border p-2 rounded"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input
              placeholder="Company"
              className="border p-2 rounded"
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />

            <textarea
              placeholder="Description"
              className="border p-2 rounded"
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <input
              type="date"
              className="border p-2 rounded"
              onChange={(e) => setForm({ ...form, from: e.target.value })}
            />

            {!form.present && (
              <input
                type="date"
                className="border p-2 rounded"
                onChange={(e) => setForm({ ...form, to: e.target.value })}
              />
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                onChange={(e) =>
                  setForm({ ...form, present: e.target.checked })
                }
              />
              Currently working here
            </label>

            <button
              onClick={handleSubmit}
              className="bg-black text-white p-2 rounded-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  )
}