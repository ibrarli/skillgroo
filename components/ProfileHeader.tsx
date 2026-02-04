"use client"

import { useState } from "react"
import Image from "next/image"

interface Props {
  profile: any
}

export default function ProfileHeader({ profile }: Props) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [title, setTitle] = useState(profile?.title || "")

  const saveTitle = async () => {
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    })
    setEditingTitle(false)
  }

  return (
    <div className="w-full max-w-3xl bg-white shadow rounded-xl p-6">
      
      {/* Profile Image */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Image
            src={profile?.image || "/default-avatar.jpg"}
            alt="Profile"
            width={120}
            height={120}
            className="rounded-full object-cover border"
          />
        </div>

        <div className="flex flex-col gap-2">
          
          {/* Name */}
          <h1 className="text-2xl font-semibold">
            {profile?.user?.name}
          </h1>

          {/* Title Editable */}
          {editingTitle ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              autoFocus
              placeholder="Add your title"
              className="border px-3 py-1 rounded-md outline-none"
            />
          ) : (
            <div className="flex items-center gap-2 text-gray-600">
              <span>{title || "Add your title"}</span>
              <button
                onClick={() => setEditingTitle(true)}
                className="text-sm hover:text-black"
              >
                ✏️
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}