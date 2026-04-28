// Team management page — admin only.
// Lists all users, lets admin invite employees and remove them.

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import TeamClient from "./TeamClient";

export default async function TeamPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Double-check: middleware already redirects employees, but keep the guard here too
  if (!user || user.user_metadata?.role !== "admin") {
    redirect("/dashboard");
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.listUsers();

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600 dark:text-red-400">
          Could not load team members. Please try again.
        </p>
      </div>
    );
  }

  return <TeamClient currentUserId={user.id} initialUsers={data.users} />;
}
