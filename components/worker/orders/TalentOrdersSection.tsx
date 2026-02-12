"use client";

import { useState } from "react";
import Header from "@/components/global/Header";
import Sidebar from "@/components/worker/Sidebar";
import OrderCard from "@/components/subcomponents/orders/OrderCard"; 
import { 
  Briefcase, 
  PackageSearch, 
  MessageSquareQuote, 
  History, 
  CheckCircle,
} from "lucide-react";

interface Props {
  incoming: any[];
  active: any[];
  completed: any[];
  rejected: any[];
}

export default function TalentOrdersSection({ incoming, active, completed, rejected }: Props) {
  const [activeTab, setActiveTab] = useState(active.length > 0 ? "active" : "pending");

  const tabs = [
    { id: "pending", label: "Proposals", icon: <MessageSquareQuote size={14} />, count: incoming.length, color: "text-blue-500" },
    { id: "active", label: "Active", icon: <Briefcase size={14} />, count: active.length, color: "text-green-500" },
    { id: "completed", label: "Completed", icon: <CheckCircle size={14} />, count: completed.length, color: "text-indigo-500" },
    { id: "rejected", label: "Cancelled", icon: <History size={14} />, count: rejected.length, color: "text-neutral-500" },
  ];

  return (
    /* Changed bg-neutral-50 dark:bg-neutral-950 to bg-background */
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 ml-24 p-8 pt-24">
          <div className="max-w-full mx-auto space-y-8 pb-20">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/10 pb-6">
              <div className="space-y-1">
                <h1 className="text-4xl font-black text-foreground">Orders</h1>
              </div>

              {/* Tab Switcher */}
              <div className="flex items-center gap-1 p-1 bg-foreground/[0.03] rounded-2xl border border-foreground/5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id 
                        ? "bg-background text-foreground shadow-sm ring-1 ring-foreground/5" 
                        : "text-neutral-500 hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <span className={activeTab === tab.id ? tab.color : ""}>{tab.icon}</span>
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-1 px-1.5 py-0.5 rounded text-[8px] font-bold ${
                        activeTab === tab.id 
                          ? "bg-foreground text-background" 
                          : "bg-foreground/10 text-neutral-500"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Display */}
            <div className="transition-all duration-300">
              {activeTab === "pending" && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
                  {incoming.length > 0 ? incoming.map((p) => <OrderCard key={p.id} proposal={p} role="worker" />) : <EmptyState message="No incoming proposals" />}
                </div>
              )}

              {activeTab === "active" && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
                  {active.length > 0 ? active.map((o) => <OrderCard key={o.id} proposal={o} role="worker" />) : <EmptyState message="No active orders" />}
                </div>
              )}

              {activeTab === "completed" && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
                  {completed.length > 0 ? completed.map((o) => <OrderCard key={o.id} proposal={o} role="worker" />) : <EmptyState message="No completed sales yet" />}
                </div>
              )}

              {activeTab === "rejected" && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
                  {rejected.length > 0 ? rejected.map((p) => <OrderCard key={p.id} proposal={p} role="worker" />) : <EmptyState message="No history found" />}
                </div>
              )}
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    /* Changed bg-white dark:bg-neutral-900/40 to bg-foreground/[0.02] */
    <div className="py-10 flex flex-col items-center justify-center bg-foreground/[0.02] border-2 border-dashed border-foreground/10 rounded-4xl text-center">
      <p className="text-neutral-500 font-black text-sm">{message}</p>
    </div>
  );
}