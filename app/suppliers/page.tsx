// Suppliers list page — shows all suppliers with their contact info and product count.
// Server component: fetches data directly from the database.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function SuppliersPage() {
  // Fetch all suppliers, including a count of their products
  const suppliers = await prisma.supplier.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } }, // adds _count.products to each supplier
    },
  });

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Suppliers</h1>
          <p className="text-slate-500 mt-1">{suppliers.length} total</p>
        </div>
        <Link
          href="/suppliers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Supplier
        </Link>
      </div>

      {/* Empty state */}
      {suppliers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-4xl mb-3">🏭</div>
          <h2 className="text-lg font-semibold text-slate-700">No suppliers yet</h2>
          <p className="text-slate-400 mt-1 mb-4">Add your first supplier to get started.</p>
          <Link href="/suppliers/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Add Supplier
          </Link>
        </div>
      )}

      {/* Suppliers table */}
      {suppliers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* max-h keeps the table within the viewport; thead is sticky so column headers stay visible while scrolling */}
          <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Phone</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Products</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{supplier.name}</td>
                  <td className="px-6 py-4 text-slate-500">{supplier.email || "—"}</td>
                  <td className="px-6 py-4 text-slate-500">{supplier.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      {supplier._count.products} product{supplier._count.products !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/suppliers/${supplier.id}/edit`}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        id={supplier.id}
                        entityType="supplier"
                        entityName={supplier.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
