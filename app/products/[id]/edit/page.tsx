// Edit product page — loads existing product and lets you update it.

import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

async function updateProduct(id: number, formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const supplierId = parseInt(formData.get("supplierId") as string, 10);
  const costPrice = parseFloat(formData.get("costPrice") as string);
  const retailPrice = parseFloat(formData.get("retailPrice") as string);
  const tradePrice = parseFloat(formData.get("tradePrice") as string);

  if (!name?.trim()) throw new Error("Product name is required");

  await prisma.product.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      sku: sku?.trim() || null,
      supplierId,
      costPrice,
      retailPrice,
      tradePrice,
    },
  });

  revalidatePath("/products");
  revalidatePath("/dashboard");
  redirect("/products");
}

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

  const updateWithId = updateProduct.bind(null, id);

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/products" className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-6">
        ← Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Product</h1>

      <form action={updateWithId} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        {/* Product name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={product.name}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            defaultValue={product.description || ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-slate-700 mb-1">
            SKU <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            defaultValue={product.sku || ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
          />
        </div>

        {/* Supplier */}
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-slate-700 mb-1">
            Supplier <span className="text-red-500">*</span>
          </label>
          <select
            id="supplierId"
            name="supplierId"
            required
            defaultValue={product.supplierId}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        <div>
          <p className="text-sm font-medium text-slate-700 mb-3">Pricing</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: "costPrice", label: "Cost Price", hint: "What you pay", value: product.costPrice },
              { id: "retailPrice", label: "Retail Price", hint: "Public customers", value: product.retailPrice },
              { id: "tradePrice", label: "Trade Price", hint: "Trade accounts", value: product.tradePrice },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-xs text-slate-500 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    id={field.id}
                    name={field.id}
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={field.value.toFixed(2)}
                    className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{field.hint}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton label="Save Changes" loadingLabel="Saving…" />
          <Link href="/products" className="text-sm text-slate-500 hover:text-slate-700">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
