"use client";

import { Star, Briefcase } from "lucide-react";
import { FullProfile, RankType } from "@/types/profile";
import RankBadge from "@/components/worker/rankings/RankBadge";
import { formatDistanceToNow } from "date-fns"; // Recommended for easy time formatting

interface ProfileInfoSectionProps {
  profile: FullProfile;
  rank: RankType;
}

export default function ProfileInfoSection({
  profile,
  rank,
}: ProfileInfoSectionProps) {
  const totalReviews = profile?.reviews?.length || 0;
  const avgRating =
    totalReviews > 0
      ? (
          profile.reviews.reduce((acc, rev) => acc + rev.rating, 0) /
          totalReviews
        ).toFixed(1)
      : "0.0";

  // Logic to format the last seen time
  const lastSeenText = profile?.lastSeen
    ? `Last seen ${formatDistanceToNow(new Date(profile.lastSeen), { addSuffix: true })}`
    : "Offline";

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">
            {profile?.user?.name}
          </h2>

          <RankBadge rank={rank} size="sm" withLabel={true} />

          <div className="flex items-center gap-1.5 ml-1 border-l border-neutral-200 dark:border-neutral-700 pl-3">
            <span className="relative flex h-2 w-2">
              {profile?.isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${profile?.isOnline ? "bg-emerald-500" : "bg-neutral-400"}`}
              ></span>
            </span>

            <div className="flex flex-col">
              <span
                className={`text-[11px] font-bold ${profile?.isOnline ? "text-emerald-600" : "text-neutral-500"}`}
              >
                {profile?.isOnline ? "Online" : "Offline"}
              </span>
              {!profile?.isOnline && profile?.lastSeen && (
                <span className="text-[9px] text-neutral-400 font-medium leading-none">
                  {lastSeenText}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-neutral-400 font-medium text-lg leading-none">
          @{profile?.user?.username}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6 pt-2">
        <div className="flex items-center gap-2.5 text-neutral-600 dark:text-neutral-300 font-medium">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Briefcase size={16} className="text-primary" />
          </div>
          <span>{profile?.title || "Professional"}</span>
        </div>
        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden md:block" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Star size={20} className="text-yellow-500 fill-yellow-500" />
            <span className="font-bold text-xl text-neutral-900 dark:text-white">
              {avgRating}
            </span>
          </div>
          <span className="text-neutral-400 text-sm font-medium">
            ({totalReviews} verified reviews)
          </span>
        </div>
      </div>
    </div>
  );
}
