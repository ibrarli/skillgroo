"use client";

interface SkeletonEducationProps {
  count?: number;
}

export default function SkeletonEducation({ count = 2 }: SkeletonEducationProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full bg-neutral-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-700 animate-pulse"
        >
          <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded-md w-1/3 mb-3" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-md w-1/4 mb-4" />
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full w-24" />
        </div>
      ))}
    </div>
  );
}