"use client";

import { Heading } from "@/components/ui";
import { curriculumClasses } from "@/data/curriculum";
import { ClassCard } from "./ClassCard";

/**
 * Responsive grid of all academic classes.
 */
export function ClassesGrid({ classes = curriculumClasses }) {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <Heading level="h1">Classes</Heading>
        <p className="mt-2 text-body text-neutral-600">
          Choose a class to browse books, chapters, and build your test paper.
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {classes.map((schoolClass) => (
          <li key={schoolClass.id}>
            <ClassCard schoolClass={schoolClass} />
          </li>
        ))}
      </ul>
    </div>
  );
}
