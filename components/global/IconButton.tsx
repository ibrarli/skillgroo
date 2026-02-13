"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface IconButtonProps {
  text?: string;
  icon?: ReactNode;
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
      /* - Changed rounded-lg to rounded-xl
         - Replaced bg-primary with adaptive bg-white/dark shade
         - Added border for better definition in dark mode
      */
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer 
        disabled:opacity-50 disabled:cursor-not-allowed
        bg-white border border-neutral-200 text-neutral-800 hover:bg-neutral-50
        dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-800
        text-sm font-bold shadow-sm active:scale-95
        ${className}
      `}
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