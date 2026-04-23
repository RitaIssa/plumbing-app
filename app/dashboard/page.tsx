// Dashboard — shows genuinely useful business information, not just totals.
// Low-margin products surface pricing risks; recent sections show what's new.

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const [supplierCount, productCount, accountCount, allProducts, recentAccounts, recentSuppliers] =
    await Promise.all([
      prisma.supplier.count(),
      prisma.product.count(),
      prisma.account.count(),
      prisma.product.findMany({
        include: { supplier: { select: { name: true } } },
      }),
      prisma.account.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.supplier.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  // Sort products by retail margin ascending — tightest margins first
  const lowMarginProducts = allProducts
    .filter((p) => p.retailPrice > 0)
    .map((p) => ({
      ...p,
      marginPct: Math.round(((p.retailPrice - p.costPrice) / p.retailPrice) * 100),
    }))
    .sort((a, b) => a.marginPct - b.marginPct)
    .slice(0, 5);

  return (
    <div className="p-8">
      {/* Page header — counts as a summary line, not hero cards */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          <Link href="/suppliers" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            {supplierCount} {supplierCount === 1 ? "supplier" : "suppliers"}
          </Link>
          {" · "}
          <Link href="/products" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            {productCount} {productCount === 1 ? "product" : "products"}
          </Link>
          {" · "}
          <Link href="/accounts" className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
            {accountCount} {accountCount === 1 ? "account" : "accounts"}
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lowest-margin products — actionable pricing watch */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Lowest Margins
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Products with tightest retail margins</p>
            </div>
            <Link href="/products" className="text-xs text-blue-500 hover:underline shrink-0">
              View all →
            </Link>
          </div>

          {lowMarginProducts.length === 0 ? (
            <p className="text-sm text-slate-400 py-2">No products yet</p>
          ) : (
            <div className="space-y-3">
              {lowMarginProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{p.supplier.name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      ${p.retailPrice.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                        p.marginPct < 10
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : p.marginPct < 25
                          ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {p.marginPct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent accounts */}
        <RecentSection title="Recent Accounts" href="/accounts">
          {recentAccounts.length === 0 ? (
            <EmptyRow message="No accounts yet" />
          ) : (
            recentAccounts.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                <div className="min-w-0 mr-3">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {a.name}
                  </p>
                  {a.email && <p className="text-xs text-slate-400 truncate">{a.email}</p>}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                    a.type === "TRADE"
                      ? "bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {a.type === "TRADE" ? "Trade" : "Retail"}
                </span>
              </div>
            ))
          )}
        </RecentSection>

        {/* Recent suppliers */}
        <RecentSection title="Recent Suppliers" href="/suppliers">
          {recentSuppliers.length === 0 ? (
            <EmptyRow message="No suppliers yet" />
          ) : (
            recentSuppliers.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                <div className="min-w-0 mr-3">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {s.name}
                  </p>
                  {s.email && <p className="text-xs text-slate-400 truncate">{s.email}</p>}
                </div>
                <Link
                  href={`/suppliers/${s.id}/edit`}
                  className="text-xs text-blue-500 hover:underline shrink-0"
                >
                  Edit
                </Link>
              </div>
            ))
          )}
        </RecentSection>
      </div>
    </div>
  );
}

function RecentSection({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h2>
        <Link href={href} className="text-xs text-blue-500 hover:underline">
          View all →
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}

function EmptyRow({ message }: { message: string }) {
  return <p className="text-sm text-slate-400 py-2">{message}</p>;
}
