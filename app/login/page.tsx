"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <button
      onClick={() =>
        signIn("credentials", {
          email: "test@skillgroo.com",
          password: "123456",
          callbackUrl: "/dashboard",
        })
      }
    >
      Login
    </button>
  )
}