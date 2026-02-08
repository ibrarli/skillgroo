"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Eye,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  Star,
} from "lucide-react";

// Child Components
import ProposalDetailModal from "./ProposalDetailModal";
import OrderCompletionModal from "@/components/worker/orders/modal/OrderCompletionModal";
import ReviewDeliveryModal from "@/components/customer/orders/ReviewDeliveryModal";
import RatingModal from "@/components/customer/orders/RatingModal";
import ViewRatingModal from "@/components/worker/orders/modal/ViewRatingModal";

interface OrderCardProps {
  proposal: any;
  role: "customer" | "worker";
}

export default function OrderCard({ proposal, role }: OrderCardProps) {
  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [viewRatingOpen, setViewRatingOpen] = useState(false);

  /* =========================
     SAFER STATUS LOGIC FIX
     ========================= */
  const status = (proposal.status || "").trim().toUpperCase();

  const isSubmitted = status === "SUBMITTED";
  const isCompleted = status === "COMPLETED";
  const isActive =
    status === "ACCEPTED" || status === "IN_PROGRESS" || isSubmitted;

  const hasBeenReviewed = Boolean(proposal.isReviewed);

  /* =========================
     FORMATTING
     ========================= */
  const displayName =
    role === "customer"
      ? `To @${proposal.provider?.username || "Provider"}`
      : `From @${proposal.customer?.username || "User"}`;

  const displayDate = proposal.startDate
    ? new Date(proposal.startDate).toLocaleDateString()
    : new Date(proposal.createdAt).toLocaleDateString();

  const displayHours =
    proposal.estimatedHours || proposal.proposal?.estimatedHours || "N/A";

  return (
    <>
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-4xl flex flex-col md:flex-row items-center gap-6 transition-all hover:border-primary shadow-sm">
        {/* 1. GIG IMAGE */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 shadow-inner">
          <Image
            src={proposal.gig?.image || "/placeholder.jpg"}
            alt="Gig thumbnail"
            fill
            className="object-cover"
          />
        </div>

        {/* 2. MAIN INFO */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-3">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tight ${
                isSubmitted
                  ? "bg-amber-500/10 text-amber-600"
                  : isCompleted
                    ? "bg-green-500/10 text-green-600"
                    : isActive
                      ? "bg-blue-500/10 text-blue-600"
                      : "bg-neutral-500/10 text-neutral-500"
              }`}
            >
              {isSubmitted
                ? "Pending Review"
                : isCompleted
                  ? "Finished"
                  : isActive
                    ? "Active"
                    : "Proposal"}
            </span>

            <span className="text-xs text-neutral-400 font-bold ">
              {displayName}
            </span>
          </div>

          <h3 className="text-xl font-black dark:text-white">
            {proposal.gig?.title || "Untitled Project"}
          </h3>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-neutral-500 text-xs font-bold  ">
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-primary" />
              {proposal.location || "Remote"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-primary" />
              {displayDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-primary" /> {displayHours} Hours
            </span>
          </div>
        </div>

        {/* 3. ACTIONS */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* WORKER ACTIONS */}
            {role === "worker" ? (
              <div className="flex items-center gap-2">
                {isActive && (
                  <button
                    onClick={() => setCompletionModalOpen(true)}
                    disabled={isSubmitted}
                    className={`px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${
                      isSubmitted
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                        : "bg-green-600 text-white hover:scale-105 shadow-lg shadow-green-500/20"
                    }`}
                  >
                    {isSubmitted ? (
                      "Submitted"
                    ) : (
                      <>
                        <CheckCircle2 size={14} />
                        Complete Order
                      </>
                    )}
                  </button>
                )}

                {isCompleted && hasBeenReviewed && (
                  <button
                    onClick={() => setViewRatingOpen(true)}
                    className="px-5 py-3 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                  >
                    <Star size={14} fill="currentColor" />
                    View Rating
                  </button>
                )}

                {isCompleted && !hasBeenReviewed && (
                  <div className="px-5 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Task Done
                  </div>
                )}
              </div>
            ) : (
              /* CUSTOMER ACTIONS */
              <div className="flex items-center gap-2">
                {isSubmitted && (
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="px-5 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/20 animate-pulse hover:animate-none"
                  >
                    <ClipboardCheck size={14} />
                    Review Work
                  </button>
                )}

                {isCompleted && !hasBeenReviewed && (
                  <button
                    onClick={() => setRatingModalOpen(true)}
                    className="px-5 py-3 bg-amber-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-amber-500/20"
                  >
                    <Star size={14} fill="currentColor" />
                    Rate Experience
                  </button>
                )}

                {isCompleted && hasBeenReviewed && (
                  <div className="px-5 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-400 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-green-500" />
                    Feedback Sent
                  </div>
                )}
              </div>
            )}

            {/* VIEW DETAILS BUTTON */}
            <button
              onClick={() => setModalOpen(true)}
              className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl hover:bg-neutral-900 dark:hover:bg-white dark:hover:text-black hover:text-white transition-all text-neutral-500"
              title="Full Details"
            >
              <Eye size={18} />
            </button>
          </div>

          {/* PRICE */}
          <div className="flex flex-col  min-w-30 border-l dark:border-neutral-800 pl-4">
            <p className="text-xs font-black text-neutral-400  mb-1">
              {isCompleted ? "Total Paid" : "Price"}
            </p>
            <p className="text-xl font-black text-primary leading-none">
              ${proposal.offeredPrice || proposal.totalPrice || "0"}
            </p>
          </div>
        </div>
      </div>

      {/* =========================
         MODALS
         ========================= */}

      {modalOpen ? (
        <ProposalDetailModal
          proposal={proposal}
          role={role}
          onClose={() => setModalOpen(false)}
        />
      ) : null}

      {completionModalOpen ? (
        <OrderCompletionModal
          orderId={proposal.id}
          onClose={() => setCompletionModalOpen(false)}
        />
      ) : null}

      {reviewModalOpen ? (
        <ReviewDeliveryModal
          orderId={proposal.id}
          onClose={() => setReviewModalOpen(false)}
        />
      ) : null}

      {ratingModalOpen ? (
        <RatingModal
          order={proposal}
          onClose={() => setRatingModalOpen(false)}
        />
      ) : null}

      {viewRatingOpen ? (
        <ViewRatingModal
          proposal={proposal}
          onClose={() => setViewRatingOpen(false)}
        />
      ) : null}
    </>
  );
}
