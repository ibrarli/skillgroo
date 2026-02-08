import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  MapPin, 
  Briefcase,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import Header from "@/components/global/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProposalModal from "@/components/customer/orders/ProposalModal";

interface PageProps {
  params: Promise<{ username: string; slug: string }>;
}

export default async function GigDetailsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const { username, slug } = await params;

  // 1. Fetch Profile and Gig based on Username and Slugified Title
  const profile = await prisma.profile.findFirst({
    where: { 
      user: { username: { equals: username, mode: 'insensitive' } } 
    },
    include: { 
      user: true, 
      gigs: true,
      reviews: true 
    },
  });

  if (!profile) return notFound();

  // Find the specific gig matching the slug
  const gig = profile.gigs.find((g) => slugify(g.title) === slug);
  if (!gig) return notFound();

  // 2. Logic Check: Is the viewer the one who created this?
  const isOwner = session?.user?.id === profile.userId;

  // 3. Rating Calculation
  const avgRating = profile.reviews.length > 0 
    ? (profile.reviews.reduce((acc, rev) => acc + rev.rating, 0) / profile.reviews.length).toFixed(1)
    : "New";

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Navigation Breadcrumb */}
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary mb-10 transition-all font-bold group">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs uppercase tracking-widest">Back to marketplace</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* LEFT COLUMN: GIG CONTENT */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Header Info */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/10">
                  {gig.category || "Professional Service"}
                </span>
                <div className="flex items-center gap-1.5 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <Star size={14} className="fill-orange-400 text-orange-400" />
                  <span className="text-xs font-black text-neutral-700 dark:text-neutral-300">
                    {avgRating} <span className="text-neutral-400 font-bold">({profile.reviews.length} reviews)</span>
                  </span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-white leading-[1] tracking-tighter">
                {gig.title}
              </h1>

              <div className="flex items-center gap-4 py-2">
                <div className="w-12 h-12 rounded-full relative overflow-hidden border-2 border-primary">
                  <Image 
                    src={profile.image || "/default-avatar.png"} 
                    alt={profile.user.name || "User"} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-black text-neutral-900 dark:text-white leading-none">
                    {profile.user.name}
                  </p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">@{username}</p>
                </div>
              </div>
            </div>

            {/* Main Image Container */}
            <div className="relative aspect-[16/9] rounded-[3rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 group">
              <Image 
                src={gig.image || "/placeholder-gig.jpg"} 
                alt={gig.title} 
                fill 
                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                priority 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                About this service
                <div className="h-1 w-12 bg-primary rounded-full" />
              </h3>
              <div className="p-10 md:p-14 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-[3.5rem] shadow-sm">
                <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-[1.8] whitespace-pre-wrap font-medium italic">
                  "{gig.description}"
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ACTION PANEL */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              
              {/* Proposal Card */}
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-[3rem] shadow-2xl border-b-8 border-b-primary relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-10">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Estimated Starting From</p>
                      <h3 className="text-6xl font-black text-neutral-900 dark:text-white tracking-tighter">
                        ${gig.price}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800/50 font-black dark:text-white text-xs uppercase tracking-widest">
                      <MessageSquare size={18} className="text-primary"/> 
                      Direct Consultation
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800/50 font-black dark:text-white text-xs uppercase tracking-widest">
                      <ShieldCheck size={18} className="text-primary"/> 
                      Skillgroo Protected
                    </div>
                  </div>

                  {/* PROPOSAL BUTTON & MODAL */}
                  <ProposalModal 
                    gigId={gig.id} 
                    providerId={profile.userId} 
                    basePrice={gig.price} 
                    isOwner={isOwner}
                    isLoggedIn={!!session}
                  />
                  
                  <p className="text-[10px] text-center text-neutral-400 font-bold uppercase tracking-widest mt-6">
                    No payment taken yet
                  </p>
                </div>
              </div>

              {/* Seller Brief Information */}
              <div className="bg-neutral-900 dark:bg-neutral-800/30 p-8 rounded-[3rem] text-white">
                <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 bg-white/10 rounded-2xl">
                      <Briefcase className="text-primary" size={24} />
                   </div>
                   <div>
                      <p className="text-xs font-black uppercase tracking-widest opacity-60">Verified Professional</p>
                      <h4 className="font-black text-xl">{profile.title || "Elite Provider"}</h4>
                   </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm font-bold opacity-80">
                    <MapPin size={16} className="text-primary" />
                    {profile.location || "Remote / Global"}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold opacity-80">
                    <CheckCircle2 size={16} className="text-primary" />
                    Identity Verified
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}