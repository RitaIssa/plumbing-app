// Skeleton shown while the suppliers list server component fetches data.

export default function SuppliersLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
          <div className="h-4 w-14 bg-slate-100 dark:bg-slate-800/50 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-slate-800 rounded-lg" />
      </div>

      {/* Table card */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <div className="h-8 w-52 bg-slate-100 dark:bg-slate-800/50 rounded-md" />
        </div>

        {/* Header row */}
        <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 grid grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr_1fr] gap-4 px-6 py-3">
          {["Name", "Email", "Phone", "Products", "Created", ""].map((_, k) => (
            <div key={k} className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
          ))}
        </div>

        {/* Skeleton rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1.2fr_1fr] gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0"
          >
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-4/5" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-1/2" />
            <div className="h-5 w-20 bg-slate-100 dark:bg-slate-800/50 rounded-full" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-3/4" />
            <div className="h-4 bg-slate-100 dark:bg-slate-800/50 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
