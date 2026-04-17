// Edit supplier page — loads the existing supplier data and lets you update it.

import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

// This server action updates the supplier when the form is submitted
async function updateSupplier(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;

  if (!name || name.trim() === "") {
    throw new Error("Supplier name is required");
  }

  await prisma.supplier.update({
    where: { id },
    data: {
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      address: address?.trim() || null,
    },
  });

  revalidatePath("/suppliers");
  revalidatePath("/dashboard");
  redirect("/suppliers");
}

const inputClass =
  "w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default async function EditSupplierPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);

  // Load the supplier from the database
  const supplier = await prisma.supplier.findUnique({ where: { id } });

  // If the supplier doesn't exist, show a 404 page
  if (!supplier) {
    notFound();
  }

  // Bind the supplier ID into the server action
  const updateWithId = updateSupplier.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/suppliers" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Suppliers
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Supplier</h1>

      <form action={updateWithId} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
        {/* Supplier name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Supplier Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={supplier.name}
            className={inputClass}
          />
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
            defaultValue={supplier.email || ""}
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
            defaultValue={supplier.phone || ""}
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
            defaultValue={supplier.address || ""}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton label="Save Changes" loadingLabel="Saving…" />
          <Link href="/suppliers" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
