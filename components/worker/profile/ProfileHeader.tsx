"use client";

import { useState, useMemo } from "react"; // Added useMemo here
import ProfileEditModal from "./ProfileEditModal";
import ProfileImageSection from "@/components/subcomponents/profile-header/ProfileImageSection";
import ProfileInfoSection from "@/components/subcomponents/profile-header/ProfileInfoSection";
import ProfileDetailsSection from "@/components/subcomponents/profile-header/ProfileDetailSection";
import SkeletonProfileHeader from "@/components/subcomponents/profile-header/SkeleonProfileHeader";
import IconButton from "@/components/global/IconButton";
import { Edit2 } from "lucide-react";
import { FullProfile, getRankFromProfile } from "@/types/profile"; // Use the central utility

export default function ProfileHeader({
  profile: initialProfile,
}: {
  profile: FullProfile | null;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<FullProfile | null>(initialProfile);

  // Dynamic calculation using our central utility
  const dynamicRank = useMemo(() => {
    return getRankFromProfile(profile);
  }, [profile]);

  if (!profile) return <SkeletonProfileHeader />;

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[3rem] p-8 md:p-12 shadow-sm relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start gap-10">
        <ProfileImageSection profile={profile} />

        <div className="flex-1 w-full space-y-8">
          <div className="flex justify-between items-start">
            <ProfileInfoSection profile={profile} rank={dynamicRank} />

            <IconButton
              icon={<Edit2 size={16} />}
              text="Edit Profile"
              onClick={() => setIsModalOpen(true)}
              className="bg-primary text-white px-6 py-3 rounded-full hover:scale-105 transition-transform"
            />
          </div>

          <ProfileDetailsSection profile={profile} />
        </div>
      </div>
      <div>
        <ProfileEditModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialProfile={profile}
          onUpdate={(updated) => setProfile(updated)}
        />
      </div>
    </div>
  );
}
