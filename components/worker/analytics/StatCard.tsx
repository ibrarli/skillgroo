export default function StatCard({ title, amount, icon, trend }: any) {
  return (
    /* Updated background and borders to use semantic variables */
    <div className="bg-background border border-foreground/10 p-7 rounded-[2rem] shadow-sm transition-colors duration-300">
      <div className="flex justify-between items-start mb-4">
        {/* Updated icon container background */}
        <div className="p-3 bg-foreground/[0.03] rounded-2xl">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-tight">
          {title}
        </p>
        {/* Updated text color to foreground */}
        <h3 className="text-3xl font-black text-foreground">
          ${amount.toFixed(2)}
        </h3>
        <p className="text-xs font-medium text-neutral-400 mt-2">
          {trend}
        </p>
      </div>
    </div>
  );
}