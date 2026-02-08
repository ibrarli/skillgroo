"use client";

import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import GigCard from "@/components/subcomponents/gigs/GigCard"; // uneditable GigCard

interface PublicGigSectionProps {
  gigs: any[];
  category?: string; // e.g., "Plumbing", "Electrical"
}

export default function PublicGigSection({ gigs, category }: PublicGigSectionProps) {
  const [visibleCount, setVisibleCount] = useState(4); // initial visible gigs

  // Filter gigs by category, supporting multiple categories
  const filteredGigs = useMemo(() => {
    if (!gigs) return [];
    return gigs.filter((gig) => {
      const isActive = gig.status?.toLowerCase() === "active";
      const matchesCategory =
        !category ||
        (gig.category &&
          Array.isArray(gig.category)
            ? gig.category.includes(category)
            : gig.category === category);
      return isActive && matchesCategory;
    });
  }, [gigs, category]);

  if (filteredGigs.length === 0) {
    return (
      <div className="w-full py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2.5rem]">
        <Briefcase className="mx-auto text-neutral-200 mb-3" size={32} />
        <p className="text-neutral-400 font-black uppercase text-[10px] tracking-[0.2em]">
          No {category || "active"} services available
        </p>
      </div>
    );
  }

  // Slice gigs for "Load More" functionality
  const visibleGigs = filteredGigs.slice(0, visibleCount);

  return (
    <section className="w-full relative py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {visibleGigs.map((gig) => {
          const username = gig.profile?.user?.username || "user";

          const cardGig = {
            id: gig.id,
            title: gig.title,
            description: gig.description,
            price: gig.price,
            location: gig.profile?.location || "Remote",
            category: gig.category,
            image: gig.image || "/placeholder-gig.jpg",
            user: {
              username,
              name: gig.profile?.user?.name,
              avatar: gig.profile?.image,
            },
            rating: gig.profile?.reviews?.length
              ? gig.profile.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / gig.profile.reviews.length
              : 0,
            reviews: gig.profile?.reviews?.length || 0,
            status: gig.status,
          };

          return <GigCard key={gig.id} gig={cardGig} editable={false} />;
        })}
      </div>

      {filteredGigs.length > visibleCount && (
        <div className="flex justify-center mt-8">
          <button
            className="px-8 py-3 bg-primary text-white font-black uppercase text-xs rounded-3xl hover:bg-primary/90 transition-all"
            onClick={() => setVisibleCount((prev) => prev + 4)}
          >
            Load More
          </button>
        </div>
      )}
    </section>
  );
}