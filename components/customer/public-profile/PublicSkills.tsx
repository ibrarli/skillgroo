export default function PublicSkills({ skills }: { skills: any[] }) {
  if (!skills?.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
        Expertise
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 shadow-sm"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </div>
  );
}