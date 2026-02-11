import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  History 
} from "lucide-react";

export default function TransactionTable({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center">
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-full mb-4">
          <History size={24} className="text-neutral-400" />
        </div>
        <p className="text-neutral-400 font-black uppercase text-[10px] tracking-widest">
          No transactions yet. Time to get to work!
        </p>
      </div>
    );
  }

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "DEPOSIT":
      case "INCOME":
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-500",
          icon: <ArrowDownLeft size={14} />,
          prefix: "+"
        };
      case "WITHDRAWAL":
        return {
          bg: "bg-rose-500/10",
          text: "text-rose-500",
          icon: <ArrowUpRight size={14} />,
          prefix: "-"
        };
      default:
        return {
          bg: "bg-neutral-100 dark:bg-neutral-800",
          text: "text-neutral-500",
          icon: <Clock size={14} />,
          prefix: ""
        };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-2 px-8">
        <thead>
          <tr className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <th className="pb-4 pl-4">Date</th>
            <th className="pb-4">Activity</th>
            <th className="pb-4">Status</th>
            <th className="pb-4 text-right pr-4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const style = getTypeStyle(tx.type);
            return (
              <tr 
                key={tx.id} 
                className="group bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-white dark:hover:bg-neutral-800 transition-all"
              >
                {/* DATE */}
                <td className="py-5 pl-4 rounded-l-[1.5rem] first-letter:">
                  <div className="flex flex-col">
                    <span className="text-sm font-black dark:text-white">
                      {new Date(tx.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[10px] text-neutral-400 uppercase font-bold">
                      {new Date(tx.createdAt).getFullYear()}
                    </span>
                  </div>
                </td>

                {/* DESCRIPTION */}
                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${style.bg} ${style.text}`}>
                      {style.icon}
                    </div>
                    <span className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                      {tx.description}
                    </span>
                  </div>
                </td>

                {/* STATUS */}
                <td className="py-5">
                  <div className="flex items-center gap-1.5">
                    {tx.status === "COMPLETED" ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <Clock size={14} className="text-amber-500" />
                    )}
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      tx.status === "COMPLETED" ? "text-emerald-500" : "text-amber-500"
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </td>

                {/* AMOUNT */}
                <td className={`py-5 text-right pr-4 rounded-r-[1.5rem] font-black text-lg ${style.text}`}>
                  {style.prefix}${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}