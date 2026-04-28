"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import type { ActionState } from "@/lib/action-error";

const inputClass =
  "w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const priceInputClass =
  "w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-7 pr-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

type Supplier = { id: number; name: string };

type DefaultValues = {
  name?: string;
  description?: string | null;
  sku?: string | null;
  supplierId?: number;
  costPrice?: number;
  retailPrice?: number;
  tradePrice?: number;
  stockQuantity?: number;
};

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  suppliers: Supplier[];
  defaultValues?: DefaultValues;
  submitLabel?: string;
};

export default function ProductForm({ action, suppliers, defaultValues = {}, submitLabel = "Save Product" }: Props) {
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

      {/* Product name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Product Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="e.g. Copper Elbow 15mm"
          defaultValue={defaultValues.name}
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Description <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          placeholder="Brief description of the product"
          defaultValue={defaultValues.description ?? ""}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* SKU */}
      <div>
        <label htmlFor="sku" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          SKU <span className="text-slate-400 text-xs font-normal">(optional — must be unique)</span>
        </label>
        <input
          id="sku"
          name="sku"
          type="text"
          placeholder="e.g. CU-ELB-15"
          defaultValue={defaultValues.sku ?? ""}
          className={`${inputClass} font-mono`}
        />
        {errorField === "sku" && errorMessage !== null && (
          <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errorMessage}</p>
        )}
      </div>

      {/* Stock Quantity */}
      <div>
        <label htmlFor="stockQuantity" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Stock Quantity
        </label>
        <input
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          min="0"
          step="1"
          required
          placeholder="0"
          defaultValue={defaultValues.stockQuantity ?? 0}
          className={inputClass}
        />
        <p className="text-xs text-slate-400 mt-1">How many units are currently in stock</p>
      </div>

      {/* Supplier selector */}
      <div>
        <label htmlFor="supplierId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Supplier <span className="text-red-500">*</span>
        </label>
        <select
          id="supplierId"
          name="supplierId"
          required
          disabled={suppliers.length === 0}
          defaultValue={defaultValues.supplierId}
          className={inputClass}
        >
          {!defaultValues.supplierId && <option value="">Select a supplier…</option>}
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pricing */}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          Pricing <span className="text-red-500">*</span>
        </p>
        <div className="grid grid-cols-3 gap-4">
          {(
            [
              { id: "costPrice", label: "Cost Price", hint: "What you pay", value: defaultValues.costPrice },
              { id: "retailPrice", label: "Retail Price", hint: "Public customers", value: defaultValues.retailPrice },
              { id: "tradePrice", label: "Trade Price", hint: "Trade accounts", value: defaultValues.tradePrice },
            ] as const
          ).map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                {field.label}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  id={field.id}
                  name={field.id}
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  defaultValue={field.value !== undefined ? field.value.toFixed(2) : undefined}
                  className={priceInputClass}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">{field.hint}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <SubmitButton label={submitLabel} loadingLabel="Saving…" disabled={suppliers.length === 0} />
        <Link href="/products" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
          Cancel
        </Link>
      </div>
    </form>
  );
}
