"use client";

import Image from "next/image";
import { Loader2, Camera } from "lucide-react";
import IconButton from "@/components/global/IconButton";

interface ProfileImageSectionProps {
  profile: any;
  form: any;
  fileInputRef: React.RefObject<HTMLInputElement | null>; 
  imageUploading: boolean;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileImageSection({
  profile,
  form,
  fileInputRef,
  imageUploading,
  handleImageUpload,
}: ProfileImageSectionProps) {
  return (
    <div className="relative mx-auto md:mx-0">
      <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center text-primary text-4xl font-black border-4 border-white dark:border-neutral-800 shadow-lg">
        {profile?.image ? (
          <Image src={profile.image} alt="Profile" fill className="object-cover" />
        ) : (
          <span>{(form.name || "U").slice(0, 1)}</span>
        )}
        {imageUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="animate-spin text-white" />
          </div>
        )}
      </div>
      <IconButton
        icon={<Camera />}
        onClick={() => fileInputRef.current?.click()}
        className="absolute -bottom-2 -right-2 bg-primary text-white border-4 border-white dark:border-neutral-900 shadow-xl"
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
}