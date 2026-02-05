"use client"

import Link from "next/link"
import { HelpCircle } from "lucide-react"
import { ReactNode } from "react"

interface IconButtonProps {
  text?: string
  icon?: ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

export default function IconButton({
  text = "Button",
  icon = <HelpCircle size={18} />,
  href,
  onClick,
  className = "",
}: IconButtonProps) {
  const content = (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg  bg-primary text-neutral-800 text-sm font-medium   hover:bg-black hover:text-neutral-500 transition cursor-pointer ${className}`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span>{text}</span>
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-block">
        {content}
      </Link>
    )
  }

  return content
}