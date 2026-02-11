"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Loader2,
  Route,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [dbProfile, setDbProfile] = useState<{
    image?: string | null;
    name?: string | null;
    email?: string | null;
    username?: string | null; // Added username
  } | null>(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchCustomProfile() {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const data = await res.json();
            setDbProfile({
              image: data.image,
              name: data.user?.name,
              email: data.user?.email,
              username: data.username, // Assuming your API returns username at the root or under data.username
            });
          }
        } catch (error) {
          console.error("Failed to sync profile", error);
        } finally {
          setIsLoadingProfile(false);
        }
      } else if (status === "unauthenticated") {
        setIsLoadingProfile(false);
      }
    }
    fetchCustomProfile();
  }, [status]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (
    status === "loading" ||
    (status === "authenticated" && isLoadingProfile)
  ) {
    return (
      <div className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-neutral-100 dark:border-neutral-800 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
        <div className="hidden md:block space-y-2 ml-1 ">
          <div className="w-16 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="w-12 h-2 bg-neutral-100 dark:bg-neutral-800/50 rounded" />
        </div>
        <div className="w-4 h-4 bg-neutral-100 dark:bg-neutral-800 rounded-full ml-1" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <a
        href="/api/auth/signin"
        className="px-5 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md shadow-primary/20"
      >
        Sign In
      </a>
    );
  }

  const userName = dbProfile?.name || session.user.name || "User";
  const userEmail = dbProfile?.email || session.user.email || "";
  const displayImage = dbProfile?.image || session.user.image;
  const username = dbProfile?.username; // Get the username for the link

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 pr-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-2xl transition-all group border border-transparent hover:border-gray-200 dark:hover:border-neutral-700"
      >
        <div className="w-10 h-10 rounded-xl relative overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={userName}
              fill
              className="object-cover"
            />
          ) : (
            userInitials
          )}
        </div>

        <div className="hidden md:block text-left ml-1">
          <p className="text-sm font-bold text-neutral-800 dark:text-white leading-none">
            {userName.split(" ")[0]}
          </p>
          <p className="text-[10px] text-neutral-500 font-medium mt-1 uppercase tracking-wider">
            Account
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 py-2 z-[110] animate-in fade-in zoom-in-95 duration-200">
          
          {/* --- PROFILE LINK SECTION --- */}
          <Link 
            href={username ? `/${username}` : "#"} 
            onClick={() => setIsOpen(false)}
            className="block px-4 py-4 border-b border-gray-50 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl relative overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold">
                {displayImage ? (
                    <Image
                    src={displayImage}
                    alt="Avatar"
                    fill
                    className="object-cover"
                    />
                ) : (
                    userInitials
                )}
                </div>
                <div className="flex-1 truncate">
                <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                    {userName}
                </p>
                <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
                </div>
            </div>
          </Link>

          <div className="px-2 pt-2 border-gray-50 dark:border-neutral-800">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="block"
            >
              <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-neutral-800 dark:text-white dark:hover:bg-neutral-700 rounded-xl transition-colors w-full">
                <div className="p-1.5 bg-neutral-300 dark:bg-neutral-800 rounded-lg">
                  <Settings size={16} />
                </div>
                Settings
              </div>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center cursor-pointer gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors w-full"
            >
              <div className="p-1.5 bg-red-50 dark:bg-red-950/50 text-red-500 rounded-lg">
                <LogOut size={16} />
              </div>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}