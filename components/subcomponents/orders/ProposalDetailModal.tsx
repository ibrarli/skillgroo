"use client";

import { X, Check, Ban, Trash2, Clock, MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import FullImageModal from "@/components/global/FullImageModal";
import IconButton from "@/components/global/IconButton"; // Using your custom IconButton

interface ProposalDetailModalProps {
  proposal: any;
  onClose: () => void;
  role: "customer" | "worker";
}

export default function ProposalDetailModal({ proposal, onClose, role }: ProposalDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const description = proposal.description || proposal.proposal?.description || "No description provided.";
  const hours = proposal.estimatedHours || proposal.proposal?.estimatedHours || "N/A";
  const location = proposal.location || proposal.proposal?.location || "Remote";
  const startDate = proposal.startDate || proposal.proposal?.startDate;
  const price = proposal.offeredPrice || proposal.proposal?.offeredPrice || proposal.price || 0;
  const deadline = proposal.deadlineDays || proposal.proposal?.deadlineDays || "N/A";
  
  const images = proposal.images || proposal.proposal?.images || [];
  const showcaseImage = proposal.showcaseImage || proposal.review?.showcaseImage;

  const handleAction = async (action: "accept" | "reject" | "cancel") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/proposals/${proposal.id}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error("Failed to update proposal");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const isPending = proposal.status === "PENDING";

  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <div className="bg-white dark:bg-neutral-900 w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[3.5rem] border dark:border-neutral-800 shadow-2xl relative flex flex-col">
          
          {/* STICKY HEADER */}
          <div className="p-8 border-b dark:border-neutral-800 flex justify-between items-center bg-white dark:bg-neutral-900 z-20">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {role === "customer" ? "Proposal Sent" : "Service Request"}
                </h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  isPending ? "bg-blue-100 text-blue-600" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                }`}>
                  {proposal.status}
                </span>
              </div>
              <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mt-1">
                ID: {proposal.id.slice(-8)} • {role === "customer" ? `To ${proposal.provider?.name}` : `From ${proposal.customer?.name}`}
              </p>
            </div>
            <button onClick={onClose} className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-2xl hover:scale-105 transition-transform">
              <X size={20} />
            </button>
          </div>

          {/* SCROLLABLE CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              
              {/* LEFT COLUMN: DESCRIPTION & IMAGES (8 COLS) */}
              <div className="lg:col-span-8 space-y-10">
                <section className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] px-1">Project Brief</h3>
                  <div className="p-8 bg-neutral-50 dark:bg-neutral-800/30 rounded-[2.5rem] border border-dashed border-neutral-200 dark:border-neutral-700">
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                      {description}
                    </p>
                  </div>
                </section>

                {(images.length > 0 || showcaseImage) && (
                  <section className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase text-neutral-400 tracking-[0.2em] px-1">Attachments & Visuals</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {images.map((img: string, idx: number) => (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedImage(img)}
                          className="group relative aspect-video rounded-[2rem] overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all cursor-zoom-in shadow-md"
                        >
                          <Image src={img} fill className="object-cover" alt="Attachment" />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="text-white" />
                          </div>
                        </div>
                      ))}
                      {showcaseImage && (
                        <div onClick={() => setSelectedImage(showcaseImage)} className="relative aspect-video rounded-[2rem] overflow-hidden cursor-zoom-in border-2 border-blue-500 shadow-md">
                           <Image src={showcaseImage} fill className="object-cover" alt="Showcase" />
                           <div className="absolute top-3 left-3 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Final Work</div>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>

              {/* RIGHT COLUMN: SPECS, PRICING & ACTIONS (4 COLS) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-0 space-y-6">
                  {/* SPEC GRID */}
                  <div className="grid grid-cols-1 gap-4">
                    <SpecBox icon={<Clock size={16}/>} label="Work Hours" value={`${hours} hrs`} />
                    <SpecBox icon={<Calendar size={16}/>} label="Deadline" value={`${deadline} Days`} />
                    <SpecBox icon={<MapPin size={16}/>} label="Location" value={location} />
                    <SpecBox icon={<Calendar size={16}/>} label="Start Date" value={startDate ? new Date(startDate).toLocaleDateString() : "TBD"} />
                  </div>

                  {/* PRICING BOX */}
                  <div className="p-8 bg-neutral-900 dark:bg-white rounded-[2.5rem] text-white dark:text-black shadow-xl flex flex-col items-center text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Grand Total Offer</p>
                    <div className="text-5xl font-black tracking-tighter mb-1">${price}</div>
                    <p className="text-[9px] font-medium opacity-40 uppercase">Inclusive of platform fees</p>
                  </div>

                  {/* ACTION BUTTONS */}
                  {isPending && (
                    <div className="space-y-3 pt-2">
                      {role === "customer" ? (
                        <IconButton 
                          icon={<Trash2 size={18}/>}
                          text={loading ? "Processing..." : "Withdraw Proposal"}
                          onClick={() => handleAction("cancel")}
                          disabled={loading}
                          className="w-full bg-red-50 dark:bg-red-500/10 text-red-600 border-none"
                        />
                      ) : (
                        <div className="flex flex-col gap-3">
                          <IconButton 
                            icon={<Check size={18}/>}
                            text="Accept & Start Order"
                            onClick={() => handleAction("accept")}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white border-none shadow-lg shadow-blue-500/20"
                          />
                          <IconButton 
                            icon={<Ban size={18}/>}
                            text="Decline Request"
                            onClick={() => handleAction("reject")}
                            disabled={loading}
                            className="w-full border-neutral-200 dark:border-neutral-800 text-red-500"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <FullImageModal 
          src={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </>
  );
}

function SpecBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border dark:border-neutral-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-blue-500 bg-blue-500/10 p-2 rounded-xl">{icon}</div>
        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{label}</span>
      </div>
      <p className="text-sm font-black dark:text-white uppercase tracking-tighter">{value}</p>
    </div>
  );
}