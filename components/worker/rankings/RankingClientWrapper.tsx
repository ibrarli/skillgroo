"use client";
import { useState } from "react";
import RankInfoModal from "@/components/worker/rankings/RankInfoModal";

export default function RankingClientWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-sm font-black uppercase tracking-widest text-primary underline underline-offset-8"
      >
        How do ranks work?
      </button>
      <RankInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}