import GeneratorHero from "@/app/Components/TestGenerator/GeneratorHero";

import ClassExplorerGrid from "./comp/ClassExplorerGrid";
import { getCatalogStats, listClasses } from "./utils/curriculumData";

export const metadata = {
  title: "PCTB syllabus explorer",
};

export default function GeneratorHomePage() {
  const stats = getCatalogStats();
  const grades = listClasses();

  return (
    <>
      <GeneratorHero stats={stats} />
      <ClassExplorerGrid grades={grades} />
    </>
  );
}
