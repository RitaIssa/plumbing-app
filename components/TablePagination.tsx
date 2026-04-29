"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const PAGE_SIZES = [10, 25, 50] as const;

export default function TablePagination({ total, page, pageSize, onPageChange, onPageSizeChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Sliding window of up to 5 page numbers
  let startPage: number;
  if (totalPages <= 5) {
    startPage = 1;
  } else if (page <= 3) {
    startPage = 1;
  } else if (page >= totalPages - 2) {
    startPage = totalPages - 4;
  } else {
    startPage = page - 2;
  }
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => startPage + i);

  const btnBase =
    "p-1.5 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors";

  return (
    <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
      {/* Count info */}
      <p className="text-sm text-slate-500 dark:text-slate-400 shrink-0">
        {total === 0
          ? "No results"
          : `Showing ${from}–${to} of ${total} result${total === 1 ? "" : "s"}`}
      </p>

      <div className="flex items-center gap-3">
        {/* Page buttons */}
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className={btnBase}
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {pageNumbers.map((n) => (
              <button
                key={n}
                onClick={() => onPageChange(n)}
                className={`min-w-[2rem] h-8 px-2 rounded text-sm font-medium transition-colors ${
                  n === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {n}
              </button>
            ))}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className={btnBase}
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Page size selector */}
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(parseInt(e.target.value, 10));
            onPageChange(1);
          }}
          className="text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {PAGE_SIZES.map((s) => (
            <option key={s} value={s}>
              {s} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
