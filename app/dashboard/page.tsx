// Dashboard page — shows a summary of the whole business at a glance.
// This is a server component: it fetches data directly from the database.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Truck, Package, Users } from "lucide-react";

export default async function DashboardPage() {
  // Fetch counts and recent records from the database in parallel
  const [supplierCount, productCount, accountCount, recentSuppliers, recentProducts, recentAccounts] =
    await Promise.all([
      prisma.supplier.count(),
      prisma.product.count(),
      prisma.account.count(),
      prisma.supplier.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { supplier: { select: { name: true } } },
      }),
      prisma.account.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  return (
    <div className="p-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Welcome back. Here&apos;s your business at a glance.</p>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Suppliers"
          icon={<Truck className="w-8 h-8" />}
          count={supplierCount}
          href="/suppliers"
          color="blue"
        />
        <StatCard
          title="Total Products"
          icon={<Package className="w-8 h-8" />}
          count={productCount}
          href="/products"
          color="green"
        />
        <StatCard
          title="Total Accounts"
          icon={<Users className="w-8 h-8" />}
          count={accountCount}
          href="/accounts"
          color="purple"
        />
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent suppliers */}
        <RecentSection title="Recent Suppliers" href="/suppliers">
          {recentSuppliers.length === 0 ? (
            <EmptyRow message="No suppliers yet" />
          ) : (
            recentSuppliers.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{s.name}</p>
                  {s.email && <p className="text-xs text-slate-400">{s.email}</p>}
                </div>
                <Link href={`/suppliers/${s.id}/edit`} className="text-xs text-blue-500 hover:underline">
                  Edit
                </Link>
              </div>
            ))
          )}
        </RecentSection>

        {/* Recent products */}
        <RecentSection title="Recent Products" href="/products">
          {recentProducts.length === 0 ? (
            <EmptyRow message="No products yet" />
          ) : (
            recentProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.supplier.name}</p>
                </div>
                <span className="text-xs font-mono text-slate-600">${p.retailPrice.toFixed(2)}</span>
              </div>
            ))
          )}
        </RecentSection>

        {/* Recent accounts */}
        <RecentSection title="Recent Accounts" href="/accounts">
          {recentAccounts.length === 0 ? (
            <EmptyRow message="No accounts yet" />
          ) : (
            recentAccounts.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{a.name}</p>
                  {a.email && <p className="text-xs text-slate-400">{a.email}</p>}
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    a.type === "TRADE"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {a.type}
                </span>
              </div>
            ))
          )}
        </RecentSection>
      </div>
    </div>
  );
}

// --- Sub-components ---

function StatCard({
  title,
  count,
  icon,
  href,
  color,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  color: "blue" | "green" | "purple";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <Link href={href} className="block">
      <div className={`rounded-xl border p-6 hover:shadow-md transition-shadow ${colorMap[color]}`}>
        <div className="mb-3">{icon}</div>
        <div className="text-3xl font-bold">{count}</div>
        <div className="text-sm font-medium mt-1 opacity-80">{title}</div>
      </div>
    </Link>
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
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
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
