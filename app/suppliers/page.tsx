// Suppliers list page — server component fetches data, passes to filterable client table.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SuppliersTable from "@/components/SuppliersTable";

export default async function SuppliersPage() {
  // Select only the fields used by SuppliersTable (no address or updatedAt).
  const suppliers = await prisma.supplier.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      website: true,
      createdAt: true,
      _count: { select: { products: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Suppliers</h1>
        </div>
        <Link
          href="/suppliers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Supplier
        </Link>
      </div>

      <SuppliersTable suppliers={suppliers} />
    </div>
  );
}
