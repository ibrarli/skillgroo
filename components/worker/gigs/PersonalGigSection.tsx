"use client";

import { useEffect, useState } from "react";
import GigModal from "./GigModal";
import Image from "next/image";
import IconButton from "../../global/IconButton";
import { Briefcase, Edit3, Trash2, Plus, Loader2 } from "lucide-react";

interface Gig {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category?: string;
  status?: string;
  image?: string;
}

export default function PersonalGigSection() {
  const [gigs, setGigs] = useState<Gig[]>([]);
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

  useEffect(() => { fetchGigs(); }, []);

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
    await fetch(`/api/gigs/${gigId}`, { method: "DELETE" });
    fetchGigs();
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><Briefcase size={24} /></div>
          <h2 className="text-2xl font-bold dark:text-white">My Gigs</h2>
        </div>

        {/* Replaced button with IconButton */}
        <IconButton
          text="Add New Gig"
          icon={<Plus size={18} />}
          onClick={handleAddNew}
        />
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center text-neutral-400 gap-3">
          <Loader2 className="animate-spin" />
        </div>
      ) : gigs.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-3xl text-neutral-500">
          No gigs found. Add your first service!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div key={gig.id} className="group bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-sm flex flex-col transition-all hover:shadow-md">
              <div className="h-44 w-full relative bg-neutral-100 dark:bg-neutral-900">
                {gig.image ? (
                  <Image src={gig.image} alt={gig.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300">
                    <Briefcase size={40} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 py-1 rounded-full text-primary font-black text-sm shadow-sm">
                  ${gig.price}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-neutral-800 dark:text-white text-lg truncate mb-1">{gig.title}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">{gig.description}</p>

                <div className="flex gap-2 mt-auto pt-4 border-t border-neutral-50 dark:border-neutral-700/50">
                  <button
                    onClick={() => handleEdit(gig)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 text-xs font-bold hover:bg-primary hover:text-white transition-all"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gig.id)}
                    className="p-2.5 rounded-xl border border-red-50 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
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