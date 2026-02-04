"use client"

import { useState, useEffect } from "react"

interface ProfileFormProps {
  userId: string
}

export default function ProfileForm({ userId }: ProfileFormProps) {
  const [profile, setProfile] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

   useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data || {})
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setError("")
    setSuccess("")
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      if (!res.ok) throw new Error("Failed to save profile")
      setSuccess("Profile saved successfully!")
    } catch (err) {
      setError("Something went wrong")
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md space-y-2">
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <input
        type="text"
        placeholder="Title"
        value={profile.title || ""}
        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="About"
        value={profile.about || ""}
        onChange={(e) => setProfile({ ...profile, about: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Experience"
        value={profile.experience || ""}
        onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Qualification"
        value={profile.qualification || ""}
        onChange={(e) => setProfile({ ...profile, qualification: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Skills (comma separated)"
        value={(profile.skills || []).join(", ")}
        onChange={(e) => setProfile({ ...profile, skills: e.target.value.split(",").map(s => s.trim()) })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Location"
        value={profile.location || ""}
        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Portfolio links (comma separated)"
        value={(profile.portfolio || []).join(", ")}
        onChange={(e) => setProfile({ ...profile, portfolio: e.target.value.split(",").map(s => s.trim()) })}
        className="w-full p-2 border rounded"
      />

      <button onClick={handleSave} className="w-full py-2 bg-green-600 text-white rounded">
        Save Profile
      </button>
    </div>
  )
}