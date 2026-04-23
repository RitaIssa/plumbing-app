"use client";

// DeleteButton — client component for confirming and executing record deletion.
// The confirmation modal uses createPortal to avoid overflow/z-index clipping.
// Errors are shown inside the modal rather than browser alert() dialogs.

import { useState } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";

type EntityType = "supplier" | "product" | "account";

interface Props {
  id: number;
  entityType: EntityType;
  entityName: string;
}

const apiPathMap: Record<EntityType, string> = {
  supplier: "/api/suppliers",
  product: "/api/products",
  account: "/api/accounts",
};

export default function DeleteButton({ id, entityType, entityName }: Props) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleDeleteClick() {
    setError(null);
    setShowModal(true);
  }

  function handleCancel() {
    setShowModal(false);
    setError(null);
  }

  async function handleConfirm() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiPathMap[entityType]}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        return; // keep modal open to show the error
      }

      window.location.reload();
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleDeleteClick}
        disabled={loading}
        title={`Delete ${entityName}`}
        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-slate-400 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Trash2 className="w-3 h-3" />
        {loading ? "Deleting…" : "Delete"}
      </button>

      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-4 border border-slate-200 dark:border-slate-700">
              <p className="text-slate-800 dark:text-slate-200 text-base mb-4">
                Delete <strong>{entityName}</strong>? This action cannot be undone.
              </p>

              {/* Inline error message — replaces alert() */}
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md px-3 py-2 mb-4">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Deleting…" : error ? "Try Again" : "Delete"}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
