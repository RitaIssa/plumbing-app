"use client";

// DeleteButton — a client component because it needs onClick interactivity.
// It shows a confirm dialog, then calls the relevant API route to delete the record.
// After deletion, it reloads the page so the list updates.

import { useState } from "react";
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
  const router = useRouter();

  async function handleDelete() {
    // Ask the user to confirm before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete "${entityName}"? This cannot be undone.`
    );
    if (!confirmed) return;

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
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
