// lib/ranking.ts
import { RankType } from "@/types/profile";

export const calculateRank = (reviewsCount: number, avgRating: number): RankType => {
  if (reviewsCount >= 50 && avgRating >= 4.8) return "Legend";
  if (reviewsCount >= 20 && avgRating >= 4.5) return "Master";
  if (reviewsCount >= 5 && avgRating >= 4.0) return "Pro";
  return "Rookie";
};