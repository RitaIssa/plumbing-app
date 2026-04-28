"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, Pencil, Truck, ChevronUp, ChevronDown, ChevronsUpDown, ExternalLink } from "lucide-react";
import DeleteButton from "./DeleteButton";

type Supplier = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
  createdAt: Date;
  _count: { products: number };
};

type SortCol = "name" | "products" | "createdAt";
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active)
    return (
      <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
    );
  return dir === "asc" ? (
    <ChevronUp className="w-3.5 h-3.5 text-blue-500" />
  ) : (
    <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
  );
}

export default function SuppliersTable({ suppliers }: { suppliers: Supplier[] }) {
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<SortCol>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const q = search.toLowerCase();

  function handleSort(col: SortCol) {
    if (col === sortCol) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      (s.email ?? "").toLowerCase().includes(q) ||
      (s.phone ?? "").includes(q)
  );

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortCol === "name") cmp = a.name.localeCompare(b.name);
    else if (sortCol === "products") cmp = a._count.products - b._count.products;
    else if (sortCol === "createdAt")
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return sortDir === "asc" ? cmp : -cmp;
  });

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <Truck className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">No suppliers yet</h2>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-4">
          Add your first supplier to get started.
        </p>
        <Link
          href="/suppliers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Add Supplier
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Search bar */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers…"
            className="w-full pl-8 pr-8 py-1.5 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {search && (
          <span className="text-xs text-slate-400 shrink-0">
            {filtered.length} of {suppliers.length}
          </span>
        )}
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
            <tr>
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort("name")}
                  className="group flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Name
                  <SortIcon active={sortCol === "name"} dir={sortDir} />
                </button>
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                Email
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                Phone
              </th>
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort("products")}
                  className="group flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Products
                  <SortIcon active={sortCol === "products"} dir={sortDir} />
                </button>
              </th>
              <th className="text-left px-6 py-3">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="group flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  Created
                  <SortIcon active={sortCol === "createdAt"} dir={sortDir} />
                </button>
              </th>
              <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-400">
                  No suppliers match &ldquo;{search}&rdquo;
                </td>
              </tr>
            ) : (
              sorted.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2.5">
                      {supplier.website && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://www.google.com/s2/favicons?domain=${supplier.website}&sz=32`}
                          alt=""
                          className="w-5 h-5 rounded shrink-0"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      <Link
                        href={`/suppliers/${supplier.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {supplier.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {supplier.email || "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {supplier.phone || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full font-medium">
                      {supplier._count.products}{" "}
                      {supplier._count.products === 1 ? "product" : "products"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {new Date(supplier.createdAt).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/suppliers/${supplier.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Details
                      </Link>
                      <Link
                        href={`/suppliers/${supplier.id}/edit`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
