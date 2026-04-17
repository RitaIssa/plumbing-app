"use client";

// Settings page — lets the user update their profile, password, and appearance preferences.

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { User, Lock, Palette, Sun, Moon, Monitor, Check } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function SettingsPage() {
  // Stable client reference across renders
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  // Load the current user on mount
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, [supabase]);

  return (
    <div className="p-8 max-w-2xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account and preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile section */}
        <ProfileSection user={user} />

        {/* Change Password section */}
        <PasswordSection />

        {/* Appearance section */}
        <AppearanceSection />
      </div>
    </div>
  );
}

// --- Profile Section ---

function ProfileSection({ user }: { user: SupabaseUser | null }) {
  const supabase = useMemo(() => createClient(), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Populate fields once user data loads
  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "");
      setEmail(user.email || "");
    }
  }, [user]); // supabase is stable from useMemo, user is the trigger

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const updates: { data?: { name: string }; email?: string } = {
      data: { name },
    };

    // Only include email if it changed
    if (email !== user?.email) {
      updates.email = email;
    }

    const { error } = await supabase.auth.updateUser(updates);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else if (email !== user?.email) {
      setMessage({ type: "success", text: "Profile updated. Check your new email address to confirm the change." });
    } else {
      setMessage({ type: "success", text: "Profile updated successfully." });
    }

    setLoading(false);
  }

  return (
    <SectionCard icon={<User className="w-5 h-5" />} title="Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Display Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Changing your email will send a confirmation link to the new address.
          </p>
        </div>

        <FeedbackMessage message={message} />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </SectionCard>
  );
}

// --- Change Password Section ---

function PasswordSection() {
  const supabase = useMemo(() => createClient(), []);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPass !== confirm) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPass.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setLoading(true);

    // Re-authenticate with current password first to verify identity
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });
      if (signInError) {
        setMessage({ type: "error", text: "Current password is incorrect." });
        setLoading(false);
        return;
      }
    }

    const { error } = await supabase.auth.updateUser({ password: newPass });

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Password updated successfully." });
      setCurrent("");
      setNewPass("");
      setConfirm("");
    }

    setLoading(false);
  }

  return (
    <SectionCard icon={<Lock className="w-5 h-5" />} title="Change Password">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            placeholder="At least 6 characters"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <FeedbackMessage message={message} />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </SectionCard>
  );
}

// --- Appearance Section ---

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const options = [
    { value: "light", label: "Light", Icon: Sun },
    { value: "dark", label: "Dark", Icon: Moon },
    { value: "system", label: "System", Icon: Monitor },
  ] as const;

  return (
    <SectionCard icon={<Palette className="w-5 h-5" />} title="Appearance">
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Choose how PlumbingPro looks for you. Your preference is saved automatically.
      </p>

      {/* Only render the buttons after mount to prevent hydration mismatch */}
      {mounted ? (
        <div className="flex gap-3">
          {options.map(({ value, label, Icon }) => {
            const isSelected = theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      ) : (
        // Placeholder while mounting to prevent layout shift
        <div className="flex gap-3">
          {options.map(({ label }) => (
            <div key={label} className="flex-1 h-20 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 animate-pulse" />
          ))}
        </div>
      )}
    </SectionCard>
  );
}

// --- Shared sub-components ---

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-slate-600 dark:text-slate-400">{icon}</span>
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function FeedbackMessage({
  message,
}: {
  message: { type: "success" | "error"; text: string } | null;
}) {
  if (!message) return null;

  if (message.type === "success") {
    return (
      <p className="text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg px-3 py-2">
        {message.text}
      </p>
    );
  }

  return (
    <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2">
      {message.text}
    </p>
  );
}
