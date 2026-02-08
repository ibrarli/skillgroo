"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import ExperienceCard from "@/components/subcomponents/experience/Experience Card";
import EducationCard from "@/components/subcomponents/education/EducationCard";

// Updated to match your Prisma Schema exactly
interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  current: boolean;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: Date | null;
  endDate: Date | null;
  current: boolean;
}

interface PublicTimelineProps {
  experiences: Experience[];
  educations: Education[];
}

export default function PublicTimeline({
  experiences = [],
  educations = [],
}: PublicTimelineProps) {
  
  // Update: Accept 'string' to satisfy the ExperienceCard requirement
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const sortItems = (data: any[]) => {
    return [...data].sort((a, b) => {
      const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
      const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
      return dateB - dateA;
    });
  };

  return (
    <section className="space-y-12">
      {/* Experience Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black  flex items-center gap-3">
          <Briefcase size={24} className="text-primary" />
          Experience
        </h2>

        {experiences.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-4xl">
            <p className="text-neutral-400 font-medium">No experience listed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortItems(experiences).map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={{
                  id: exp.id,
                  title: exp.title,
                  company: exp.company,
                  // Convert Date objects to strings for the Card components
                  startDate: exp.startDate ? new Date(exp.startDate).toISOString() : "",
                  endDate: exp.endDate ? new Date(exp.endDate).toISOString() : "",
                  current: exp.current,
                  description: exp.description,
                }}
                activeMenu={null}
                setActiveMenu={() => {}}
                formatDate={formatDate} // Error should vanish now
                uneditable
              />
            ))}
          </div>
        )}
      </div>

      {/* Education Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black  flex items-center gap-3">
          <GraduationCap size={24} className="text-primary" />
          Education
        </h2>

        {educations.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-4xl">
            <p className="text-neutral-400 font-medium">No education listed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortItems(educations).map((edu) => (
              <EducationCard
                key={edu.id}
                edu={{
                  id: edu.id,
                  degree: edu.degree,
                  institution: edu.institution,
                  // Convert Date objects to strings here too
                  startDate: edu.startDate ? new Date(edu.startDate).toISOString() : "",
                  endDate: edu.endDate ? new Date(edu.endDate).toISOString() : "",
                  current: edu.current,
                }}
                activeMenu={null}
                setActiveMenu={() => {}}
                uneditable
                handleEdit={() => {}}
                handleDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}