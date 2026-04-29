// Skeleton shown while the accounts list server component fetches data.

export default function AccountsLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-28 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-4 w-14 bg-slate-100 dark:bg-slate-700/50 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Toolbar (search + type filter pills) */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="h-8 w-52 bg-slate-100 dark:bg-slate-700/50 rounded-md" />
          <div className="flex gap-1">
            {[72, 88, 76].map((w) => (
              <div key={w} className="h-7 rounded bg-slate-100 dark:bg-slate-700/50" style={{ width: w }} />
            ))}
          </div>
        </div>

        {/* Header row */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 grid grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr_1fr] gap-4 px-6 py-3">
          {Array.from({ length: 6 }).map((_, k) => (
            <div key={k} className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          ))}
        </div>

        {/* Skeleton rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr_1fr] gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0"
          >
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-4/5" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2" />
            <div className="h-5 w-14 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-3/4" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
