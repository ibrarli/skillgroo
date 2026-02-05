import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { slugify } from "@/lib/utils";
import { ShieldCheck, Clock, ArrowLeft, Star, CheckCircle2, MessageSquare } from "lucide-react";
import Link from "next/link";
import Header from "@/components/global/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import OrderButton from "@/components/worker/orders/OrderButton"; // New Component below

interface PageProps {
  params: Promise<{ username: string; slug: string }>;
}

export default async function GigDetailsPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const { username, slug } = await params;

  const profile = await prisma.profile.findFirst({
    where: { 
      user: { username: { equals: username, mode: 'insensitive' } } 
    },
    include: { user: true, gigs: true },
  });

  if (!profile) return notFound();
  const gig = profile.gigs.find((g) => slugify(g.title) === slug);
  if (!gig) return notFound();

  // Logic: Check if the current user is the owner
  const isOwner = session?.user?.id === profile.userId;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors">
      <Header />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-primary mb-10 transition-all font-bold group">
          <div className="p-2 bg-neutral-100 dark:bg-neutral-900 rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ArrowLeft size={18} />
          </div>
          <span>Back to marketplace</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {/* ... Titles and Image code remains same ... */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">{gig.category || "Service"}</span>
                <div className="flex items-center gap-1 text-orange-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-bold text-neutral-600 dark:text-neutral-400">4.9 (48 reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-neutral-900 dark:text-white leading-[1.1] tracking-tight">{gig.title}</h1>
            </div>

            <div className="relative aspect-[16/10] rounded-[3rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
              <Image src={gig.image || "/placeholder-gig.jpg"} alt={gig.title} fill className="object-cover" priority />
            </div>

            <div className="p-8 md:p-12 bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-[3rem] space-y-6 text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap font-medium">
               {gig.description}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 rounded-[3rem] shadow-xl border-b-4 border-b-primary">
                <div className="flex justify-between items-end mb-8">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Investment</p>
                    <h3 className="text-5xl font-black text-neutral-900 dark:text-white">${gig.price}</h3>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 font-black dark:text-white text-sm"><Clock size={20} className="text-primary"/> 3-5 Days Delivery</div>
                  <div className="flex items-center gap-4 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-700 font-black dark:text-white text-sm"><ShieldCheck size={20} className="text-primary"/> Escrow Secured</div>
                </div>

                {/* New Client-side Order Button */}
                <OrderButton 
                  gigId={gig.id} 
                  providerId={profile.userId} 
                  price={gig.price} 
                  isOwner={isOwner}
                  isLoggedIn={!!session}
                />
              </div>

              {/* ... Seller Brief Card remains same ... */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}