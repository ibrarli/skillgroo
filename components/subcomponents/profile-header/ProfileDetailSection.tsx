"use client";

import { MapPin, Languages } from "lucide-react";
import { FullProfile } from "@/types/profile";

interface ProfileDetailsSectionProps {
  profile: FullProfile;
}

export default function ProfileDetailsSection({ profile }: ProfileDetailsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
      <div className="space-y-6">
        {/* Location Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
            Location
          </label>
          <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-300 font-bold text-sm bg-neutral-50 dark:bg-neutral-800/40 w-fit px-4 py-2 rounded-2xl border border-neutral-100 dark:border-white/5">
            <MapPin size={14} className="text-primary" /> 
            {profile?.location || "Remote / Global"}
          </div>
        </div>

        {/* Languages Section */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
            Languages
          </label>
          <div className="flex flex-wrap gap-2">
            {profile?.languages && profile.languages.length > 0 ? (
              profile.languages.map((lang) => (
                <span 
                  key={lang}
                  className="flex items-center gap-2 bg-primary/5 text-primary text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-primary/10"
                >
                  <Languages size={12} />
                  {lang}
                </span>
              ))
            ) : (
              <span className="text-neutral-500 text-xs font-bold italic px-1">English</span>
            )}
          </div>
        </div>
      </div>

      {/* About / Bio Section */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">
          Professional Bio
        </label>
        <div className="bg-neutral-50 dark:bg-neutral-800/40 p-6 rounded-[2rem] border border-neutral-100 dark:border-white/5">
          <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-medium italic">
            "{profile?.about || "This professional hasn't added a bio yet. Check back soon for more details about their expertise and services."}"
          </p>
        </div>
      </div>
    </div>
  );
}