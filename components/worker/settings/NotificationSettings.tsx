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
    /* Changed bg-white dark:bg-neutral-900 to bg-background */
    <div className="bg-background border border-foreground/10 p-8 rounded-[2.5rem] flex items-center justify-between transition-colors shadow-sm">
      <div>
        {/* Changed dark:text-white to text-foreground */}
        <h3 className="text-lg font-black text-foreground">Push Notifications</h3>
        <p className="text-sm text-neutral-500 font-medium">Receive alerts for new orders and messages</p>
      </div>
      
      <button 
        onClick={toggleNotifications}
        disabled={loading}
        /* Updated 'off' state to bg-foreground/10 for a sleek adaptive look */
        className={`w-14 h-8 rounded-full transition-all flex items-center px-1 disabled:opacity-50 ${
          enabled ? 'bg-primary' : 'bg-foreground/10'
        }`}
      >
        {/* The toggle knob stays bg-white or can be set to bg-background for a more 'integrated' look */}
        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );
}