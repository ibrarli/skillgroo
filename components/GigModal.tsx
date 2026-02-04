"use client"

import { useState, useEffect } from "react"

interface GigModalProps {
  onSuccess?: () => void
  gig?: any // pass gig to edit
}

export default function GigModal({ onSuccess, gig }: GigModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("active")
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    if (gig) {
      setTitle(gig.title)
      setDescription(gig.description)
      setPrice(gig.price)
      setLocation(gig.location)
      setCategory(gig.category || "")
      setStatus(gig.status || "active")
    }
  }, [gig])

  const handleSubmit = async () => {
    const payload: any = {
      title,
      description,
      price,
      location,
      category,
      status,
    }

    if (image) {
      const reader = new FileReader()
      reader.onload = async () => {
        payload.image = reader.result as string
        await saveGig(payload)
      }
      reader.readAsDataURL(image)
    } else {
      if (gig?.image) payload.image = gig.image
      await saveGig(payload)
    }
  }

  const saveGig = async (payload: any) => {
    const url = gig ? `/api/gigs/${gig.id}` : "/api/gigs"
    const method = gig ? "PUT" : "POST"

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    setOpen(false)
    onSuccess?.()
  }

  return (
    <>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setOpen(true)}
      >
        {gig ? "Edit" : "Add Gig"}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[500px] max-w-full">
            <h2 className="text-xl font-semibold mb-4">
              {gig ? "Edit Gig" : "Add Gig"}
            </h2>
            <input
              className="border p-2 w-full mb-2"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="border p-2 w-full mb-2"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              className="border p-2 w-full mb-2"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <select
              className="border p-2 w-full mb-2"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <input
              type="file"
              className="mb-2"
              onChange={(e) => e.target.files && setImage(e.target.files[0])}
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}