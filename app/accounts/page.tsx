// Accounts list page — server component fetches data, passes to filterable client table.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AccountsTable from "@/components/AccountsTable";

export default async function AccountsPage() {
  // Select only the fields used by AccountsTable (no address, notes, or updatedAt).
  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      type: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Accounts</h1>
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
