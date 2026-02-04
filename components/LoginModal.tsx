"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginModal() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = async () => {
    setError("")

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.error) {
      setError("Invalid credentials")
    } else {
      window.location.reload() // refresh homepage to show logged-in view
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Login
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Login</h2>

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

            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 bg-black text-white rounded mb-2"
            >
              Login
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