// Edit product page — loads existing product and lets you update it.

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { updateProduct } from "@/app/products/actions";
import ProductForm from "@/app/products/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);

  const [product, suppliers] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.supplier.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  // Bind the product ID as the first argument — useFormState handles (prevState, formData)
  const action = updateProduct.bind(null, id);

  return (
    <div className="p-8">
      <Link href="/products" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Products
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Edit Product</h1>
      <ProductForm action={action} suppliers={suppliers} defaultValues={product} submitLabel="Save Changes" />
    </div>
  );
}
