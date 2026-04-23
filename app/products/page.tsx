// Products list page — server component fetches data, passes to filterable client table.

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductsTable from "@/components/ProductsTable";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    include: { supplier: { select: { name: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{products.length} total</p>
        </div>
        <Link
          href="/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
