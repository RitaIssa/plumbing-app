"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-3 pr-10 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function checkStrength(password: string) {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = checkStrength(password);
  const allMet = Object.values(strength).every(Boolean);
  const passwordsMatch = confirm.length === 0 || password === confirm;
  const canSubmit = allMet && confirm.length > 0 && password === confirm;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <svg width="36" height="36" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect width="70" height="70" rx="14" fill="#1e3a5f"/>
            <rect x="18" y="14" width="34" height="9" rx="4" fill="white"/>
            <rect x="18" y="14" width="9" height="22" rx="4" fill="white"/>
            <rect x="18" y="27" width="34" height="9" rx="4" fill="white"/>
            <rect x="43" y="27" width="9" height="22" rx="4" fill="white"/>
            <rect x="18" y="40" width="34" height="9" rx="4" fill="white"/>
          </svg>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">SupplyBase</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Business Manager</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Set new password</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose a strong password for your account.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New password field with show/hide toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength requirements checklist — visible once the user starts typing */}
              {password.length > 0 && (
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
            </div>

            {/* Confirm password field with show/hide toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={
                    !passwordsMatch
                      ? inputClass.replace(
                          "border-slate-300 dark:border-slate-600",
                          "border-red-400 dark:border-red-500"
                        ).replace("focus:ring-blue-500", "focus:ring-red-400")
                      : inputClass
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Inline mismatch message — only shown after the user has typed something */}
              {!passwordsMatch && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">Passwords do not match.</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
          <Link href="/login" className="text-blue-500 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
