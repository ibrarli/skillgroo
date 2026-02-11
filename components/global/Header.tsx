"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import UserProfile from "./UserProfile";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<"customer" | "worker">("customer");

  useEffect(() => {
    setActiveRole(pathname.startsWith("/worker") ? "worker" : "customer");
  }, [pathname]);

  const handleRoleChange = (role: "customer" | "worker") => {
    router.push(role === "customer" ? "/" : "/worker");
  };

  return (
      <header className="fixed top-0 left-0 h-16 z-[100] w-full backdrop-blur-md bg-black/60">
      <div className=" mx-auto px-4  flex items-center justify-between h-full">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <img src="/logo-skillgroo-dark.svg" alt="logo" className="w-[130px] h-auto" />
          </Link>

          {activeRole === "customer" && (
            <Link 
              href="/orders" 
              className={`text-sm transition-colors ${
                pathname === "/orders" ? "text-primary" : "text-white hover:text-neutral-300"
              }`}
            >
              My Orders
            </Link>
          )}
        </div>

        <div className="flex items-center gap-6">
          <NotificationDropdown />

          <div className="hidden sm:flex items-center bg-neutral-900/50 border border-neutral-800 rounded-full p-1">
            {["customer", "worker"].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role as any)}
                className={`px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer duration-300 ${
                  activeRole === role ? "bg-primary text-black" : "text-neutral-500 hover:text-white"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <UserProfile />
        </div>
      </div>
    </header>
  );
}