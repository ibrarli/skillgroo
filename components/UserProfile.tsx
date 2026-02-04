"use client"

import { useState, useRef, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { User, Settings, LogOut, ChevronDown } from "lucide-react"

export default function UserProfile() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!session?.user) {
    return (
      <a
        href="/api/auth/signin"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Sign In
      </a>
    )
  }

  const userName = session.user.name || session.user.email || "User"
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors group"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            userInitials
          )}
        </div>

        {/* User Name */}
        <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-gray-900">
          {userName}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500 mt-1">{session.user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <a
              href="/profile"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              Profile
            </a>
            <a
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={() => signOut()}
              className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}