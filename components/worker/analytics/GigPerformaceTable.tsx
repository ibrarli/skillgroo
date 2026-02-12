import Image from "next/image";

export default function GigPerformanceTable({ gigs }: { gigs: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        {/* Swapped neutral-50 for foreground/3% */}
        <thead className="bg-foreground/[0.03]">
          <tr className="text-neutral-500 text-[10px] font-black uppercase border-b border-foreground/5">
            <th className="px-8 py-4">Service</th>
            <th className="px-8 py-4">Impressions</th>
            <th className="px-8 py-4">Clicks</th>
            <th className="px-8 py-4">CTR</th>
            <th className="px-8 py-4">Orders</th>
            <th className="px-8 py-4">Cancellation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-foreground/5">
          {gigs.map((gig) => {
            const ctr = gig._count.impressions > 0 
              ? ((gig._count.clicks / gig._count.impressions) * 100).toFixed(1) 
              : "0";
            
            const totalOrders = gig.orders.length;
            const cancelled = gig.orders.filter((o: any) => o.status === 'cancelled').length;
            const cancelRate = totalOrders > 0 ? ((cancelled / totalOrders) * 100).toFixed(1) : "0";

            return (
              /* Swapped hover neutral shades for foreground/2% */
              <tr key={gig.id} className="hover:bg-foreground/[0.02] transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl relative overflow-hidden bg-foreground/10">
                      <Image src={gig.image || "/placeholder.jpg"} alt="" fill className="object-cover" />
                    </div>
                    <span className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {gig.title}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5 font-bold text-neutral-500 dark:text-neutral-400">{gig._count.impressions}</td>
                <td className="px-8 py-5 font-bold text-neutral-500 dark:text-neutral-400">{gig._count.clicks}</td>
                <td className="px-8 py-5 font-bold text-primary">{ctr}%</td>
                <td className="px-8 py-5 font-bold text-neutral-500 dark:text-neutral-400">{totalOrders}</td>
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