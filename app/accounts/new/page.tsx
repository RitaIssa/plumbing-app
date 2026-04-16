// Add new customer account page.

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

async function createAccount(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const type = formData.get("type") as "RETAIL" | "TRADE";

  if (!name?.trim()) throw new Error("Account name is required");

  await prisma.account.create({
    data: {
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
      type: type === "TRADE" ? "TRADE" : "RETAIL",
    },
  });

  redirect("/accounts");
}

export default function NewAccountPage() {
  return (
    <div className="p-8 max-w-2xl">
      <Link href="/accounts" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-6">
        ← Back to Accounts
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add New Account</h1>

      <form action={createAccount} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {/* Account name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. John Smith or Smith Plumbing Pty Ltd"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Account type — RETAIL or TRADE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Account Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value="RETAIL" defaultChecked className="accent-blue-600" />
              <span className="text-sm text-slate-700">
                <strong>Retail</strong> — public customer, pays retail price
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="type" value="TRADE" className="accent-blue-600" />
              <span className="text-sm text-slate-700">
                <strong>Trade</strong> — trade professional, pays trade price
              </span>
            </label>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="customer@email.com"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
            Phone <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g. 0400 000 000"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1">
            Address <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            placeholder="Delivery / billing address"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Save Account
          </button>
          <Link href="/accounts" className="text-sm text-slate-500 hover:text-slate-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
