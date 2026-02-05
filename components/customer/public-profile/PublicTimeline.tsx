import { Briefcase, GraduationCap } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export default function PublicTimeline({ 
  items, 
  type 
}: { 
  items: TimelineItem[], 
  type: 'experience' | 'education' 
}) {
  if (!items?.length) return null;

  const Icon = type === 'experience' ? Briefcase : GraduationCap;

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-black tracking-tight italic flex items-center gap-3">
        <Icon size={24} className="text-primary" />
        {type === 'experience' ? 'Experience' : 'Education'}
      </h2>
      
      <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-100 dark:before:bg-neutral-800">
        {items.map((item) => (
          <div key={item.id} className="relative pl-10">
            {/* Timeline Dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white dark:bg-neutral-950 border-2 border-primary z-10" />
            
            <div className="space-y-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                {new Date(item.startDate).getFullYear()} — {item.current ? 'Present' : new Date(item.endDate!).getFullYear()}
              </span>
              <h4 className="text-lg font-black text-neutral-900 dark:text-white leading-tight">
                {item.title}
              </h4>
              <p className="text-sm font-bold text-neutral-500 italic">
                {item.organization}
              </p>
              {item.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}