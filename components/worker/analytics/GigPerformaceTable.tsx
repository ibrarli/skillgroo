import Image from "next/image";

export default function GigPerformanceTable({ gigs }: { gigs: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-neutral-50 dark:bg-neutral-800/50">
          <tr className="text-neutral-400 text-[10px] font-black uppercase border-b dark:border-neutral-800">
            <th className="px-8 py-4">Service</th>
            <th className="px-8 py-4">Impressions</th>
            <th className="px-8 py-4">Clicks</th>
            <th className="px-8 py-4">CTR</th>
            <th className="px-8 py-4">Orders</th>
            <th className="px-8 py-4">Cancellation</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-neutral-800">
          {gigs.map((gig) => {
            const ctr = gig._count.impressions > 0 
              ? ((gig._count.clicks / gig._count.impressions) * 100).toFixed(1) 
              : "0";
            
            const totalOrders = gig.orders.length;
            const cancelled = gig.orders.filter((o: any) => o.status === 'cancelled').length;
            const cancelRate = totalOrders > 0 ? ((cancelled / totalOrders) * 100).toFixed(1) : "0";

            return (
              <tr key={gig.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <Image src={gig.image || "/placeholder.jpg"} alt="" fill className="object-cover" />
                    </div>
                    <span className="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">{gig.title}</span>
                  </div>
                </td>
                <td className="px-8 py-5 font-bold text-neutral-600 dark:text-neutral-400">{gig._count.impressions}</td>
                <td className="px-8 py-5 font-bold text-neutral-600 dark:text-neutral-400">{gig._count.clicks}</td>
                <td className="px-8 py-5 font-bold text-primary">{ctr}%</td>
                <td className="px-8 py-5 font-bold text-neutral-600 dark:text-neutral-400">{totalOrders}</td>
                <td className="px-8 py-5">
                  <span className={`font-bold ${parseFloat(cancelRate) > 10 ? 'text-red-500' : 'text-neutral-400'}`}>
                    {cancelRate}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}