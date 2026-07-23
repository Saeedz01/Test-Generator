import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

export default function DashboardHomePage() {
  redirect(ROUTES.CLASSES);
}
