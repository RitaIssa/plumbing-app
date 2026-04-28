"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, Shield, User, Mail, Loader2 } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type TeamUser = Pick<
  SupabaseUser,
  "id" | "email" | "user_metadata" | "created_at"
>;

function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[11px] font-semibold uppercase tracking-wide border border-blue-200 dark:border-blue-800">
        <Shield className="w-3 h-3" />
        Admin
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[11px] font-semibold uppercase tracking-wide border border-slate-200 dark:border-slate-600">
      <User className="w-3 h-3" />
      Employee
    </span>
  );
}

export default function TeamClient({
  currentUserId,
  initialUsers,
}: {
  currentUserId: string;
  initialUsers: TeamUser[];
}) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMessage(null);

    const res = await fetch("/api/team/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });

    const data = await res.json();

    if (!res.ok) {
      setInviteMessage({ type: "error", text: data.error ?? "Something went wrong." });
    } else {
      setInviteMessage({
        type: "success",
        text: `Invite sent to ${inviteEmail}. They'll receive an email to set up their account.`,
      });
      setInviteEmail("");
      // Refresh the page data to pick up the new pending user
      router.refresh();
    }

    setInviteLoading(false);
  }

  async function handleDelete(userId: string, userEmail: string) {
    if (!confirm(`Remove ${userEmail} from the team? This cannot be undone.`)) return;

    setDeletingId(userId);
    setDeleteError(null);

    const res = await fetch(`/api/team/users/${userId}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      setDeleteError(data.error ?? "Could not remove user.");
      setDeletingId(null);
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setDeletingId(null);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Team members</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage who has access to this app.
          </p>
        </div>
        <button
          onClick={() => {
            setShowInviteForm((v) => !v);
            setInviteMessage(null);
            setInviteEmail("");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Invite employee
        </button>
      </div>

      {/* Invite form */}
      {showInviteForm && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
            Invite a new employee
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            They will receive an email with a link to set up their account.
          </p>
          <form onSubmit={handleInvite} className="flex gap-3">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="employee@example.com"
                autoFocus
                className="w-full pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
              />
            </div>
            <button
              type="submit"
              disabled={inviteLoading}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-700 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              {inviteLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {inviteLoading ? "Sending…" : "Send invite"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInviteForm(false);
                setInviteMessage(null);
                setInviteEmail("");
              }}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
          </form>
          {inviteMessage && (
            <p
              className={`mt-3 text-xs rounded-md px-3 py-2 ${
                inviteMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
              }`}
            >
              {inviteMessage.text}
            </p>
          )}
        </div>
      )}

      {deleteError && (
        <p className="text-xs rounded-md px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
          {deleteError}
        </p>
      )}

      {/* Users table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {users.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No team members yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Role
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Joined
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {users.map((u) => {
                const name = u.user_metadata?.name ?? "";
                const role = u.user_metadata?.role ?? "employee";
                const isCurrentUser = u.id === currentUserId;
                const canRemove = !isCurrentUser && role !== "admin";
                const isDeleting = deletingId === u.id;

                return (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold shrink-0 select-none">
                          {name
                            ? name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
                            : (u.email ?? "?")[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {name || <span className="text-slate-400 dark:text-slate-500 font-normal italic">No name set</span>}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                            (You)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                      {u.email ?? "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={role} />
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                      {new Date(u.created_at).toLocaleDateString("en-AU", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {canRemove && (
                        <button
                          onClick={() => handleDelete(u.id, u.email ?? "")}
                          disabled={isDeleting}
                          title="Remove employee"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          {isDeleting ? "Removing…" : "Remove"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
