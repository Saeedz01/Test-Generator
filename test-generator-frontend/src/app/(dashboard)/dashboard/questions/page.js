import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function LegacyQuestionsPage() {
  redirect(ROUTES.CLASSES);
}
