// Accounts list page — server component fetches data, passes to filterable client table.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AccountsTable from "@/components/AccountsTable";

export default async function AccountsPage() {
  const accounts = await prisma.account.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Accounts</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{accounts.length} total</p>
        </div>
        <Link
          href="/accounts/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Account
        </Link>
      </div>

      <AccountsTable accounts={accounts} />
    </div>
  );
}
