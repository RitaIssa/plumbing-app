// Skeleton shown while the dashboard server component fetches data.

export default function DashboardLoading() {
  return (
    <div className="p-8 animate-pulse">
      {/* Page header */}
      <div className="mb-6">
        <div className="h-8 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[120, 104, 112].map((w) => (
          <div
            key={w}
            className="h-7 rounded-full bg-slate-200 dark:bg-slate-800"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* 2×2 panel grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1.5">
                <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/50 rounded" />
              </div>
              <div className="h-4 w-14 bg-slate-100 dark:bg-slate-800/50 rounded" />
            </div>

            {/* Row skeletons */}
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="space-y-1.5 flex-1 mr-4">
                    <div className="h-3.5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/50 rounded w-1/2" />
                  </div>
                  <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 rounded shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
