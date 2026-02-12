"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface ProfileContextType {
  profile: any | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (status === "authenticated") {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile({
            image: data.image,
            name: data.user?.name,
            email: data.user?.email,
            username: data.username,
          });
        }
      } catch (error) {
        console.error("Error fetching profile context:", error);
      } finally {
        setLoading(false);
      }
    } else if (status === "unauthenticated") {
      setProfile(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [status]);

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};