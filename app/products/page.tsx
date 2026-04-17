// Products list page — shows all products with their prices and linked supplier.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: {
      supplier: { select: { name: true } }, // include just the supplier's name
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{products.length} total</p>
        </div>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Empty state */}
      {products.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="text-4xl mb-3">📦</div>
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No products yet</h2>
          <p className="text-slate-400 dark:text-slate-500 mt-1 mb-4">Add your first product to get started.</p>
          <Link href="/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Add Product
          </Link>
        </div>
      )}

      {/* Products table */}
      {products.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Product</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">SKU</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Supplier</th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Cost</th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Retail</th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Trade</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">{product.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{product.sku || "—"}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{product.supplier.name}</td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">${product.costPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-medium text-green-700 dark:text-green-400">${product.retailPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-medium text-orange-600 dark:text-orange-400">${product.tradePrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/products/${product.id}/edit`} className="text-blue-500 hover:underline">
                        Edit
                      </Link>
                      <DeleteButton
                        id={product.id}
                        entityType="product"
                        entityName={product.name}
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
