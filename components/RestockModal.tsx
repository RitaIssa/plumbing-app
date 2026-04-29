"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { restockProduct } from "@/app/products/actions";

interface Props {
  productId: number;
  productName: string;
  currentStock: number;
}

const inputClass =
  "w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default function RestockModal({ productId, productName, currentStock }: Props) {
  const [open, setOpen] = useState(false);
  const [addQty, setAddQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleOpen() {
    setOpen(true);
    setAddQty(1);
    setError(null);
  }

  function handleClose() {
    if (isPending) return;
    setOpen(false);
    setError(null);
  }

  function handleQtyChange(val: string) {
    const n = parseInt(val, 10);
    setAddQty(isNaN(n) ? 0 : Math.max(0, n));
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (addQty < 1) {
      setError("Please enter a quantity of at least 1.");
      return;
    }
    startTransition(async () => {
      const result = await restockProduct(productId, addQty);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  const newTotal = currentStock + (addQty > 0 ? addQty : 0);

  return (
    <>
      <button
        onClick={handleOpen}
        title="Restock"
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      >
        <PackagePlus className="w-3 h-3" />
        Restock
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-800">
              <div className="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-0.5">
                  <PackagePlus className="w-4 h-4 text-blue-500 shrink-0" />
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">Restock Product</h2>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">{productName}</p>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                {/* Current stock display */}
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Current stock</span>
                  <span className="text-sm font-semibold font-mono text-slate-700 dark:text-slate-300">
                    {currentStock} units
                  </span>
                </div>

                {/* Add quantity input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Add stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={addQty || ""}
                    onChange={(e) => handleQtyChange(e.target.value)}
                    placeholder="e.g. 50"
                    className={inputClass}
                    autoFocus
                    required
                  />
                </div>

                {/* New total preview */}
                <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">New total</span>
                  <span className="text-sm font-bold font-mono text-blue-700 dark:text-blue-400">
                    {newTotal} units
                  </span>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isPending}
                    className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || addQty < 1}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
                  >
                    {isPending && (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {isPending ? "Saving…" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
