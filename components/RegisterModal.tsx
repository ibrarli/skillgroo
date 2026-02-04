"use client"

import { useState } from "react"

export default function RegisterModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRegister = async () => {
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setSuccess("Registered successfully! You can now log in.")
      }
    } catch (err) {
      setError("Something went wrong")
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Register
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Register</h2>

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-2 p-2 border rounded"
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

            <button
              onClick={handleRegister}
              className="w-full px-4 py-2 bg-green-600 text-white rounded mb-2"
            >
              Register
            </button>

            <button
              onClick={() => setOpen(false)}
              className="w-full text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}