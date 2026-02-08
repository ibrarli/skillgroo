"use client";

export default function SkeletonSkills() {
  return (
    <div className="flex flex-wrap gap-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-9 w-24 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-full border border-neutral-200 dark:border-neutral-700"
        />
      ))}
    </div>
  );
}