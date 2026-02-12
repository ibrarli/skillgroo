export default function AnalyticsStats({ title, value, icon, color }: any) {
  return (
    /* Updated background and border to semantic variables */
    <div className="bg-background p-6 rounded-[2rem] border border-foreground/10 shadow-sm transition-colors duration-300">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 
        ${color === 'blue' ? 'bg-blue-500/10 text-blue-500' : ''}
        ${color === 'purple' ? 'bg-purple-500/10 text-purple-500' : ''}
        ${color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : ''}
        ${color === 'rose' ? 'bg-rose-500/10 text-rose-500' : ''}
        ${color === 'primary' ? 'bg-primary/10 text-primary' : ''}
      `}>
        {icon}
      </div>
      <p className="text-xs font-black text-neutral-500 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-foreground mt-1">{value}</h3>
    </div>
  );
}