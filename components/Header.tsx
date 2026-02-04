"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import UserProfile from "./UserProfile";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<"customer" | "worker">(
    pathname.startsWith("/worker") ? "worker" : "customer",
  );

  const handleRoleChange = (role: "customer" | "worker") => {
    setActiveRole(role);
    if (role === "customer") {
      router.push("/");
    } else {
      router.push("/worker");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur bg-black/80 ">
      <div className=" mx-auto px-4  flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <a href="/" className="flex items-center space-x-2 group">
            <img
              src="/logo-skillgroo-dark.svg"
              alt="logo-skillgroo"
              width="150px"
              height="100px"
            />
          </a>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Notification Icon */}
          <button className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors group">
            <Bell className="w-3 h-3 text-white  group-hover:text-neutral-800 transition-colors" />
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* Role Toggle */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-full p-1 shadow-inner">
            <button
              onClick={() => handleRoleChange("customer")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeRole === "customer"
                  ? "bg-[#0a2065] text-[#0a2065] shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => handleRoleChange("worker")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeRole === "worker"
                  ? "bg-[#0a2065] text-[#0a2065] shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Worker
            </button>
          </div>

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>

      {/* Mobile Role Toggle */}
      <div className="sm:hidden border-t bg-gray-50">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => handleRoleChange("customer")}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeRole === "customer"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => handleRoleChange("worker")}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeRole === "worker"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600"
              }`}
            >
              Worker
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
