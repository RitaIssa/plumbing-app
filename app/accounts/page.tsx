// Accounts list page — shows all customer accounts with their type (RETAIL or TRADE).

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({
    orderBy: { name: "asc" },
  });

  // Separate counts by type for the summary
  const retailCount = accounts.filter((a) => a.type === "RETAIL").length;
  const tradeCount = accounts.filter((a) => a.type === "TRADE").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
          <p className="text-slate-500 mt-1">
            {accounts.length} total · {retailCount} retail · {tradeCount} trade
          </p>
        </div>
        <Link
          href="/accounts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Account
        </Link>
      </div>

      {/* Empty state */}
      {accounts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-lg font-semibold text-slate-700">No accounts yet</h2>
          <p className="text-slate-400 mt-1 mb-4">Add your first customer account to get started.</p>
          <Link href="/accounts/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Add Account
          </Link>
        </div>
      )}

      {/* Accounts table */}
      {accounts.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-y-auto max-h-[calc(100vh-220px)]">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Name</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Email</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Phone</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Type</th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{account.name}</td>
                  <td className="px-6 py-4 text-slate-500">{account.email || "—"}</td>
                  <td className="px-6 py-4 text-slate-500">{account.phone || "—"}</td>
                  <td className="px-6 py-4">
                    {/* Badge colour differs by type */}
                    <span
                      className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        account.type === "TRADE"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {account.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/accounts/${account.id}/edit`} className="text-blue-500 hover:underline">
                        Edit
                      </Link>
                      <DeleteButton
                        id={account.id}
                        entityType="account"
                        entityName={account.name}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
