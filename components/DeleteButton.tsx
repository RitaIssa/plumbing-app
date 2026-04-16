"use client";

// DeleteButton — a client component because it needs onClick interactivity.
// The confirmation modal is rendered via createPortal directly on document.body,
// which guarantees it's never clipped or blocked by any ancestor's overflow/z-index.

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type EntityType = "supplier" | "product" | "account";

interface Props {
  id: number;
  entityType: EntityType;
  entityName: string;
}

// Map entity type to its API URL
const apiPathMap: Record<EntityType, string> = {
  supplier: "/api/suppliers",
  product: "/api/products",
  account: "/api/accounts",
};

export default function DeleteButton({ id, entityType, entityName }: Props) {
  const [loading, setLoading] = useState(false);
  // Controls whether the confirmation modal is visible
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Called when the user clicks the "Delete" button in the list
  function handleDeleteClick() {
    setShowModal(true);
  }

  // Called when the user clicks "Cancel" in the modal
  function handleCancel() {
    setShowModal(false);
  }

  // Called when the user clicks the red "Delete" button in the modal
  async function handleConfirm() {
    setShowModal(false);
    setLoading(true);

    try {
      const res = await fetch(`${apiPathMap[entityType]}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Refresh the page to show the updated list
      router.refresh();
    } catch {
      alert("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Delete trigger button in the list row */}
      <button
        onClick={handleDeleteClick}
        disabled={loading}
        className="text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Deleting…" : "Delete"}
      </button>

      {/* Modal rendered via portal directly on document.body —
          this ensures it's never blocked by overflow:hidden or any stacking context */}
      {showModal &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
              <p className="text-gray-800 text-base mb-6">
                Are you sure you want to delete this? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                {/* Cancel button — grey */}
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>

                {/* Confirm delete button — red */}
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
