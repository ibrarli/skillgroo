"use client";

import { Edit2, Save, X, Star, Briefcase } from "lucide-react";
import IconButton from "@/components/global/IconButton";

interface ProfileInfoSectionProps {
  profile: any;
  form: any;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  loading: boolean;
  handleSaveData: () => void;
}

export default function ProfileInfoSection({
  profile,
  form,
  isEditing,
  setIsEditing,
  loading,
  handleSaveData,
}: ProfileInfoSectionProps) {
  const totalReviews = profile?.reviews?.length || 0;
  const avgRating =
    totalReviews > 0
      ? (
          profile!.reviews!.reduce(
            (acc: any, rev: any) => acc + rev.rating,
            0,
          ) / totalReviews
        ).toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="space-y-3 w-full max-w-sm">
        {isEditing ? (
          <>
            <input
              value={form.name}
              onChange={(e) => form.setForm({ ...form, name: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border-white/5 border p-3 rounded-2xl font-bold outline-none focus:border-primary/50"
              placeholder="Full Name"
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">
                @
              </span>
              <input
                value={form.username}
                onChange={(e) =>
                  form.setForm({ ...form, username: e.target.value })
                }
                className="w-full bg-neutral-50 dark:bg-neutral-800 border-white/5 border p-3 pl-9 rounded-2xl text-primary font-bold outline-none"
              />
            </div>
            <input
              value={form.title}
              onChange={(e) => form.setForm({ ...form, title: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-800 border-white/5 border p-3 rounded-2xl font-semibold text-sm outline-none"
              placeholder="Professional Title (e.g. Plumber)"
            />
          </>
        ) : (
          <div>
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter">
              {profile?.user?.name || form.name}
            </h2>
            <p className="text-primary font-bold text-lg mb-1">
              @{profile?.user?.username || form.username}
            </p>
            <p className="text-neutral-500 font-bold text-sm flex items-center gap-2">
              <Briefcase size={14} className="text-primary" />{" "}
              {profile?.title || "Professional"}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-yellow-400/10 text-yellow-600 dark:text-yellow-500 px-2 py-1 rounded-lg text-xs font-black">
                <Star size={12} fill="currentColor" /> {avgRating}
              </div>
              <span className="text-neutral-400 text-xs font-bold">
                ({totalReviews} reviews)
              </span>
            </div>
          </div>
        )}
      </div>
      <div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <IconButton
                icon={<X />}
                onClick={() => setIsEditing(false)}
                className="bg-neutral-100 dark:bg-neutral-800 text-white"
              />
              <IconButton
                icon={<Save />}
                onClick={handleSaveData}
                loading={loading}
                className="bg-primary text-white px-6"
              />
            </>
          ) : (
            <IconButton
              icon={<Edit2 />}
              onClick={() => setIsEditing(true)}
              className="bg-neutral-100 dark:bg-neutral-800 text-white"
            />
          )}
        </div>
      </div>
    </div>
  );
}
