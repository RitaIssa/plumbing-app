// Skeleton shown while the products list server component fetches data.

export default function ProductsLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-4 w-14 bg-slate-100 dark:bg-slate-700/50 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Toolbar (search + category filter) */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex gap-3">
          <div className="h-8 w-56 bg-slate-100 dark:bg-slate-700/50 rounded-md" />
          <div className="h-8 w-36 bg-slate-100 dark:bg-slate-700/50 rounded-md" />
        </div>

        {/* Header row */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 grid grid-cols-[2.5fr_1fr_1.5fr_1fr_1fr_1fr_1.2fr_1fr] gap-3 px-6 py-3">
          {Array.from({ length: 8 }).map((_, k) => (
            <div key={k} className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          ))}
        </div>

        {/* Skeleton rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[2.5fr_1fr_1.5fr_1fr_1fr_1fr_1.2fr_1fr] gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0 items-center"
          >
            {/* Product col — thumbnail + name block */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
                <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2" />
              </div>
            </div>
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-3/4 font-mono" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-4/5" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 ml-auto" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 ml-auto" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 ml-auto" />
            <div className="h-5 w-16 bg-slate-100 dark:bg-slate-700/50 rounded-full ml-auto" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
