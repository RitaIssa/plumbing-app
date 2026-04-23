// Edit account page — loads existing account and lets you update it.

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateAccount } from "@/app/accounts/actions";
import AccountForm from "@/app/accounts/AccountForm";

export default async function EditAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  const account = await prisma.account.findUnique({ where: { id } });

  if (!account) notFound();

  // Bind the account ID as the first argument — useFormState handles (prevState, formData)
  const action = updateAccount.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/accounts" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Accounts
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Account</h1>
      <AccountForm action={action} defaultValues={account} submitLabel="Save Changes" />
    </div>
  );
}
