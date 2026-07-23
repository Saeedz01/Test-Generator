import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

/** Legacy flat route → classes library */
export default function LegacyBooksPage() {
  redirect(ROUTES.CLASSES);
}
