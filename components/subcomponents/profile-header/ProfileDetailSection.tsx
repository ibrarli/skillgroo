"use client";

import { MapPin, Languages } from "lucide-react";
import { X } from "lucide-react";

interface ProfileDetailsSectionProps {
  profile: any;
  form: any;
  isEditing: boolean;
  handleLangSearch: (val: string) => void;
  showLangDropdown: boolean;
  setShowLangDropdown: (val: boolean) => void;
}

export default function ProfileDetailsSection({
  profile,
  form,
  isEditing,
  handleLangSearch,
  showLangDropdown,
  setShowLangDropdown,
}: ProfileDetailsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-100 dark:border-neutral-800">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Location
          </label>
          {isEditing ? (
            <input
              value={form.location}
              onChange={(e) => form.setForm({ ...form, location: e.target.value })}
              className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl text-sm outline-none"
              placeholder="City, Country"
            />
          ) : (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 font-bold text-sm">
              <MapPin size={14} className="text-primary" /> {profile?.location || "Not set"}
            </div>
          )}
        </div>

        <div className="space-y-2 relative">
          <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Languages
          </label>
          {isEditing ? (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                {form.languages.map((l: string) => (
                  <span
                    key={l}
                    className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    {l}{" "}
                    <X
                      size={10}
                      className="cursor-pointer"
                      onClick={() =>
                        form.setForm({
                          ...form,
                          languages: form.languages.filter((lang: string) => lang !== l),
                        })
                      }
                    />
                  </span>
                ))}
              </div>
              <input
                onChange={(e) => handleLangSearch(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-800 p-3 rounded-xl text-sm outline-none"
                placeholder="Add Language..."
                onBlur={() => setTimeout(() => setShowLangDropdown(false), 200)}
              />
            </>
          ) : (
            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300 font-bold text-sm">
              <Languages size={14} className="text-primary" /> {profile?.languages?.join(", ") || "English"}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          About
        </label>
        {isEditing ? (
          <textarea
            value={form.about}
            onChange={(e) => form.setForm({ ...form, about: e.target.value })}
            className="w-full bg-neutral-50 dark:bg-neutral-800 p-4 rounded-2xl h-32 text-sm outline-none font-medium resize-none"
          />
        ) : (
          <p className="text-neutral-500 text-sm leading-relaxed font-medium">
            {profile?.about || "No bio yet."}
          </p>
        )}
      </div>
    </div>
  );
}