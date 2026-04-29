// Dashboard — business overview with stock alerts, margins, and recent activity.

import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const [
    supplierCount,
    productCount,
    accountCount,
    allProducts,
    stockAlertProducts,
    recentAccounts,
    recentSuppliers,
  ] = await Promise.all([
    prisma.supplier.count(),
    prisma.product.count(),
    prisma.account.count(),
    // Only fetch the fields needed for margin calculation.
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        costPrice: true,
        retailPrice: true,
        supplier: { select: { name: true } },
      },
    }),
    // Only fetch fields shown in the stock alerts panel.
    prisma.product.findMany({
      where: { stockQuantity: { lte: 5 } },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        supplier: { select: { name: true } },
      },
      orderBy: { stockQuantity: "asc" },
      take: 8,
    }),
    // Only fetch fields rendered in the recent accounts panel.
    prisma.account.findMany({
      select: { id: true, name: true, email: true, type: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Only fetch fields rendered in the recent suppliers panel.
    prisma.supplier.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
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
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(
          [
            { label: "Suppliers", value: supplierCount, href: "/suppliers" },
            { label: "Products", value: productCount, href: "/products" },
            { label: "Accounts", value: accountCount, href: "/accounts" },
          ] as const
        ).map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span className="font-medium">{label}</span>
            <span className="font-semibold text-slate-800 dark:text-white">·</span>
            <span className="font-semibold text-slate-800 dark:text-white">{value}</span>
          </Link>
        ))}
      </div>

      {/* Panels grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lowest-margin products */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                Lowest Margins
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">Products with tightest retail margins</p>
            </div>
            <Link href="/products" className="text-sm text-blue-500 hover:underline shrink-0">
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
                    <p className="text-sm text-slate-400 truncate">{p.supplier.name}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-mono text-slate-500 dark:text-slate-400">
                      ${p.retailPrice.toFixed(2)}
                    </span>
                    <span
                      className={`text-sm font-medium px-1.5 py-0.5 rounded ${
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

        {/* Stock alerts */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">
                Stock Alerts
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">Products out of stock or running low</p>
            </div>
            <Link href="/products" className="text-sm text-blue-500 hover:underline shrink-0">
              View all →
            </Link>
          </div>

          {stockAlertProducts.length === 0 ? (
            <p className="text-sm text-slate-400 py-2">All products are well stocked</p>
          ) : (
            <div className="space-y-2">
              {stockAlertProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {p.name}
                    </p>
                    <p className="text-sm text-slate-400 truncate">{p.supplier.name}</p>
                  </div>
                  {p.stockQuantity === 0 ? (
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 shrink-0">
                      Out of stock
                    </span>
                  ) : (
                    <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 shrink-0">
                      {p.stockQuantity} left
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent accounts */}
        <RecentSection title="Recent Accounts" subtitle="Latest 5 accounts added" href="/accounts">
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
                  {a.email && <p className="text-sm text-slate-400 truncate">{a.email}</p>}
                </div>
                <span
                  className={`text-sm px-2 py-0.5 rounded-full font-medium shrink-0 ${
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
        <RecentSection title="Recent Suppliers" subtitle="Latest 5 suppliers added" href="/suppliers">
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
                  {s.email && <p className="text-sm text-slate-400 truncate">{s.email}</p>}
                </div>
                <Link
                  href={`/suppliers/${s.id}/edit`}
                  className="text-sm text-blue-500 hover:underline shrink-0"
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
  subtitle,
  href,
  children,
}: {
  title: string;
  subtitle: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">{title}</h2>
          <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>
        </div>
        <Link href={href} className="text-sm text-blue-500 hover:underline">
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
