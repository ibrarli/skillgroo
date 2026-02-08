"use client";

import { useEffect, useState } from "react";
import GigModal from "./modal/GigModal";
import { Briefcase, Loader2, Filter, Plus } from "lucide-react";
import IconButton from "../../global/IconButton";
import GigCard from "../../subcomponents/gigs/GigCard";

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
  images?: string[];
  user?: { username: string; name?: string; avatar?: string };
  profile?: { user?: { username: string; name?: string }; image?: string };
}

export default function PersonalGigSection() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGigs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/gigs?mine=true");
      const data = await res.json();
      setGigs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const filteredGigs = gigs.filter((gig) => {
    if (filter === "all") return true;
    return gig.status?.toLowerCase() === filter;
  });

  const handleEdit = (gig: Gig) => {
    setSelectedGig(gig);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedGig(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedGig(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    fetchGigs();
  };

  const handleDelete = async (gigId: string) => {
    if (!confirm("Delete this gig?")) return;
    try {
      await fetch(`/api/gigs/${gigId}`, { method: "DELETE" });
      fetchGigs();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filterBtnClasses = (active: boolean) =>
    `px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
      active
        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
    }`;

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
            <Briefcase size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight dark:text-white uppercase">
              My Gigs
            </h2>
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Manage your active services
            </p>
          </div>
        </div>

        <IconButton
          text="Add New Gig"
          icon={<Plus size={18} />}
          onClick={handleAddNew}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-neutral-50 dark:border-neutral-800/50">
        <button
          onClick={() => setFilter("all")}
          className={filterBtnClasses(filter === "all")}
        >
          All Gigs
        </button>
        <button
          onClick={() => setFilter("active")}
          className={filterBtnClasses(filter === "active")}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("inactive")}
          className={filterBtnClasses(filter === "inactive")}
        >
          Inactive
        </button>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center justify-center text-neutral-400 gap-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Loading Services...
          </span>
        </div>
      ) : filteredGigs.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-[2rem] flex flex-col items-center gap-4">
          <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-full text-neutral-300">
            <Filter size={48} />
          </div>
          <p className="text-neutral-500 font-bold uppercase text-xs tracking-widest">
            {filter === "all"
              ? "No gigs found. Add your first service!"
              : `No ${filter} gigs found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGigs.map((gig) => {
            /** * REINFORCED MAPPING LOGIC:
             * We extract the username from any possible nested location 
             * (gig.user or gig.profile.user) to avoid the "user" fallback in GigCard.
             */
            const resolvedUsername = gig.user?.username || gig.profile?.user?.username;
            const resolvedName = gig.user?.name || gig.profile?.user?.name || "Professional";
            const resolvedAvatar = gig.user?.avatar || gig.profile?.image || null;

            const cardGig = {
              ...gig,
              user: {
                username: resolvedUsername, // Passing the actual username string
                name: resolvedName,
                avatar: resolvedAvatar,
              },
              image:
                Array.isArray(gig.images) && gig.images.length > 0
                  ? gig.images[0]
                  : gig.image || "/placeholder-gig.jpg",
            };

            return (
              <GigCard
                key={gig.id}
                gig={cardGig as any}
                onEdit={handleEdit}
                onDelete={handleDelete}
                editable={true}
              />
            );
          })}
        </div>
      )}

      {modalOpen && (
        <GigModal
          gig={selectedGig}
          onSuccess={handleSuccess}
          onClose={handleModalClose}
          forceOpen={modalOpen}
        />
      )}
    </div>
  );
}