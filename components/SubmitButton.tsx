"use client";

// SubmitButton — shows a loading state while the form's server action is running.
// Uses useFormStatus which automatically detects when the parent <form> is pending.
// Must be rendered *inside* the <form> element to work.

import { useFormStatus } from "react-dom";

interface Props {
  label: string;
  loadingLabel: string;
  disabled?: boolean;
}

export default function SubmitButton({ label, loadingLabel, disabled }: Props) {
  const { pending } = useFormStatus();
  const isLoading = pending;

  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {isLoading ? loadingLabel : label}
    </button>
  );
}
