import Image from "next/image";
import { MapPin, Calendar, CheckCircle2, Share2 } from "lucide-react";

interface PublicHeaderProps {
  user: any; // Ideally use your Prisma User type here
}

export default function PublicHeader({ user }: PublicHeaderProps) {
  const userInitials = user.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative w-full bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
        {/* Avatar Area */}
        <div className="w-32 h-32 md:w-44 md:h-44 relative rounded-[2.5rem] overflow-hidden bg-primary/5 border-4 border-white dark:border-neutral-800 shadow-2xl shrink-0">
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

        {/* User Information */}
        <div className="flex-1 text-center md:text-left pt-2">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic text-neutral-900 dark:text-white uppercase">
              {user.name}
            </h1>
            <div className="flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto md:mx-0 shadow-lg shadow-primary/20">
              <CheckCircle2 size={12} strokeWidth={3} />
              Verified Pro
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-3 text-neutral-500 font-bold text-sm">
            <div className="flex items-center gap-2 text-primary">
              <span className="font-black tracking-widest uppercase">@{user.username}</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <MapPin size={16} className="text-neutral-400" />
              {user.profile?.location || "Global"}
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar size={16} className="text-neutral-400" />
              Joined {new Date(user.createdAt).getFullYear()}
            </div>
          </div>

          {/* Public Action Buttons */}
          <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
            <button className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl">
              Hire Me
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 font-black text-xs uppercase tracking-[0.2em] hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all">
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}