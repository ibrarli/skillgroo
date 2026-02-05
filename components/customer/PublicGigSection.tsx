"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, User as UserIcon, Star, User2 } from "lucide-react";
import IconButton from "../global/IconButton";
import { slugify } from "@/lib/utils";

interface PublicGigSectionProps {
  gigs: any[];
}

export default function PublicGigSection({ gigs }: PublicGigSectionProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gigs.map((gig) => {
          const username = gig.profile?.user?.username || "user";
          const gigSlug = slugify(gig.title);
          
          return (
            <Link 
              href={`/${username}/${gigSlug}`} 
              key={gig.id} 
              className="group flex flex-col bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image 
                  src={gig.image || "/placeholder-gig.jpg"} // Fixes the string | null error
                  alt={gig.title} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-5 right-5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                   <span className="text-primary font-black text-lg">${gig.price}</span>
                </div>
              </div>

              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-1 rounded-md">
                    {gig.category || "Service"}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white mb-3">{gig.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-6">{gig.description}</p>
                
                <div className="mt-auto pt-5 border-t dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full relative overflow-hidden bg-neutral-100">
                      <Image src={gig.profile?.image || "/default-avatar.png"} alt="User" fill className="object-cover" />
                    </div>
                    <div>
                      <p className="text-[12px] font-black">{gig.profile?.user?.name}</p>
                      <p className="text-[10px] text-neutral-400">@{username}</p>
                    </div>
                  </div>
                  <IconButton text="View" icon={<User2 size={14}/>} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}