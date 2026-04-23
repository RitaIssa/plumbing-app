// Add new product page.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { createProduct } from "@/app/products/actions";
import ProductForm from "@/app/products/ProductForm";

export default async function NewProductPage() {
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/products" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Product</h1>

      {/* Warn if no suppliers exist yet */}
      {suppliers.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 rounded-lg px-4 py-3 text-sm mb-6">
          You need to{" "}
          <Link href="/suppliers/new" className="underline font-medium">
            add a supplier
          </Link>{" "}
          before you can add products.
        </div>
      )}

      <ProductForm action={createProduct} suppliers={suppliers} submitLabel="Save Product" />
    </div>
  );
}
