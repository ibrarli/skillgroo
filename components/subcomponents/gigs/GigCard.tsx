"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, Edit3, Trash2, MapPin, Tag, Eye, Star } from "lucide-react";

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category?: string;
  serviceType?: string;
  status?: string;
  image?: string;
  user?: { 
    username: string;
    name?: string;
    avatar?: string;
  }; 
  rating?: number;
  reviews?: number;
}

interface GigCardProps {
  gig: Gig;
  onEdit?: (gig: Gig) => void;
  onDelete?: (id: string) => void;
  editable?: boolean;
}

export default function GigCard({ gig, onEdit, onDelete, editable = true }: GigCardProps) {
  const router = useRouter();

  const slugify = (text: string) => {
    return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };

  /** * FIX: Check for the username deeper in the object if it's missing 
   * and prioritize any valid string over the generic "user"
   */
  const username = gig.user?.username || "pro"; 
  const titleSlug = slugify(gig.title);

  const handleCardClick = () => {
    if (!editable) {
      router.push(`/${username}/${titleSlug}`);
    }
  };

  return (
    <div 
      className="group bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700/50 rounded-[2rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col cursor-pointer h-full"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="h-52 w-full relative bg-neutral-100 dark:bg-neutral-900 shrink-0">
        {gig.image ? (
          <Image src={gig.image} alt={gig.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-300">
            <Briefcase size={40} />
          </div>
        )}

        <div className="absolute top-4 right-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-1.5 rounded-2xl text-primary font-black text-sm shadow-xl">
          ${gig.price}
        </div>

        {gig.category && (
          <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <Tag size={10} /> {gig.category}
          </div>
        )}

        {editable && (
          <div className={`absolute top-4 left-4 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${gig.status?.toLowerCase() === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Title and Rating Badge Row */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div className="flex-1">
            <h3 className="font-black text-neutral-800 dark:text-white text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {gig.title}
            </h3>
            <div className="flex items-center gap-1.5 text-neutral-400 mt-1">
              <MapPin size={12} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wide">{gig.location}</span>
            </div>
          </div>

          {/* Rating Badge (Opposite side of Title) */}
          <div className="flex items-center gap-1 bg-yellow-400/10 dark:bg-yellow-400/5 px-2.5 py-1 rounded-xl text-yellow-500 dark:text-yellow-400 text-[10px] font-black border border-yellow-400/20 h-fit">
            <Star size={12} fill="currentColor" />
            <span>{gig.rating ? gig.rating.toFixed(1) : "5.0"}</span>
            <span className="opacity-50 text-[8px]">({gig.reviews || 0})</span>
          </div>
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed italic">
          "{gig.description}"
        </p>

        {editable ? (
          <div className="flex gap-3 mt-auto pt-3 border-t border-neutral-50 dark:border-neutral-700/50">
            <Link 
              href={`/${username}/${titleSlug}`} 
              className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye size={16} />
            </Link>
            <button onClick={(e) => { e.stopPropagation(); onEdit?.(gig); }} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95">
              <Edit3 size={14} /> Edit Gig
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete?.(gig.id); }} className="p-3 rounded-2xl border border-red-50 dark:border-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm">
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-auto pt-3 border-t border-neutral-50 dark:border-neutral-700/50 flex flex-col gap-2">
            {/* User Info */}
            <div 
              className="flex items-center gap-3 group/user cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/${username}`);
              }}
            >
              {gig.user?.avatar ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                   <Image src={gig.user.avatar} alt={gig.user.name || username} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center text-neutral-400">
                  <Briefcase size={16} />
                </div>
              )}
              <div className="flex flex-col text-xs">
                <span className="font-bold text-neutral-800 dark:text-white group-hover/user:underline leading-none">
                  {gig.user?.name || "Professional"}
                </span>
                <span className="text-neutral-400 text-[10px]">@{username}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}