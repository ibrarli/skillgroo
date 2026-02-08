"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Loader2, Edit2 } from "lucide-react";

interface IconButtonProps {
  text?: string;
  icon?: ReactNode; // can be a component or JSX
  href?: string;
  onClick?: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

export default function IconButton({
  text,
  icon,
  href,
  onClick,
  className = "",
  loading = false,
  disabled = false,
}: IconButtonProps) {
  const content = (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-neutral-800 text-sm font-medium hover:bg-black hover:text-neutral-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={18} />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {text && <span>{text}</span>}
    </button>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}