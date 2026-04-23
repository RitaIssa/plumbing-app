"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import type { ActionState } from "@/lib/action-error";

const inputClass =
  "w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

type DefaultValues = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  type?: "RETAIL" | "TRADE";
};

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: DefaultValues;
  submitLabel?: string;
};

export default function AccountForm({ action, defaultValues = {}, submitLabel = "Save Account" }: Props) {
  const [state, formAction] = useFormState(action, null);

  // Extract plain string primitives from state so JSX never accidentally renders the object itself.
  const errorMessage = state?.error ?? null;   // string | null
  const errorField   = state?.field  ?? null;  // string | null

  return (
    <form action={formAction} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
      {/* Generic top-of-form alert — only shown when the error is not tied to a specific field */}
      {errorMessage !== null && errorField === null && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Account name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. John Smith or Smith Plumbing Pty Ltd"
          defaultValue={defaultValues.name}
          className={inputClass}
        />
      </div>

      {/* Account type — RETAIL or TRADE */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Account Type <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="RETAIL"
              defaultChecked={defaultValues.type !== "TRADE"}
              className="accent-blue-600"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Retail</strong> — public customer, pays retail price
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="type"
              value="TRADE"
              defaultChecked={defaultValues.type === "TRADE"}
              className="accent-blue-600"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Trade</strong> — trade professional, pays trade price
            </span>
          </label>
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Email <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="customer@email.com"
          defaultValue={defaultValues.email ?? ""}
          className={inputClass}
        />
        {errorField === "email" && errorMessage !== null && (
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errorMessage}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Phone <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="e.g. 0400 000 000"
          defaultValue={defaultValues.phone ?? ""}
          className={inputClass}
        />
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Address <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          placeholder="Delivery / billing address"
          defaultValue={defaultValues.address ?? ""}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={submitLabel} loadingLabel="Saving…" />
        <Link href="/accounts" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
          Cancel
        </Link>
      </div>
    </form>
  );
}
