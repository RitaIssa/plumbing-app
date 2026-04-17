// Edit account page — loads existing account and lets you update it.

import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

async function updateAccount(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const type = formData.get("type") as "RETAIL" | "TRADE";

  if (!name?.trim()) throw new Error("Account name is required");

  await prisma.account.update({
    where: { id },
    data: {
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      type: type === "TRADE" ? "TRADE" : "RETAIL",
    },
  });

  revalidatePath("/accounts");
  revalidatePath("/dashboard");
  redirect("/accounts");
}

const inputClass =
  "w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default async function EditAccountPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  const account = await prisma.account.findUnique({ where: { id } });

  if (!account) notFound();

  const updateWithId = updateAccount.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/accounts" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Accounts
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Account</h1>

      <form action={updateWithId} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={account.name}
            className={inputClass}
          />
        </div>

        {/* Account type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account Type</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="RETAIL"
                defaultChecked={account.type === "RETAIL"}
                className="accent-blue-600"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Retail</strong> — retail price
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="TRADE"
                defaultChecked={account.type === "TRADE"}
                className="accent-blue-600"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                <strong>Trade</strong> — trade price
              </span>
            </label>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Email <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={account.email || ""}
            className={inputClass}
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Phone <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={account.phone || ""}
            className={inputClass}
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Address <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            defaultValue={account.address || ""}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton label="Save Changes" loadingLabel="Saving…" />
          <Link href="/accounts" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
