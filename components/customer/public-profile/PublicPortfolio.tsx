import Image from "next/image";
import { ExternalLink, Layers } from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  projectImage: string;
  cost?: number;
}

export default function PublicPortfolio({ items }: { items: PortfolioItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <div>
          <h2 className="text-3xl font-black tracking-tighter italic uppercase text-neutral-900 dark:text-white">
            Portfolio
          </h2>
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mt-1">
            Featured Projects ({items.length})
          </p>
        </div>
        <Layers className="text-primary opacity-20" size={40} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="group relative bg-white dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden border border-neutral-100 dark:border-neutral-800 hover:shadow-2xl transition-all duration-500"
          >
            {/* Image Container */}
            <div className="aspect-[16/11] relative overflow-hidden">
              <Image
                src={item.projectImage}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-neutral-900/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-center p-8 text-center backdrop-blur-sm">
                <p className="text-white/80 text-sm font-medium leading-relaxed mb-6 line-clamp-4">
                  {item.description}
                </p>
                <div className="flex justify-center">
                  <span className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest border border-white/20 px-4 py-2 rounded-xl hover:bg-white hover:text-neutral-900 transition-all">
                    View Project <ExternalLink size={14} />
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="p-7 flex justify-between items-center">
              <div className="space-y-1">
                <h4 className="font-black text-xl text-neutral-900 dark:text-white tracking-tight">
                  {item.title}
                </h4>
                {item.cost && (
                  <p className="text-primary font-bold text-xs uppercase tracking-widest">
                    Project Value • ${item.cost.toLocaleString()}
                  </p>
                )}
              </div>
              <div className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 group-hover:bg-primary group-hover:text-white transition-colors">
                <ExternalLink size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}