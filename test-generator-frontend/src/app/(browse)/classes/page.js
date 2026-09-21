import { pageMetadata } from "@/constants/seo";
import { ClassesGrid } from "./features";

export const metadata = pageMetadata({
  title: "Classes",
  description:
    "Browse every class in the Testora library and open its books to pick questions for a test paper.",
  path: "/classes",
});

export default function ClassesPage() {
  return <ClassesGrid />;
}
