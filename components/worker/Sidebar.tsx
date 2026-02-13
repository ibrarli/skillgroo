"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  UserCircle,
  Briefcase,
  BarChart3,
  Settings,
  ShoppingBag,
  Wallet,
  LogOut,
  Award,
} from "lucide-react";

const navItems = [
  { name: "Profile", icon: UserCircle, path: "/worker" },
  { name: "Gigs", icon: Briefcase, path: "/worker/gigs" },
  { name: "Orders", icon: ShoppingBag, path: "/worker/orders" },
  { name: "Earnings", icon: Wallet, path: "/worker/earnings" },
  { name: "Analytics", icon: BarChart3, path: "/worker/analytics" },
  { name: "Ranking", icon: Award, path: "/worker/ranking" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current URL

  return (
    /* Updated bg-white dark:bg-neutral-950 to bg-background */
    <aside className="fixed left-0 top-16 h-screen w-26 bg-background border-r border-foreground/5 z-50 flex flex-col items-center py-8 transition-colors duration-300">
      {/* Navigation Items */}
      <nav className="flex flex-col gap-4 w-full px-3 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              /* Updated inactive states and hover to use foreground variables */
              className={`
              group relative w-20 flex cursor-pointer flex-col items-center justify-center py-4 rounded-2xl transition-all duration-200
              ${
                isActive
                  ? "bg-neutral-900 text-white shadow-lg shadow-primary/25"
                  : "text-neutral-500 hover:bg-foreground/5 hover:text-foreground"
              }s
              `}
            >
              {/* Icon */}
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 2}
                className={`mb-1.5 transition-all duration-300 ${
                  isActive ? "scale-110" : "group-hover:scale-110"
                }`}
              />

              {/* Label */}
              <span
                className={`text-[10px] font-bold tracking-tight uppercase`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}