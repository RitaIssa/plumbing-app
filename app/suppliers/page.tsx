// Suppliers list page — server component fetches data, passes to filterable client table.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import SuppliersTable from "@/components/SuppliersTable";

export default async function SuppliersPage() {
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Suppliers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{suppliers.length} total</p>
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
