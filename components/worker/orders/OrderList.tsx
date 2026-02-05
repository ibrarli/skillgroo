"use client";

import Image from "next/image";
import { CheckCircle2, XCircle, Clock, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderList({ orders, type }: { orders: any[], type: 'buying' | 'selling' }) {
  const router = useRouter();

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    router.refresh();
  };

  if (orders.length === 0) return (
    <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-[2.5rem]">
      <p className="text-neutral-400 font-bold">No orders found.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-6 w-full">
            <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden bg-neutral-100 shrink-0">
              <Image src={order.gig.image || "/placeholder.jpg"} alt="" fill className="object-cover" />
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                  order.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                  order.status === 'cancelled' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {order.status}
                </span>
                <span className="text-xs text-neutral-400 font-bold">#{order.id.slice(-6)}</span>
              </div>
              <h3 className="text-lg font-black dark:text-white leading-tight">{order.gig.title}</h3>
              <p className="text-sm font-bold text-neutral-400">
                {type === 'selling' ? `Customer: ${order.customer.name}` : `Seller: ${order.provider.name}`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-8 border-t md:border-t-0 pt-4 md:pt-0 dark:border-neutral-800">
            <div className="text-center md:text-right">
              <p className="text-xs font-black text-neutral-400 uppercase">Amount</p>
              <p className="text-xl font-black text-primary">${order.totalPrice}</p>
            </div>

            {type === 'selling' && order.status === 'pending' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => updateStatus(order.id, 'completed')}
                  className="p-3 bg-emerald-500 text-white rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <CheckCircle2 size={20} />
                </button>
                <button 
                  onClick={() => updateStatus(order.id, 'cancelled')}
                  className="p-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-500 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}
            
            {order.status === 'completed' && (
              <div className="text-emerald-500 flex items-center gap-1 font-black text-xs uppercase italic">
                <CheckCircle2 size={16} /> Delivered
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}