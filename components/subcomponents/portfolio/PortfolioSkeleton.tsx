export  default function PortfolioSkeleton (){
    return(
  <div className="min-w-85 md:min-w-105 shrink-0 bg-neutral-50 dark:bg-neutral-800/40 rounded-[2.5rem] overflow-hidden border border-neutral-100 dark:border-neutral-700/50 animate-pulse">
    <div className="aspect-6/4 w-full bg-neutral-200 dark:bg-neutral-800" />
    <div className="p-6 space-y-4">
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
        <div className="h-3 w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
        <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
      </div>
      <div className="flex justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700/50">
        <div className="flex gap-4">
          <div className="h-8 w-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
          <div className="h-8 w-12 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
    )
}