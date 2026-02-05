export default function StatCard({ title, amount, icon, trend }: any) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-7 rounded-[2rem] shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-tight">{title}</p>
        <h3 className="text-3xl font-black text-neutral-900 dark:text-white">${amount.toFixed(2)}</h3>
        <p className="text-xs font-medium text-neutral-400 mt-2">{trend}</p>
      </div>
    </div>
  );
}