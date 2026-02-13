import { 
  Profile, 
  User, 
  Experience, 
  Education, 
  Skill, 
  Portfolio, 
  Review, 
  Gig 
} from "@prisma/client";

/**
 * RANKING TYPES
 * Defines the available tiers for the platform
 */
export type RankType = "Rookie" | "Pro" | "Master" | "Legend";

/**
 * FULL PROFILE TYPE
 */
export type FullProfile = Profile & {
  user: User;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  portfolio: Portfolio[];
  gigs: Gig[];
  reviews: Review[];
};

/**
 * PROFILE FORM STATE
 */
export interface ProfileFormState {
  name: string;
  username: string;
  title: string;
  about: string;
  location: string;
  languages: string[];
}

/**
 * COMPONENT PROP TYPES
 */
export interface ProfileSectionProps {
  profile: FullProfile;
  rank: RankType; // Added rank here to ensure sub-components get the typed value
  isEditing?: boolean;
}

/**
 * RANKING LOGIC UTILITY
 * Logic to determine rank based on profile data
 */
export const getRankFromProfile = (profile: FullProfile | null): RankType => {
  if (!profile || !profile.reviews || profile.reviews.length === 0) return "Rookie";

  const reviewsCount = profile.reviews.length;
  const avgRating = profile.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount;

  // Thresholds: adjust these as needed
  if (reviewsCount >= 20 && avgRating >= 4.8) return "Legend";
  if (reviewsCount >= 10 && avgRating >= 4.5) return "Master";
  if (reviewsCount >= 3 && avgRating >= 4.0) return "Pro";
  
  return "Rookie";
};