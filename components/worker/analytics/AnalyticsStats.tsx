export default function AnalyticsStats({ title, value, icon, color }: any) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 
        ${color === 'blue' ? 'bg-blue-50 text-blue-500' : ''}
        ${color === 'purple' ? 'bg-purple-50 text-purple-500' : ''}
        ${color === 'emerald' ? 'bg-emerald-50 text-emerald-500' : ''}
        ${color === 'primary' ? 'bg-primary/10 text-primary' : ''}
      `}>
        {icon}
      </div>
      <p className="text-xs font-black text-neutral-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-neutral-900 dark:text-white mt-1">{value}</h3>
    </div>
  );
}