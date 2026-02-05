export default function TransactionTable({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-neutral-400 font-medium">No transactions yet. Time to get to work!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-neutral-400 text-xs font-black uppercase border-b dark:border-neutral-800">
            <th className="pb-4">Date</th>
            <th className="pb-4">Description</th>
            <th className="pb-4">Type</th>
            <th className="pb-4 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-neutral-800">
          {transactions.map((tx) => (
            <tr key={tx.id} className="text-sm font-bold">
              <td className="py-4 text-neutral-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
              <td className="py-4 text-neutral-900 dark:text-white">{tx.description}</td>
              <td className="py-4">
                <span className={`px-2 py-1 rounded-md text-[10px] ${
                  tx.type === "INCOME" ? "bg-emerald-100 text-emerald-600" : "bg-neutral-100 text-neutral-600"
                }`}>
                  {tx.type}
                </span>
              </td>
              <td className={`py-4 text-right ${tx.type === "INCOME" ? "text-emerald-500" : "text-neutral-900 dark:text-white"}`}>
                {tx.type === "INCOME" ? "+" : "-"}${tx.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}