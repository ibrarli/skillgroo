"use client";

export default function GigSkeleton() {
  return (
    <div className="p-6 bg-neutral-100 dark:bg-neutral-900 rounded-[2rem] animate-pulse flex flex-col gap-4 h-[250px]">
      <div className="bg-neutral-200 dark:bg-neutral-800 h-32 w-full rounded-2xl" />
      <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-full" />
      <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6 mt-auto" />
    </div>
  );
}