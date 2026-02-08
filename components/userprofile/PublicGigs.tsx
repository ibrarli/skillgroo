"use client";

import { Briefcase } from "lucide-react";
import GigCard from "@/components/subcomponents/gigs/GigCard";
import GigSkeleton from "@/components/subcomponents/gigs/GigSkeleton";

interface PublicGigsProps {
  gigs: any[];
  loading?: boolean;
}

export default function PublicGigs({ gigs, loading }: PublicGigsProps) {
  if (loading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight italic">Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => <GigSkeleton key={idx} />)}
        </div>
      </section>
    );
  }

  if (!gigs || gigs.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-black tracking-tight italic">Services</h2>
        <div className="w-full py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2.5rem]">
          <Briefcase className="mx-auto text-neutral-200 mb-3" size={32} />
          <p className="text-neutral-400 font-black uppercase text-[10px] tracking-[0.2em]">No services available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-black tracking-tight italic">Services</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {gigs.map((gig) => {
          // Use nested profile/user if it exists, otherwise fall back gracefully
          const gigProfile = gig.profile;
          const gigUser = gig.profile?.user;

          const cardGig = {
            id: gig.id,
            title: gig.title,
            description: gig.description,
            price: gig.price,
            location: gigProfile?.location || "Remote",
            category: gig.category,
            image: Array.isArray(gig.images) && gig.images.length > 0 
              ? gig.images[0] 
              : (gig.image || "/placeholder-gig.jpg"),
            
            user: {
              // Now that we fixed the page query, gigUser should NOT be null
              username: gigUser?.username || "user",
              name: gigUser?.name || "Professional",
              avatar: gigProfile?.image || gigUser?.image || null, 
            },

            rating: gigProfile?.reviews?.length
              ? gigProfile.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / gigProfile.reviews.length
              : 5.0,
            reviews: gigProfile?.reviews?.length || 0,
            status: gig.status,
          };

          return <GigCard key={gig.id} gig={cardGig} editable={false} />;
        })}
      </div>
    </section>
  );
}