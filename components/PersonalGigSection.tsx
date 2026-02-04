"use client"

import { useState, useEffect } from "react"
import GigModal from "./GigModal"

interface Gig {
  id: string
  title: string
  description: string
  price: number
  location: string
  category?: string
  status?: string
  image?: string
}

export default function PersonalGigSection() {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchGigs = async () => {
    const res = await fetch("/api/gigs?mine=true") // your API route filtering by user
    const data = await res.json()
    setGigs(data)
  }

  useEffect(() => {
    fetchGigs()
  }, [])

  const handleEdit = (gig: Gig) => {
    setSelectedGig(gig)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setSelectedGig(null)
    setModalOpen(false)
    fetchGigs() // refresh list
  }

  const handleDelete = async (gigId: string) => {
    if (!confirm("Are you sure you want to delete this gig?")) return

    await fetch(`/api/gigs/${gigId}`, { method: "DELETE" })
    fetchGigs()
  }

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Gigs</h2>
        <GigModal onSuccess={handleModalClose} />
      </div>

      {gigs.length === 0 && <p>No gigs yet. Add one!</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gigs.map((gig) => (
          <div
            key={gig.id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            {gig.image && (
              <img
                src={gig.image}
                alt={gig.title}
                className="w-full h-32 object-cover rounded mb-2"
              />
            )}
            <h3 className="font-semibold text-lg">{gig.title}</h3>
            <p className="text-sm text-gray-600">{gig.description}</p>
            <p className="mt-1 font-bold">${gig.price}</p>
            <p className="text-sm text-gray-500">{gig.location}</p>
            {gig.category && <p className="text-sm text-gray-400">{gig.category}</p>}
            <p className="text-sm text-gray-400 mt-1">Status: {gig.status || "active"}</p>

            <div className="flex gap-2 mt-2">
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded"
                onClick={() => handleEdit(gig)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => handleDelete(gig.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modalOpen && selectedGig && (
        <GigModal gig={selectedGig} onSuccess={handleModalClose} />
      )}
    </div>
  )
}