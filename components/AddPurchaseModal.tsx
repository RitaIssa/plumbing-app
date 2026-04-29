"use client";

import { useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { createPurchase } from "@/app/accounts/purchase-actions";

type Product = {
  id: number;
  name: string;
  stockQuantity: number;
  retailPrice: number;
  tradePrice: number;
};

type Props = {
  accountId: number;
  accountType: "RETAIL" | "TRADE";
  products: Product[];
};

const inputClass =
  "w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export default function AddPurchaseModal({ accountId, accountType, products }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState(todayString);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const selectedProduct =
    selectedProductId !== "" ? products.find((p) => p.id === selectedProductId) ?? null : null;
  const maxQty = selectedProduct?.stockQuantity ?? 999;
  const unitPrice = selectedProduct
    ? accountType === "TRADE"
      ? selectedProduct.tradePrice
      : selectedProduct.retailPrice
    : null;

  function handleOpen() {
    setOpen(true);
    setSelectedProductId("");
    setQuantity(1);
    setDate(todayString());
    setNotes("");
    setError(null);
  }

  function handleClose() {
    if (isPending) return;
    setOpen(false);
    setError(null);
  }

  function handleProductChange(val: string) {
    setSelectedProductId(val ? parseInt(val, 10) : "");
    setQuantity(1);
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedProductId === "") {
      setError("Please select a product.");
      return;
    }
    if (quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }
    if (selectedProduct && quantity > selectedProduct.stockQuantity) {
      setError(`Only ${selectedProduct.stockQuantity} unit${selectedProduct.stockQuantity === 1 ? "" : "s"} in stock.`);
      return;
    }

    const formData = new FormData();
    formData.set("accountId", String(accountId));
    formData.set("productId", String(selectedProductId));
    formData.set("quantity", String(quantity));
    formData.set("date", date);
    formData.set("notes", notes);

    startTransition(async () => {
      const result = await createPurchase(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        router.refresh();
      }
    });
  }

  const availableProducts = products.filter((p) => p.stockQuantity > 0);

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        <ShoppingCart className="w-3.5 h-3.5" />
        Add Purchase
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-w-md border border-slate-200 dark:border-slate-800">
              <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Purchase</h2>
              </div>

              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                {/* Product */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => handleProductChange(e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="">Select a product…</option>
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.stockQuantity} in stock
                      </option>
                    ))}
                    {products
                      .filter((p) => p.stockQuantity === 0)
                      .map((p) => (
                        <option key={p.id} value={p.id} disabled>
                          {p.name} — out of stock
                        </option>
                      ))}
                  </select>
                  {unitPrice !== null && (
                    <p className="text-xs text-slate-400 mt-1">
                      {accountType === "TRADE" ? "Trade" : "Retail"} price: ${unitPrice.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={maxQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className={inputClass}
                    required
                  />
                  {selectedProduct && (
                    <p className="text-xs text-slate-400 mt-1">Max available: {selectedProduct.stockQuantity}</p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Notes <span className="text-slate-400 text-xs font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Any notes about this purchase…"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
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
                    disabled={isPending || selectedProductId === ""}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center gap-2"
                  >
                    {isPending && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    )}
                    {isPending ? "Saving…" : "Save Purchase"}
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
