"use client";

import { useState } from "react";
import Header from "@/components/global/Header";
import OrderCard from "@/components/subcomponents/orders/OrderCard"; 
import { 
  ShoppingBag, 
  Send, 
  Ban, 
  CheckCircle,
  PackageSearch
} from "lucide-react";

interface Props {
  active: any[];
  completed: any[];
  sent: any[];
  rejected: any[]; // This contains DECLINED and CANCELLED
}

export default function CustomerOrdersSection({ active, completed, sent, rejected }: Props) {
  // Default to active purchases, fallback to sent proposals
  const [activeTab, setActiveTab] = useState(active.length > 0 ? "active" : "sent");

  const tabs = [
    { id: "active", label: "Purchases", icon: <ShoppingBag size={14} />, count: active.length, color: "text-blue-500" },
    { id: "sent", label: "Sent", icon: <Send size={14} />, count: sent.length, color: "text-amber-500" },
    { id: "completed", label: "Completed", icon: <CheckCircle size={14} />, count: completed.length, color: "text-green-500" },
    { id: "rejected", label: "Rejected", icon: <Ban size={14} />, count: rejected.length, color: "text-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex flex-col font-sans">
      <Header />
      <main className="max-w-6xl mx-auto w-full p-8 pt-24 space-y-8 pb-32">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b dark:border-neutral-800 pb-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black dark:text-white tracking-tighter uppercase italic">My Orders</h1>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Tracking your service history</p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-neutral-200/50 dark:bg-neutral-900/50 rounded-2xl border dark:border-neutral-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? "bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm" 
                    : "text-neutral-500 hover:text-neutral-700"
                }`}
              >
                <span className={activeTab === tab.id ? tab.color : ""}>{tab.icon}</span>
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    activeTab === tab.id 
                      ? "bg-black text-white dark:bg-white dark:text-black" 
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
            {activeTab === "active" && (
              active.length > 0 ? active.map((o) => <OrderCard key={o.id} proposal={o} role="customer" />) : <EmptyState message="No active purchases" />
            )}

            {activeTab === "sent" && (
              sent.length > 0 ? sent.map((p) => <OrderCard key={p.id} proposal={p} role="customer" />) : <EmptyState message="No pending proposals" />
            )}

            {activeTab === "completed" && (
              completed.length > 0 ? completed.map((o) => <OrderCard key={o.id} proposal={o} role="customer" />) : <EmptyState message="No completed orders yet" />
            )}

            {activeTab === "rejected" && (
              rejected.length > 0 ? rejected.map((p) => <OrderCard key={p.id} proposal={p} role="customer" />) : <EmptyState message="No rejected or cancelled orders" />
            )}
          </div>
        </div>
        
      </main>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center bg-white dark:bg-neutral-900/40 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-[3rem] text-center">
      <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
        <PackageSearch size={32} className="text-neutral-400" />
      </div>
      <p className="text-neutral-400 font-black uppercase text-[10px] tracking-[0.2em]">{message}</p>
    </div>
  );
}