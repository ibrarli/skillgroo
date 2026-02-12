export default function RequirementCard({ icon, data, unit = "", isDecimal = false }: any) {
  const percentage = Math.min((data.current / data.target) * 100, 100);

  return (
    <div className="bg-background border border-foreground/10 p-8 rounded-[2.5rem] space-y-6">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-foreground/5 rounded-2xl text-primary">
          {icon}
        </div>
        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
          {percentage.toFixed(0)}% Done
        </span>
      </div>
      
      <div>
        <p className="text-xs font-bold text-neutral-500 mb-1">{data.label}</p>
        <h4 className="text-2xl font-black">
          {unit}{data.current} <span className="text-neutral-400 text-sm">/ {unit}{data.target}</span>
        </h4>
      </div>

      <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}