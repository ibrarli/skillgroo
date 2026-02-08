"use client";

import Image from "next/image";
import { 
  MapPin, 
  Calendar, 
  Share2, 
  Star, 
  Languages, 
  Briefcase,
  CheckCircle2
} from "lucide-react";

interface PublicHeaderProps {
  user: any; // Ideally use FullProfile type
}

export default function PublicHeader({ user }: PublicHeaderProps) {
  const userInitials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Calculate Average Rating
  const reviews = user.profile?.reviews || [];
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc: number, rev: any) => acc + rev.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="relative w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full -ml-24 -mb-24 blur-3xl" />
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 relative z-10">
        {/* Avatar Area */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 md:w-48 md:h-48 relative rounded-[2.5rem] overflow-hidden bg-primary/5 border-4 border-white dark:border-neutral-800 shadow-2xl">
            {user.profile?.image ? (
              <Image
                src={user.profile.image}
                alt={user.name || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-5xl font-black text-primary/40 italic">
                {userInitials}
              </div>
            )}
          </div>

          {/* Rating Badge Overlay */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-800 px-4 py-2 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-700 flex items-center gap-2">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-black text-sm">{avgRating}</span>
          </div>
        </div>

        {/* User Information */}
        <div className="flex-1 text-center md:text-left pt-2">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase flex items-center justify-center md:justify-start gap-3">
              {user.name}
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mb-6 text-primary">
            <span className="font-black tracking-widest uppercase text-sm">@{user.username}</span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <div className="flex items-center gap-2 text-neutral-500 font-bold uppercase tracking-tight">
              <Briefcase size={16} className="text-primary" />
              {user.profile?.title || "Professional"}
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-center md:justify-start gap-2.5 text-neutral-500 font-bold text-sm">
              <MapPin size={18} className="text-primary" />
              {user.profile?.location || "Global"}
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5 text-neutral-500 font-bold text-sm">
              <Languages size={18} className="text-primary" />
              <div className="flex gap-1.5 italic">
                {user.profile?.languages?.length > 0 
                  ? user.profile.languages.join(", ") 
                  : "English"}
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2.5 text-neutral-500 font-bold text-sm">
              <Calendar size={18} className="text-primary" />
              Joined {new Date(user.createdAt).getFullYear()}
            </div>
          </div>


          
        </div>
      </div>
    </div>
  );
}