"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import type { ActionState } from "@/lib/action-error";

const inputClass =
  "w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

type DefaultValues = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  website?: string | null;
};

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: DefaultValues;
  submitLabel?: string;
};

export default function SupplierForm({ action, defaultValues = {}, submitLabel = "Save Supplier" }: Props) {
  const [state, formAction] = useFormState(action, null);

  return (
    <form action={formAction} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-5">
      {state?.error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
          {state.error}
        </div>
      )}

      {/* Name — full width */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Supplier Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. ABC Plumbing Supplies"
          defaultValue={defaultValues.name}
          className={inputClass}
        />
      </div>

      {/* Email | Phone — 2 columns */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="contact@supplier.com"
            defaultValue={defaultValues.email ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Phone <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g. 02 9000 0000"
            defaultValue={defaultValues.phone ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      {/* Address — full width */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Address <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          placeholder="123 Example St, Sydney NSW 2000"
          defaultValue={defaultValues.address ?? ""}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Website — full width */}
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Website <span className="text-slate-400 text-xs font-normal">(optional — logo will be fetched automatically)</span>
        </label>
        <input
          id="website"
          name="website"
          type="url"
          placeholder="https://supplier.com.au"
          defaultValue={defaultValues.website ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={submitLabel} loadingLabel="Saving…" />
        <Link href="/suppliers" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
          Cancel
        </Link>
      </div>
    </form>
  );
}
