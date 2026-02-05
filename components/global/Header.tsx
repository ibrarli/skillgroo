"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bell, Check } from "lucide-react"; // Added Check for mark as read icon
import UserProfile from "./UserProfile";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeRole, setActiveRole] = useState<"customer" | "worker">(
    pathname.startsWith("/worker") ? "worker" : "customer",
  );

  // --- Notification Logic ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      // Show only unread notifications in the dropdown
      setNotifications(data.filter((n: any) => !n.read));
    }
  };

  const handleNotificationAction = async (notification: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Mark as read in DB
    await fetch(`/api/notifications/${notification.id}`, {
      method: "PATCH",
      body: JSON.stringify({ read: true }),
      headers: { "Content-Type": "application/json" }
    });

    // Remove from local UI list immediately
    setNotifications(prev => prev.filter(n => n.id !== notification.id));

    // Redirect logic: Worker notifications to /worker/orders, Customer to /orders
    if (!e) { // If clicking the whole notification (not just the icon)
      setShowDropdown(false);
      const isWorkerTask = notification.title.toLowerCase().includes("received") || 
                           notification.title.toLowerCase().includes("new order");
      router.push(isWorkerTask ? "/worker/orders" : "/orders");
    }
  };

  const handleRoleChange = (role: "customer" | "worker") => {
    setActiveRole(role);
    if (role === "customer") {
      router.push("/");
    } else {
      router.push("/worker");
    }
  };

  return (
    <header className="sticky top-0 h-16 z-50 w-full backdrop-blur bg-black/60 ">
      <div className=" mx-auto px-4  flex items-center justify-between h-full">
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
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="relative p-2 hover:bg-primary hover:cursor-pointer rounded-full group"
            >
              <Bell className={`w-5 h-5 group-hover:text-white cursor-alias transition-colors ${notifications.length > 0 ? 'text-primary' : 'text-white'}`} />
              {/* Notification Badge - only shows if unread count > 0 */}
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-4 w-72 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-3 border-b border-neutral-800 bg-neutral-900/50">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Unread Alerts</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div 
                        key={n.id}
                        onClick={() => handleNotificationAction(n)}
                        className="p-4 border-b border-neutral-800 hover:bg-white/5 cursor-pointer flex justify-between items-start group/item"
                      >
                        <div className="flex-1 pr-2">
                          <p className="text-xs font-bold text-white">{n.title}</p>
                          <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                        <button 
                          onClick={(e) => handleNotificationAction(n, e)}
                          className="p-1 hover:bg-primary/20 rounded-md text-neutral-500 hover:text-primary transition-all"
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                      No new alerts
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Toggle */}
          <div className="hidden sm:flex items-center bg-neutral-800 rounded-full p-1 shadow-inner">
            <button
              onClick={() => handleRoleChange("customer")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeRole === "customer"
                  ? "bg-primary text-black shadow-md"
                  : "text-neutral-300 hover:text-neutral-600"
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => handleRoleChange("worker")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeRole === "worker"
                  ? "bg-primary text-black shadow-md"
                  : "text-neutral-300 hover:text-neutral-600"
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