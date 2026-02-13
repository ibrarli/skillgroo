"use client";

import Image from "next/image";
import { FullProfile } from "@/types/profile";

interface ProfileImageSectionProps {
  profile: FullProfile;
}

export default function ProfileImageSection({ profile }: ProfileImageSectionProps) {
  return (
    <div className=" mx-auto md:mx-0 shrink-0">
      <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-[2.5rem] overflow-hidden bg-primary/10 flex items-center justify-center text-primary text-4xl font-black border-4 border-white dark:border-neutral-800 shadow-xl transition-transform hover:scale-[1.02] duration-300">
        {profile?.image ? (
          <Image 
            src={profile.image} 
            alt={profile?.user?.name || "Profile"} 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <span className="select-none">
            {(profile?.user?.name || "U").slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>
      
    </div>
  );
}