"use client"
import { useState } from "react"

interface PortfolioModalProps {
  onAdd: () => void
}

export default function PortfolioModal({ onAdd }: PortfolioModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [projectImage, setProjectImage] = useState("")
  const [hours, setHours] = useState<number>(0)
  const [rate, setRate] = useState<number>(0)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleSubmit = async () => {
    if (!title || !description || !hours || !rate || !startDate) return

    await fetch("/api/portfolio", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        projectImage,
        hours,
        rate,
        startDate,
        endDate,
      }),
    })

    setTitle("")
    setDescription("")
    setProjectImage("")
    setHours(0)
    setRate(0)
    setStartDate("")
    setEndDate("")
    setOpen(false)
    onAdd()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-apen text-white rounded"
      >
        + Add Portfolio
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">Add Portfolio Project</h2>

            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="url"
              placeholder="Project Image URL"
              value={projectImage}
              onChange={(e) => setProjectImage(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              placeholder="Hours"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="number"
              placeholder="Rate per hour"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="date"
              placeholder="End Date (optional)"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border p-2 mb-4 rounded"
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