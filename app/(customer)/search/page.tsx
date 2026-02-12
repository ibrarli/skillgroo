"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/global/Header";
import GigCard from "@/components/subcomponents/gigs/GigCard";
import { 
  Loader2, 
  SearchX, 
  ShieldCheck, 
  ChevronDown,
  ArrowUpDown
} from "lucide-react";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  
  const [gigs, setGigs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  // --- FILTER STATES ---
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [sortBy, setSortBy] = useState<"rating" | "price_low" | "price_high">("rating");

  useEffect(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/gigs`);
        const data = await res.json();
        setGigs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Search fetch failed:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearchResults();
  }, [query]);

  // --- ADVANCED FILTER LOGIC ---
  const filteredGigs = useMemo(() => {
    let result = gigs.filter((gig) => {
      const isActive = gig.status?.toLowerCase() === "active";
      const matchesSearch = !query || 
        gig.title.toLowerCase().includes(query.toLowerCase()) || 
        gig.category?.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(gig.category);
      const matchesPrice = gig.price <= maxPrice;

      return isActive && matchesSearch && matchesCategory && matchesPrice;
    });

    return result.sort((a, b) => {
      if (sortBy === "price_low") return a.price - b.price;
      if (sortBy === "price_high") return b.price - a.price;
      const getRating = (g: any) => g.profile?.reviews?.reduce((acc: number, r: any) => acc + r.rating, 0) / (g.profile?.reviews?.length || 1);
      return getRating(b) - getRating(a);
    });
  }, [gigs, query, selectedCategories, maxPrice, sortBy]);

  const visibleGigs = filteredGigs.slice(0, visibleCount);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    /* Updated background to use semantic bg-background */
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Header />
      
      <main className="max-w-7xl mx-auto pt-28 px-4 pb-20">
        {/* Results Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.3em]">
              <ShieldCheck size={14} />
              Skillgroo Verified
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none text-foreground">
              {query ? `Results for "${query}"` : "Explore Services"}
            </h1>
            <p className="text-neutral-500 font-bold text-sm">
              Found {filteredGigs.length} professional services
            </p>
          </div>
          
          {/* Sorting Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-3 px-5 py-3 bg-foreground/[0.03] border border-foreground/10 rounded-2xl transition-all cursor-pointer hover:border-primary">
              <ArrowUpDown size={14} className="text-neutral-400" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer appearance-none pr-4 text-foreground"
              >
                <option value="rating" className="bg-background">Top Rated</option>
                <option value="price_low" className="bg-background">Price: Low to High</option>
                <option value="price_high" className="bg-background">Price: High to Low</option>
              </select>
              <ChevronDown size={14} className="text-neutral-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* SIDEBAR FILTERS (Sticky) */}
          <aside className="lg:w-72 space-y-6 shrink-0 lg:sticky lg:top-24 h-fit">
            <div className="p-7 rounded-[2.5rem] border border-foreground/10 bg-foreground/[0.02] backdrop-blur-xl">
              
              {/* Category Filter */}
              <div className="mb-10">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-6">Service Category</h3>
                <div className="space-y-3">
                  {['Electrical', 'Plumbing', 'Construction', 'HVAC', 'Cleaning', 'Painting'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="peer appearance-none w-5 h-5 border-2 border-foreground/20 rounded-lg checked:bg-primary checked:border-primary transition-all"
                        />
                        <ShieldCheck className="absolute text-background w-3 h-3 left-1 opacity-0 peer-checked:opacity-100 pointer-events-none" />
                      </div>
                      <span className={`text-sm font-bold transition-colors ${selectedCategories.includes(cat) ? 'text-primary' : 'text-neutral-500 group-hover:text-foreground'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Max Price</h3>
                  <span className="text-xs font-black text-primary">${maxPrice}/hr</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="500" 
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-3 text-[9px] font-bold text-neutral-500 uppercase">
                  <span>$20</span>
                  <span>$500+</span>
                </div>
              </div>

              <button 
                onClick={() => { setSelectedCategories([]); setMaxPrice(500); }}
                className="w-full mt-8 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500 hover:text-primary transition-colors border-t border-foreground/5 pt-6"
              >
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* GRID CONTENT */}
          <div className="flex-1">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-neutral-500 gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sourcing Professionals...</span>
              </div>
            ) : filteredGigs.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed border-foreground/10 rounded-[3rem] flex flex-col items-center gap-6 bg-foreground/[0.02]">
                <div className="p-8 bg-foreground/5 rounded-full text-neutral-400">
                  <SearchX size={56} />
                </div>
                <div className="space-y-2">
                  <p className="text-neutral-500 font-black uppercase text-xs tracking-widest">No matching services</p>
                  <button onClick={() => { setSelectedCategories([]); setMaxPrice(500); }} className="text-primary text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4">Reset Search</button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {visibleGigs.map((gig) => {
                  const cardGig = {
                    id: gig.id,
                    title: gig.title,
                    description: gig.description,
                    price: gig.price,
                    location: gig.profile?.location || "Remote",
                    category: gig.category,
                    image: gig.image || "/placeholder-gig.jpg",
                    user: {
                      username: gig.profile?.user?.username || "user",
                      name: gig.profile?.user?.name || "Professional",
                      avatar: gig.profile?.image,
                    },
                    rating: gig.profile?.reviews?.length
                      ? gig.profile.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / gig.profile.reviews.length
                      : 0,
                    reviews: gig.profile?.reviews?.length || 0,
                  };

                  return <GigCard key={gig.id} gig={cardGig} editable={false} />;
                })}
              </div>
            )}

            {filteredGigs.length > visibleCount && (
              <div className="flex justify-center mt-16">
                <button
                  className="px-12 py-4 bg-primary text-background font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-primary/90 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}