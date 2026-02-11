"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.filter((n: any) => !n.read));
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleAction = async (notification: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic Update
    setNotifications((prev) => prev.filter((n) => n.id !== notification.id));

    try {
      await fetch(`/api/notifications/${notification.id}`, {
        method: "PATCH",
        body: JSON.stringify({ read: true }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Update failed:", err);
    }

    if (!e) {
      setShowDropdown(false);
      // Use the link from DB if it exists, otherwise fallback to logic
      if (notification.link) {
        router.push(notification.link);
      } else {
        const msg = (notification.title + notification.message).toLowerCase();
        const isWorkerTask = msg.includes("received") || msg.includes("new order");
        router.push(isWorkerTask ? "/worker/orders" : "/orders");
      }
    }
  };

  const markAllAsRead = async () => {
    setNotifications([]);
    await fetch("/api/notifications", { method: "PATCH" });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 hover:bg-white/10 rounded-full transition-all"
      >
        <Bell
          className={`w-5 h-5 ${
            notifications.length > 0 ? "text-primary animate-pulse" : "text-white"
          }`}
        />
        {notifications.length > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full border-2 border-black"></span>
        )}
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)} />
          <div className="absolute right-0 mt-4 w-80 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-[110]">
            <div className="p-4 border-b border-neutral-800 flex justify-between items-center bg-neutral-900/50">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                Notifications ({notifications.length})
              </p>
              {notifications.length > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[9px] font-bold text-primary uppercase hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleAction(n)}
                    className="p-4 border-b border-neutral-800 hover:bg-white/5 cursor-pointer flex justify-between items-start gap-3"
                  >
                    <div className="flex-1">
                      <p className="text-[11px] font-bold text-white leading-tight">{n.title}</p>
                      <p className="text-[10px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleAction(n, e)}
                      className="p-1.5 hover:bg-primary/20 rounded-md text-neutral-600 hover:text-primary transition-all"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
                  No unread alerts
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}