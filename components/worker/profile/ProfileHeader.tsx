"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Edit2, Camera, MapPin, Save, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";

interface Profile {
  id?: string;
  userId?: string;
  title?: string | null;
  about?: string | null;
  location?: string | null;
  image?: string | null;
  user: {
    name?: string | null;
    username?: string | null;
    id?: string;
  };
}

const IconButton = ({
  icon: Icon,
  onClick,
  className = "",
  loading = false,
  disabled = false,
}: any) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className={`p-3 rounded-2xl transition-all active:scale-95 flex items-center justify-center disabled:opacity-50 ${className}`}
  >
    {loading ? (
      <Loader2 className="animate-spin" size={20} />
    ) : (
      <Icon size={20} />
    )}
  </button>
);

export default function ProfileHeader({
  profile: initialProfile,
}: {
  profile: Profile | null;
}) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [form, setForm] = useState({
    name: initialProfile?.user?.name || "",
    username: initialProfile?.user?.username || "",
    about: initialProfile?.about || "",
    location: initialProfile?.location || "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setForm({
        name: initialProfile.user?.name || "",
        username: initialProfile.user?.username || "",
        about: initialProfile.about || "",
        location: initialProfile.location || "",
      });
    }
  }, [initialProfile]);

  const handleSuburbSearch = async (val: string) => {
    setForm({ ...form, location: val });
    if (val.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    try {
      const res = await fetch(`/api/suburbs?q=${val}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestions(data.slice(0, 5));
        setShowDropdown(true);
      }
    } catch (e) {
      console.error("Suburb search failed");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("image", compressedFile);
      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData,
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSaveData = async () => {
    setLoading(true);
    setUsernameError("");
    try {
      const userId = profile?.user?.id || profile?.userId;
      const checkRes = await fetch(
        `/api/check-username?username=${form.username}&userId=${userId}`,
      );
      const { available } = await checkRes.json();

      if (!available) {
        setUsernameError("Username is taken");
        setLoading(false);
        return;
      }

      // FIX: Use FormData to match the Backend's req.formData() expectation
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("about", form.about);
      formData.append("location", form.location);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        body: formData, // Browser sets multipart/form-data automatically
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const userInitials = (form.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="relative mx-auto md:mx-0">
          <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-3xl overflow-hidden bg-primary/10 flex items-center justify-center text-primary text-4xl font-black border-4 border-white dark:border-neutral-800 shadow-lg">
            {profile?.image ? (
              <Image
                src={profile.image}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <span>{userInitials}</span>
            )}
            {imageUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="animate-spin text-white" />
              </div>
            )}
          </div>
          <IconButton
            icon={Camera}
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-primary text-white border-4 border-white dark:border-neutral-900 shadow-xl"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-3 w-full max-w-sm">
              {isEditing ? (
                <>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-neutral-50 dark:bg-neutral-800 border-white/5 border p-3 rounded-2xl font-bold outline-none focus:border-primary/50"
                    placeholder="Name"
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">
                      @
                    </span>
                    <input
                      value={form.username}
                      onChange={(e) =>
                        setForm({ ...form, username: e.target.value })
                      }
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border-white/5 border p-3 pl-9 rounded-2xl text-primary font-bold outline-none"
                    />
                    {usernameError && (
                      <p className="text-red-500 text-[10px] uppercase font-black mt-2 ml-2">
                        {usernameError}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter ">
                    {profile?.user?.name || form.name}
                  </h2>
                  <p className="text-primary font-bold text-lg">
                    @{profile?.user?.username || form.username}
                  </p>
                </div>
              )}
            </div>
            <div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <IconButton
                      icon={X}
                      onClick={() => setIsEditing(false)}
                      className="bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                    />
                    <IconButton
                      icon={Save}
                      onClick={handleSaveData}
                      loading={loading}
                      className="bg-primary text-white px-6"
                    />
                  </>
                ) : (
                  <IconButton
                    icon={Edit2}
                    onClick={() => setIsEditing(true)}
                    className="bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <div className="relative w-full max-w-sm">
                <div className="flex items-center bg-neutral-50 dark:bg-neutral-800 border-white/5 border rounded-2xl px-4 py-1">
                  <MapPin size={16} className="text-primary mr-2" />
                  <input
                    value={form.location}
                    onChange={(e) => handleSuburbSearch(e.target.value)}
                    className="w-full bg-transparent p-2 text-sm outline-none font-medium"
                    placeholder="Search Suburb..."
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                </div>
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-100 rounded-2xl shadow-2xl overflow-hidden">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setForm({ ...form, location: s });
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-colors border-b last:border-0 font-semibold"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-neutral-500 font-bold text-sm bg-neutral-50 dark:bg-neutral-800/50 w-fit px-4 py-2 rounded-xl">
                <MapPin size={14} className="text-primary" />{" "}
                {profile?.location || "Australia"}
              </div>
            )}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <h3 className="text-sm font-black  text-neutral-400 mb-4">
                About
              </h3>
              {isEditing ? (
                <textarea
                  value={form.about}
                  onChange={(e) => setForm({ ...form, about: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-800 border-white/5 border p-5 rounded-3xl h-32 text-sm outline-none focus:border-primary/50 font-medium"
                  placeholder="Bio..."
                />
              ) : (
                <p className="text-neutral-500 text-sm leading-relaxed font-medium">
                  {profile?.about || "No bio yet."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
