// Edit supplier page — loads the existing supplier data and lets you update it.

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateSupplier } from "@/app/suppliers/actions";
import SupplierForm from "@/app/suppliers/SupplierForm";

export default async function EditSupplierPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  const supplier = await prisma.supplier.findUnique({ where: { id } });

  if (!supplier) notFound();

  // Bind the supplier ID as the first argument — useFormState handles (prevState, formData)
  const action = updateSupplier.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/suppliers" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Suppliers
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Supplier</h1>
      <SupplierForm action={action} defaultValues={supplier} submitLabel="Save Changes" />
    </div>
  );
}
