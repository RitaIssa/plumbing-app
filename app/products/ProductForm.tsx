"use client";

import { useFormState } from "react-dom";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";
import ImageUpload from "@/components/ImageUpload";
import type { ActionState } from "@/lib/action-error";

const inputClass =
  "w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const priceInputClass =
  "w-full border border-slate-300 dark:border-slate-700 rounded-lg pl-7 pr-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const CATEGORIES = ["Toilets", "Sinks", "Pipes", "Fittings", "Valves", "Taps", "Showers", "Other"];

type Supplier = { id: number; name: string };

type DefaultValues = {
  name?: string;
  description?: string | null;
  sku?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  supplierId?: number;
  costPrice?: number;
  retailPrice?: number;
  tradePrice?: number;
  stockQuantity?: number;
  width?: number | null;
  height?: number | null;
  depth?: number | null;
  weight?: number | null;
};

type Props = {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  suppliers: Supplier[];
  defaultValues?: DefaultValues;
  submitLabel?: string;
};

export default function ProductForm({ action, suppliers, defaultValues = {}, submitLabel = "Save Product" }: Props) {
  const [state, formAction] = useFormState(action, null);

  const errorMessage = state?.error ?? null;
  const errorField   = state?.field  ?? null;

  return (
    <form action={formAction} className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 space-y-5">
      {errorMessage !== null && errorField === null && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Name | Category — 2 columns */}
      <div className="grid grid-cols-2 gap-5">
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
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Category <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            list="category-suggestions"
            placeholder="e.g. Fittings"
            defaultValue={defaultValues.category ?? ""}
            className={inputClass}
          />
          <datalist id="category-suggestions">
            {CATEGORIES.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Description — full width */}
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

      {/* SKU | Stock Quantity — 2 columns */}
      <div className="grid grid-cols-2 gap-5">
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
        </div>
      </div>

      {/* Supplier — full width */}
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

      {/* Pricing — 3 columns */}
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

      {/* Product image — full width */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Product Image <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </label>
        <ImageUpload defaultUrl={defaultValues.imageUrl} />
      </div>

      {/* Dimensions — 4 columns */}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Dimensions <span className="text-slate-400 text-xs font-normal">(optional)</span>
        </p>
        <p className="text-xs text-slate-400 mb-3">Width, height, and depth in cm. Weight in kg.</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(
            [
              { id: "width", label: "Width (cm)", value: defaultValues.width },
              { id: "height", label: "Height (cm)", value: defaultValues.height },
              { id: "depth", label: "Depth (cm)", value: defaultValues.depth },
              { id: "weight", label: "Weight (kg)", value: defaultValues.weight },
            ] as const
          ).map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type="number"
                step="0.01"
                min="0"
                placeholder="—"
                defaultValue={field.value !== undefined && field.value !== null ? field.value : ""}
                className={inputClass}
              />
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
