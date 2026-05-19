import BackBar from "@/app/Components/TestGenerator/BackBar";
import BreadcrumbTrail from "@/app/Components/TestGenerator/BreadcrumbTrail";
import { notFound } from "next/navigation";

import BookGrid from "./comp/BookGrid";
import { getClass } from "../utils/curriculumData";
import { GENERATOR_BASE } from "../utils/paths";

/** @param {{ params: Promise<{ classId: string }> }} args */
export async function generateMetadata({ params }) {
  const { classId } = await params;
  const c = getClass(classId);
  return { title: c ? c.label : "Class" };
}

/** @param {{ params: Promise<{ classId: string }> }} args */
export default async function ClassBooksPage({ params }) {
  const { classId } = await params;
  const schoolClass = getClass(classId);
  if (!schoolClass) notFound();

  return (
    <>
      <BackBar href={GENERATOR_BASE} label="All classes" />
      <BreadcrumbTrail
        items={[
          { label: "Generator", href: GENERATOR_BASE },
          { label: schoolClass.label },
        ]}
      />
      <BookGrid schoolClass={schoolClass} />
    </>
  );
}
