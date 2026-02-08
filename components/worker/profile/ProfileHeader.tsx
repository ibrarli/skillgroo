"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Profile, 
  User, 
  Experience, 
  Education, 
  Skill, 
  Portfolio, 
  Review, 
  Gig 
} from "@prisma/client";

// Child Components
import ProfileImageSection from "@/components/subcomponents/profile-header/ProfileImageSection";
import ProfileInfoSection from "@/components/subcomponents/profile-header/ProfileInfoSection";
import ProfileDetailsSection from "@/components/subcomponents/profile-header/ProfileDetailSection";
import SkeletonProfileHeader from "@/components/subcomponents/profile-header/SkeleonProfileHeader";

/**
 * TYPE DEFINITION
 * This combines the base Profile with all related relational data
 */
export type FullProfile = Profile & {
  user: User;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  portfolio: Portfolio[];
  gigs: Gig[];
  reviews: Review[];
};

export default function ProfileHeader({ profile: initialProfile }: { profile: FullProfile | null }) {
  const router = useRouter();
  
  // States
  const [profile, setProfile] = useState<FullProfile | null>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: initialProfile?.user?.name || "",
    username: initialProfile?.user?.username || "",
    title: initialProfile?.title || "",
    about: initialProfile?.about || "",
    location: initialProfile?.location || "",
    languages: (initialProfile?.languages as string[]) || [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if initialProfile changes (e.g., after a SSR refresh)
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setForm({
        name: initialProfile.user?.name || "",
        username: initialProfile.user?.username || "",
        title: initialProfile.title || "",
        about: initialProfile.about || "",
        location: initialProfile.location || "",
        languages: (initialProfile.languages as string[]) || [],
      });
    }
  }, [initialProfile]);

  /**
   * SAVE HANDLER
   * Sends FormData to the API to handle text and file uploads together
   */
  const handleSaveData = async (selectedFile?: File) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("title", form.title);
      formData.append("about", form.about);
      formData.append("location", form.location);
      formData.append("languages", JSON.stringify(form.languages));
      
      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData, // Crucial: No JSON.stringify when sending files
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setIsEditing(false);
        router.refresh(); // Refresh the page data
      } else {
        const error = await res.json();
        alert(error.error || "Update failed. Please try again.");
      }
    } catch (err) {
      console.error("Save Error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * IMAGE UPLOAD HANDLER
   * Triggered when a user selects a new file from the input
   */
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageUploading(true);
    // We pass the file directly to handleSaveData so it updates everything at once
    await handleSaveData(file); 
    setImageUploading(false);
  };

  // Render skeleton if data is missing
  if (!profile) return <SkeletonProfileHeader />;

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* AVATAR SECTION */}
        <ProfileImageSection
          profile={profile}
          form={form}
          fileInputRef={fileInputRef}
          imageUploading={imageUploading}
          handleImageUpload={handleImageUpload}
        />

        <div className="flex-1 w-full space-y-6">
          {/* USER INFO SECTION (Name, Title, Save Button) */}
          <ProfileInfoSection
            profile={profile}
            form={{ ...form, setForm }} // Injects setForm into the object passed to children
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            loading={loading}
            handleSaveData={() => handleSaveData()} 
          />

          {/* DETAILS SECTION (About, Languages, Location) */}
          <ProfileDetailsSection
            profile={profile}
            form={{ ...form, setForm }}
            isEditing={isEditing}
            handleLangSearch={() => {}}
            showLangDropdown={false}
            setShowLangDropdown={() => {}}
          />
        </div>
      </div>
    </div>
  );
}