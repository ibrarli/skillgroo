"use client";

import { useState, useEffect } from "react";
import { Eye, Share2, Power, ZapOff, Zap } from "lucide-react";
import IconButton from "../global/IconButton";
import { useRouter } from "next/navigation";

interface ProfileActionsProps {
  username: string;
  isOnline: boolean;
}

export default function ProfileActions({
  username,
  isOnline: initialOnline,
}: ProfileActionsProps) {
  const [isOnline, setIsOnline] = useState(initialOnline);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Sync state if server props change
  useEffect(() => {
    setIsOnline(initialOnline);
  }, [initialOnline]);

  const handleToggleOnline = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const newStatus = !isOnline;
    setIsOnline(newStatus); // Optimistic Update

    try {
      const formData = new FormData();
      formData.append("isOnline", String(newStatus));

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) throw new Error("Update failed");

      // 1. Tell Next.js to invalidate server cache
      router.refresh();

      // 2. Force a hard refresh if you want every component to reset perfectly
      // If router.refresh() isn't enough for your ProfileHeader, use this:
      window.location.reload();
    } catch (err) {
      console.error(err);
      setIsOnline(!newStatus); // Rollback
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-3 items-center">
      {/* THE ENHANCED TOGGLE BUTTON */}
      <button
        onClick={handleToggleOnline}
        disabled={isLoading}
        className={`group cursor-pointer relative flex items-center gap-4 px-5 py-2 rounded-xl border transition-all duration-500 shadow-sm overflow-hidden active:scale-95 disabled:opacity-70 ${
          isOnline
            ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-200"
            : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:bg-neutral-900 dark:border-neutral-800"
        }`}
      >
        {isOnline ? (
          <Zap size={16} className="text-white fill-white animate-pulse" />
        ) : (
          <ZapOff size={16} className="text-neutral-400" />
        )}
        {/* Text Label */}
        <span className="text-sm font-bold leading-none tracking-tight">
          {isOnline ? "You are Live" : "Go Online"}
        </span>
      </button>

      <div className="h-10 w-[1px] bg-neutral-200 dark:bg-neutral-800 mx-2" />

      <IconButton
        text="Preview"
        icon={<Eye size={18} />}
        onClick={() => window.open(`/${username}`, "_blank")}
      />
      <IconButton
        text="Share"
        icon={<Share2 size={18} />}
        onClick={() => {
          navigator.clipboard.writeText(
            `${window.location.origin}/${username}`,
          );
          alert("Profile link copied!");
        }}
      />
    </div>
  );
}
