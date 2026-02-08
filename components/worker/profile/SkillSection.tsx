"use client";

import { useEffect, useState } from "react";
import axios from "axios";

// Icons Import
import { Lightbulb, X } from "lucide-react";

// Child Component
import SkillModal from "@/components/worker/profile/modal/SkillModal";
import SkeletonSkills from "../../subcomponents/skill/SkeletonSkills";
import SkillPill from "../../subcomponents/skill/SkillPill";

// Types Declaration
interface Skill {
  id: string;
  name: string;
  level: number;
}

// Main Component
export default function SkillSection() {
  // States
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetching data from Database
  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Deleting Data from Database
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/skills/${id}`);
      setSkills(skills.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mt-6 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Lightbulb size={22} />
          </div>
          <h2 className="text-xl font-bold text-neutral-800 dark:text-white">
            Skills
          </h2>
        </div>
        <SkillModal onAdd={fetchSkills} />
      </div>

      {loading ? (
        <SkeletonSkills />
      ) : skills.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl">
          <p className="text-neutral-400 font-medium">No skills added yet.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <SkillPill
              key={skill.id}
              skill={skill}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
