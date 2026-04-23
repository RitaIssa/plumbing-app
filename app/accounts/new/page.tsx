// Add new customer account page.

import Link from "next/link";
import { createAccount } from "@/app/accounts/actions";
import AccountForm from "@/app/accounts/AccountForm";

export default function NewAccountPage() {
  return (
    <div className="p-8 max-w-2xl">
      <Link href="/accounts" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Accounts
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Account</h1>
      <AccountForm action={createAccount} submitLabel="Save Account" />
    </div>
  );
}
