"use client";

import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Settings, LogOut, ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AuthModal from "../AuthModal";
import { useProfile } from "@/context/ProfileContext";

export default function UserProfile() {
  const { data: session, status } = useSession();
  const { profile, loading: isProfileLoading } = useProfile();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC: SIGN OUT & SET OFFLINE ---
  const handleSignOut = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      // We send a dedicated PATCH to set status to offline before session ends
      const formData = new FormData();
      formData.append("isOnline", "false");
      
      await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
        // keepalive ensures the request finishes even if the redirect starts
        keepalive: true, 
      });
    } catch (error) {
      console.error("Failed to update status during signout:", error);
    } finally {
      // Clear the session and redirect home
      signOut({ callbackUrl: "/" });
    }
  };

  // --- 1. SKELETON STATE ---
  if (status === "loading" || (status === "authenticated" && isProfileLoading)) {
    return (
      <div className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-foreground/10 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-foreground/10" />
        <div className="hidden md:block space-y-2 ml-1">
          <div className="w-16 h-3 bg-foreground/10 rounded" />
          <div className="w-12 h-2 bg-foreground/5 rounded" />
        </div>
        <div className="w-4 h-4 bg-foreground/5 rounded-full ml-1" />
      </div>
    );
  }

  // --- 2. AUTH CHECK ---
  if (!session?.user) {
    return <AuthModal />;
  }

  const userName = profile?.name || session.user.name || "User";
  const userEmail = profile?.email || session.user.email || "";
  const displayImage = profile?.image || session.user.image;
  const username = profile?.username;

  const userInitials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoggingOut}
        className="flex items-center gap-2 p-1.5 pr-3 cursor-pointer hover:bg-foreground/5 rounded-2xl transition-all group border border-transparent hover:border-foreground/10 disabled:opacity-50"
      >
        <div className="w-10 h-10 rounded-xl relative overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold">
          {displayImage ? (
            <Image src={displayImage} alt={userName} fill className="object-cover" />
          ) : (
            userInitials
          )}
        </div>

        <div className="hidden md:block text-left ml-1">
          <p className="text-sm font-bold text-foreground leading-none">
            {userName.split(" ")[0]}
          </p>
          <p className="text-[10px] text-neutral-500 font-medium mt-1 uppercase tracking-wider">
            {isLoggingOut ? "Syncing..." : "Account"}
          </p>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-background border border-foreground/10 rounded-2xl shadow-xl py-2 z-[110] animate-in fade-in zoom-in-95 duration-200">
          <Link
            href={username ? `/${username}` : "#"}
            onClick={() => setIsOpen(false)}
            className="block px-4 py-4 border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl relative overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold">
                {displayImage ? (
                  <Image src={displayImage} alt="Avatar" fill className="object-cover" />
                ) : (
                  userInitials
                )}
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-bold text-foreground truncate">
                  {userName}
                </p>
                <p className="text-xs text-neutral-500 truncate">{userEmail}</p>
              </div>
            </div>
          </Link>

          <div className="px-2 pt-2">
            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="block"
            >
              <div className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-foreground hover:bg-foreground/5 rounded-xl transition-colors w-full">
                <div className="p-1.5 bg-foreground/10 rounded-lg">
                  <Settings size={16} />
                </div>
                Settings
              </div>
            </Link>
            
            <button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="flex items-center cursor-pointer gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors w-full mt-1 disabled:opacity-50"
            >
              <div className="p-1.5 bg-red-500/10 text-red-500 rounded-lg">
                {isLoggingOut ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <LogOut size={16} />
                )}
              </div>
              {isLoggingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}