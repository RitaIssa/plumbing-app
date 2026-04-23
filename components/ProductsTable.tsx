"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Pencil, Package } from "lucide-react";
import DeleteButton from "./DeleteButton";

type Product = {
  id: number;
  name: string;
  description: string | null;
  sku: string | null;
  costPrice: number;
  retailPrice: number;
  tradePrice: number;
  supplier: { name: string };
};

export default function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const q = search.toLowerCase();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.sku ?? "").toLowerCase().includes(q) ||
      p.supplier.name.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q)
  );

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">No products yet</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-4">
          Add your first product to get started.
        </p>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or supplier…"
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {search && (
          <span className="text-xs text-slate-400 shrink-0">
            {filtered.length} of {products.length}
          </span>
        )}
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
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
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">
                  No products match &ldquo;{search}&rdquo;
                </td>
              </tr>
            ) : (
              filtered.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                        {product.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                    {product.sku || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {product.supplier.name}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    ${product.costPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-green-700 dark:text-green-400">
                    ${product.retailPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-orange-600 dark:text-orange-400">
                    ${product.tradePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.id}/edit`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
