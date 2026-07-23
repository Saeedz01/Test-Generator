import { redirect } from "next/navigation";
import { ROUTES } from "@/constants";

/** Signup is disabled — send users to login. */
export default function RegisterPage() {
  redirect(ROUTES.LOGIN);
}
