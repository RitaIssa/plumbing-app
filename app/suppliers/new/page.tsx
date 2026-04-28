// Add new supplier page.

import Link from "next/link";
import { createSupplier } from "@/app/suppliers/actions";
import SupplierForm from "@/app/suppliers/SupplierForm";

export default function NewSupplierPage() {
  return (
    <div className="p-8">
      <Link href="/suppliers" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Suppliers
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Supplier</h1>
      <SupplierForm action={createSupplier} submitLabel="Save Supplier" />
    </div>
  );
}
