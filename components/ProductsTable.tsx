"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, Pencil, Package, ChevronUp, ChevronDown, ChevronsUpDown, ExternalLink } from "lucide-react";
import DeleteButton from "./DeleteButton";
import RestockModal from "./RestockModal";
import TablePagination from "./TablePagination";

type Product = {
  id: number;
  name: string;
  description: string | null;
  sku: string | null;
  category: string | null;
  imageUrl: string | null;
  costPrice: number;
  retailPrice: number;
  tradePrice: number;
  stockQuantity: number;
  supplier: { name: string };
};

type SortCol = "name" | "supplier" | "costPrice" | "retailPrice" | "tradePrice";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 group-hover:text-slate-400 transition-colors" />;
  return dir === "asc"
    ? <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
    : <ChevronDown className="w-3.5 h-3.5 text-blue-500" />;
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortCol, setSortCol] = useState<SortCol>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const q = search.toLowerCase();

  // Unique categories present in the full product list
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean) as string[])
  ).sort();

  function handleSort(col: SortCol) {
    if (col === sortCol) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
    setPage(1);
  }

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.sku ?? "").toLowerCase().includes(q) ||
      p.supplier.name.toLowerCase().includes(q) ||
      (p.description ?? "").toLowerCase().includes(q) ||
      (p.category ?? "").toLowerCase().includes(q);
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortCol === "name") cmp = a.name.localeCompare(b.name);
    else if (sortCol === "supplier") cmp = a.supplier.name.localeCompare(b.supplier.name);
    else if (sortCol === "costPrice") cmp = a.costPrice - b.costPrice;
    else if (sortCol === "retailPrice") cmp = a.retailPrice - b.retailPrice;
    else if (sortCol === "tradePrice") cmp = a.tradePrice - b.tradePrice;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
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
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, SKU, or supplier…"
            className="w-full pl-8 pr-8 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category filter */}
        {categories.length > 0 && (
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="py-1.5 pl-3 pr-8 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-md text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        )}
      </div>

      <table className="w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="text-left px-6 py-3">
              <button
                onClick={() => handleSort("name")}
                className="group flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Product
                <SortIcon active={sortCol === "name"} dir={sortDir} />
              </button>
            </th>
            <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">SKU</th>
            <th className="text-left px-6 py-3">
              <button
                onClick={() => handleSort("supplier")}
                className="group flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                Supplier
                <SortIcon active={sortCol === "supplier"} dir={sortDir} />
              </button>
            </th>
            <th className="text-right px-6 py-3">
              <button
                onClick={() => handleSort("costPrice")}
                className="group flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors ml-auto"
              >
                <SortIcon active={sortCol === "costPrice"} dir={sortDir} />
                Cost
              </button>
            </th>
            <th className="text-right px-6 py-3">
              <button
                onClick={() => handleSort("retailPrice")}
                className="group flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors ml-auto"
              >
                <SortIcon active={sortCol === "retailPrice"} dir={sortDir} />
                Retail
              </button>
            </th>
            <th className="text-right px-6 py-3">
              <button
                onClick={() => handleSort("tradePrice")}
                className="group flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors ml-auto"
              >
                <SortIcon active={sortCol === "tradePrice"} dir={sortDir} />
                Trade
              </button>
            </th>
            <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400 min-w-[140px]">
              Stock
            </th>
            <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-6 py-10 text-center text-sm text-slate-400">
                No products match your filters
              </td>
            </tr>
          ) : (
            paginated.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover border border-slate-200 dark:border-slate-600 shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : null}
                    <div className="min-w-0">
                      <Link
                        href={`/products/${product.id}`}
                        className="font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {product.name}
                      </Link>
                      {product.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[200px]">
                          {product.description}
                        </p>
                      )}
                      {product.category && (
                        <span className="inline-block mt-1 text-sm px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-sm">
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
                <td className="px-6 py-4 text-right">
                  {product.stockQuantity === 0 ? (
                    <span className="whitespace-nowrap text-sm font-medium px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                      Out of stock
                    </span>
                  ) : product.stockQuantity <= 5 ? (
                    <span className="whitespace-nowrap text-sm font-medium px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                      Low stock
                    </span>
                  ) : (
                    <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                      {product.stockQuantity}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Details
                    </Link>
                    <RestockModal
                      productId={product.id}
                      productName={product.name}
                      currentStock={product.stockQuantity}
                    />
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Link>
                    <DeleteButton id={product.id} entityType="product" entityName={product.name} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <TablePagination
        total={sorted.length}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  );
}
