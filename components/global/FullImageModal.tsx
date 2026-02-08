"use client";

import Image from "next/image";
import { useEffect } from "react";

// Icons Import
import { X } from "lucide-react";

// Types Declaration
interface FullImageModalProps {
  src: string;
  onClose: () => void;
}

// Main Component
export default function FullImageModal({ src, onClose }: FullImageModalProps) {
  // Optional: close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-200 bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div
        className="relative w-full max-w-6xl max-h-[85vh] aspect-6/4 overflow-hidden rounded-4xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="Large preview"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}
