"use client";

import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface AccountSettingsProps {
  initialEmail: string;
}

export default function AccountSettings({ initialEmail }: AccountSettingsProps) {
  const [email, setEmail] = useState(initialEmail);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [loading, setLoading] = useState<"email" | "password" | null>(null);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("email");
    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) toast.success("Email updated successfully");
      else toast.error("Failed to update email");
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match");
    }
    
    setLoading("password");
    try {
      const res = await fetch("/api/user/settings/password", {
        method: "PATCH",
        body: JSON.stringify(passwords),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        toast.success("Password changed");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        const data = await res.json();
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  const inputStyles = "w-full bg-foreground/[0.03] border border-foreground/10 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary font-bold text-sm text-foreground placeholder:text-neutral-500 transition-all";

  return (
    <div className="space-y-6">
      {/* Email Section */}
      <div className="bg-background border border-foreground/10 p-8 rounded-[2.5rem] shadow-sm">
        <form onSubmit={handleUpdateEmail} className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Mail size={18} />
            </div>
            <h3 className="text-lg font-black text-foreground">Email Address</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputStyles}
              placeholder="your@email.com"
            />
            <button
              disabled={loading === "email" || email === initialEmail}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center min-w-[160px]"
            >
              {loading === "email" ? <Loader2 className="animate-spin" size={18} /> : "Update Email"}
            </button>
          </div>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-background border border-foreground/10 p-8 rounded-[2.5rem] shadow-sm">
        <form onSubmit={handleUpdatePassword} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Lock size={18} />
            </div>
            <h3 className="text-lg font-black text-foreground">Change Password</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase ml-2">Current Password</label>
              <input
                type="password"
                required
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                className={inputStyles}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase ml-2">New Password</label>
              <input
                type="password"
                required
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className={inputStyles}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-neutral-400 uppercase ml-2">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className={inputStyles}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading === "password"}
            className="w-full md:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading === "password" ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}