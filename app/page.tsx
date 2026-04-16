// The root page "/" — redirect straight to the dashboard
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/dashboard");
}
