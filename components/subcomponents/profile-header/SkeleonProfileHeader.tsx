"use client";

export default function SkeletonProfileHeader() {
  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-sm animate-pulse">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-neutral-200 dark:bg-neutral-800 shrink-0" />
        <div className="flex-1 w-full space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-3 w-full">
              <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
              <div className="h-5 w-32 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg" />
              <div className="h-4 w-40 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg" />
            </div>
            <div className="h-10 w-10 bg-neutral-100 dark:bg-neutral-800 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-neutral-100 dark:bg-neutral-800/50 rounded" />
                <div className="h-5 w-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-16 bg-neutral-100 dark:bg-neutral-800/50 rounded" />
                <div className="h-5 w-48 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-16 bg-neutral-100 dark:bg-neutral-800/50 rounded" />
              <div className="h-20 w-full bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}