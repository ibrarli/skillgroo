"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function NotificationSettings({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [loading, setLoading] = useState(false);

  const toggleNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        body: JSON.stringify({ notificationsEnabled: !enabled }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setEnabled(!enabled);
        toast.success("Preferences updated");
      }
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-[2.5rem] flex items-center justify-between">
      <div>
        <h3 className="text-lg font-black dark:text-white">Push Notifications</h3>
        <p className="text-sm text-neutral-500 font-medium">Receive alerts for new orders and messages</p>
      </div>
      
      <button 
        onClick={toggleNotifications}
        disabled={loading}
        className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${enabled ? 'bg-primary' : 'bg-neutral-200 dark:bg-neutral-800'}`}
      >
        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}