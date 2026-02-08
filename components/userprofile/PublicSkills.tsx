"use client";

import SkillPill from "@/components/subcomponents/skill/SkillPill"; 

interface Skill {
  id: string;
  name: string;
  level: number;
}

export default function PublicSkills({ skills }: { skills: Skill[] }) {
  if (!skills?.length) {
    return (
      <div className="py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
        <p className="text-neutral-400 font-medium">No skills added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-neutral-400">Expertise</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillPill
            key={skill.id}
            skill={skill}
            uneditable
          />
        ))}
      </div>
    </div>
  );
}