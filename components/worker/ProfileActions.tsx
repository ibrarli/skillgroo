"use client";

import { Eye, Share2 } from "lucide-react";
import IconButton from "../global/IconButton";

interface ProfileActionsProps {
  username: string;
}

export default function ProfileActions({ username }: ProfileActionsProps) {
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${username}`;

  const handlePreview = () => {
    window.open(`/${username}`, "_blank");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="flex justify-end gap-3 ">
      <IconButton 
        text="Preview" 
        icon={<Eye size={18} />} 
        onClick={handlePreview} 
      />
      <IconButton 
        text="Share" 
        icon={<Share2 size={18} />} 
        onClick={handleShare} 
      />
    </div>
  );
}