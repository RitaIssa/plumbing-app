"use client";

import { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  User,
  ShieldCheck,
  Palette,
  Sun,
  Moon,
  Monitor,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

function checkStrength(password: string) {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
}
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type Section = "general" | "security" | "appearance";

export default function SettingsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("general");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, [supabase]);

  const navItems: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "General", icon: <User className="w-4 h-4" /> },
    { id: "security", label: "Security", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="w-4 h-4" /> },
  ];

  return (
    <div className="flex h-full">
      {/* Settings-level sidebar */}
      <aside className="w-52 shrink-0 h-full border-r border-slate-200 dark:border-slate-700/60 flex flex-col bg-slate-50/80 dark:bg-slate-900">
        {/* Back link */}
        <div className="px-4 pt-5 pb-4 border-b border-slate-200 dark:border-slate-700/60">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back to app
          </Link>
        </div>

        {/* Nav group label */}
        <div className="px-4 pt-5 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Account
          </p>
        </div>

        {/* Nav items */}
        <nav className="px-2 space-y-0.5">
          {navItems.map(({ id, label, icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                  isActive
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-white/70 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}>
                  {icon}
                </span>
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900/50">
        <div className="max-w-xl px-8 py-8">
          {activeSection === "general" && <GeneralSection user={user} />}
          {activeSection === "security" && <SecuritySection user={user} />}
          {activeSection === "appearance" && <AppearanceSection />}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// General section
// ---------------------------------------------------------------------------

function GeneralSection({ user }: { user: SupabaseUser | null }) {
  const supabase = useMemo(() => createClient(), []);
  const [editingField, setEditingField] = useState<"name" | "email" | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
    field: "name" | "email";
  } | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  function startEditing(field: "name" | "email") {
    setEditingField(field);
    setMessage(null);
    if (field === "name") setTempName(name);
    if (field === "email") setTempEmail(email);
  }

  function cancelEditing() {
    setEditingField(null);
    setMessage(null);
  }

  async function saveName() {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ data: { name: tempName } });
    if (error) {
      setMessage({ type: "error", text: error.message, field: "name" });
    } else {
      setName(tempName);
      setEditingField(null);
      setMessage({ type: "success", text: "Name updated.", field: "name" });
    }
    setLoading(false);
  }

  async function saveEmail() {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ email: tempEmail });
    if (error) {
      setMessage({ type: "error", text: error.message, field: "email" });
    } else {
      setEditingField(null);
      setMessage({
        type: "success",
        text: "Confirmation link sent to your new address.",
        field: "email",
      });
    }
    setLoading(false);
  }

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : email
    ? email[0].toUpperCase()
    : "?";

  return (
    <div className="space-y-7">
      <SectionHeader title="General" description="Manage your profile information." />

      {/* Your Profile card */}
      <SettingsCard>
        <CardSectionLabel>Your profile</CardSectionLabel>

        {/* Avatar + name/email preview row */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {name || <span className="text-slate-400 dark:text-slate-500 font-normal">No name set</span>}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{email}</p>
          </div>
        </div>

        {/* Name row */}
        <FieldRow
          label="Full name"
          value={name}
          emptyText="Not set"
          isEditing={editingField === "name"}
          onEdit={() => startEditing("name")}
          bordered
        >
          <InlineEditForm
            inputType="text"
            value={tempName}
            onChange={setTempName}
            onSave={saveName}
            onCancel={cancelEditing}
            loading={loading}
            message={message?.field === "name" ? message : null}
            placeholder="Your full name"
          />
        </FieldRow>

        {/* Email row */}
        <FieldRow
          label="Email address"
          value={email}
          isEditing={editingField === "email"}
          onEdit={() => startEditing("email")}
        >
          <InlineEditForm
            inputType="email"
            value={tempEmail}
            onChange={setTempEmail}
            onSave={saveEmail}
            onCancel={cancelEditing}
            loading={loading}
            message={message?.field === "email" ? message : null}
            hint="A confirmation link will be sent to the new address."
            placeholder="you@example.com"
          />
        </FieldRow>

        {/* Success toast outside edit form */}
        {message?.type === "success" && editingField === null && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50">
            <FeedbackMessage message={message} />
          </div>
        )}
      </SettingsCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Security section
// ---------------------------------------------------------------------------

function SecuritySection({ user }: { user: SupabaseUser | null }) {
  const supabase = useMemo(() => createClient(), []);
  const [editingField, setEditingField] = useState<"password" | null>(null);

  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const email = user?.email || "";
  const strength = checkStrength(newPass);
  const allMet = Object.values(strength).every(Boolean);
  const passwordsMatch = confirm.length === 0 || newPass === confirm;
  const canSave = current.length > 0 && allMet && confirm.length > 0 && newPass === confirm;

  async function handleSavePassword(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPass !== confirm) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (!allMet) {
      setMessage({ type: "error", text: "Password does not meet all requirements." });
      return;
    }

    setLoading(true);

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
      setEditingField(null);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-7">
      <SectionHeader title="Security" description="Manage your login credentials." />

      {/* Login card */}
      <SettingsCard>
        <CardSectionLabel>Login</CardSectionLabel>

        {/* Email row — read only with verified badge */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <div>
            <FieldLabel>Email address</FieldLabel>
            <p className="text-sm text-slate-900 dark:text-white mt-0.5">{email || "—"}</p>
          </div>
          <VerifiedBadge />
        </div>

        {/* Password row */}
        {editingField === "password" ? (
          <div className="px-5 py-4">
            <FieldLabel className="mb-3">Change password</FieldLabel>
            <form onSubmit={handleSavePassword} className="space-y-3">
              <PasswordField
                label="Current password"
                value={current}
                onChange={setCurrent}
                show={showCurrent}
                onToggle={() => setShowCurrent((v) => !v)}
                placeholder="Current password"
                autoFocus
              />
              <PasswordField
                label="New password"
                value={newPass}
                onChange={setNewPass}
                show={showNew}
                onToggle={() => setShowNew((v) => !v)}
                placeholder="At least 8 characters"
              >
                {newPass.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {[
                      { met: strength.minLength, label: "At least 8 characters" },
                      { met: strength.hasUppercase, label: "At least one uppercase letter" },
                      { met: strength.hasNumber, label: "At least one number" },
                      { met: strength.hasSpecial, label: "At least one special character (!@#$%^&*)" },
                    ].map(({ met, label }) => (
                      <li key={label} className="flex items-center gap-1.5 text-xs">
                        {met ? (
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        )}
                        <span className={met ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}>
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </PasswordField>
              <PasswordField
                label="Confirm new password"
                value={confirm}
                onChange={setConfirm}
                show={showConfirm}
                onToggle={() => setShowConfirm((v) => !v)}
                placeholder="Repeat new password"
                mismatch={!passwordsMatch}
              >
                {!passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">Passwords do not match.</p>
                )}
              </PasswordField>

              {message && <FeedbackMessage message={message} />}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={loading || !canSave}
                  className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md text-xs font-medium hover:bg-slate-700 dark:hover:bg-slate-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving…" : "Save password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingField(null);
                    setMessage(null);
                    setCurrent("");
                    setNewPass("");
                    setConfirm("");
                  }}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <FieldLabel>Password</FieldLabel>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-sm text-slate-900 dark:text-white">••••••••••</p>
                <ConfiguredBadge />
              </div>
            </div>
            <button
              onClick={() => {
                setEditingField("password");
                setMessage(null);
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Edit
            </button>
          </div>
        )}

        {/* Post-save success message */}
        {message?.type === "success" && editingField === null && (
          <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50">
            <FeedbackMessage message={message} />
          </div>
        )}
      </SettingsCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Appearance section
// ---------------------------------------------------------------------------

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
    <div className="space-y-7">
      <SectionHeader title="Appearance" description="Choose how the app looks for you." />

      <SettingsCard>
        <CardSectionLabel>Theme</CardSectionLabel>
        <div className="px-5 py-4">
          {mounted ? (
            <div className="flex gap-3">
              {options.map(({ value, label, Icon }) => {
                const isSelected = theme === value;
                return (
                  <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`flex-1 flex flex-col items-center gap-2.5 py-4 rounded-lg border text-sm font-medium transition-all duration-150 ${
                      isSelected
                        ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{label}</span>
                    {isSelected && (
                      <span className="w-4 h-4 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex gap-3">
              {["Light", "Dark", "System"].map((label) => (
                <div
                  key={label}
                  className="flex-1 h-20 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 animate-pulse"
                />
              ))}
            </div>
          )}
        </div>
      </SettingsCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">{title}</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
    </div>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      {children}
    </div>
  );
}

function CardSectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-700/50">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {children}
      </p>
    </div>
  );
}

function FieldLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider ${className}`}>
      {children}
    </p>
  );
}

function FieldRow({
  label,
  value,
  emptyText = "—",
  isEditing,
  onEdit,
  bordered = false,
  children,
}: {
  label: string;
  value: string;
  emptyText?: string;
  isEditing: boolean;
  onEdit: () => void;
  bordered?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={bordered ? "border-b border-slate-100 dark:border-slate-700/50" : ""}>
      {isEditing ? (
        <div className="px-5 py-4">{children}</div>
      ) : (
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <FieldLabel>{label}</FieldLabel>
            <p className="text-sm text-slate-900 dark:text-white mt-0.5">
              {value || <span className="text-slate-400 dark:text-slate-500">{emptyText}</span>}
            </p>
          </div>
          <button
            onClick={onEdit}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors shrink-0 ml-4"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

function InlineEditForm({
  inputType,
  value,
  onChange,
  onSave,
  onCancel,
  loading,
  message,
  hint,
  placeholder,
}: {
  inputType: "text" | "email";
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  loading: boolean;
  message: { type: "success" | "error"; text: string } | null;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-3">
      <input
        type={inputType}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
        placeholder={placeholder}
        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
      />
      {hint && <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
      {message && <FeedbackMessage message={message} />}
      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={loading}
          className="px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md text-xs font-medium hover:bg-slate-700 dark:hover:bg-slate-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving…" : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 text-slate-600 dark:text-slate-400 rounded-md text-xs font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  autoFocus,
  mismatch,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  mismatch?: boolean;
  children?: React.ReactNode;
}) {
  const borderClass = mismatch
    ? "border-red-400 dark:border-red-500 focus:ring-red-400"
    : "border-slate-300 dark:border-slate-600 focus:ring-blue-500";

  return (
    <div className="space-y-1">
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          required
          placeholder={placeholder || "••••••••"}
          className={`w-full border rounded-lg px-3 py-2 pr-9 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-shadow ${borderClass}`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {children}
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDF3EC] text-[#346538] dark:bg-green-900/30 dark:text-green-400 text-[10px] font-semibold uppercase tracking-wide">
      <Check className="w-3 h-3" />
      Verified
    </span>
  );
}

function ConfiguredBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E1F3FE] text-[#1F6C9F] dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wide">
      <Check className="w-3 h-3" />
      Configured
    </span>
  );
}

function FeedbackMessage({
  message,
}: {
  message: { type: "success" | "error"; text: string };
}) {
  if (message.type === "success") {
    return (
      <p className="text-xs text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md px-3 py-2">
        {message.text}
      </p>
    );
  }
  return (
    <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md px-3 py-2">
      {message.text}
    </p>
  );
}
