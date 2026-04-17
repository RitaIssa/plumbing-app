// Add new product page.

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import SubmitButton from "@/components/SubmitButton";

async function createProduct(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sku = formData.get("sku") as string;
  const supplierId = parseInt(formData.get("supplierId") as string, 10);
  const costPrice = parseFloat(formData.get("costPrice") as string);
  const retailPrice = parseFloat(formData.get("retailPrice") as string);
  const tradePrice = parseFloat(formData.get("tradePrice") as string);

  if (!name?.trim()) throw new Error("Product name is required");
  if (isNaN(supplierId)) throw new Error("Please select a supplier");
  if (isNaN(costPrice) || isNaN(retailPrice) || isNaN(tradePrice)) {
    throw new Error("All prices must be valid numbers");
  }

  await prisma.product.create({
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

const inputClass =
  "w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

const priceInputClass =
  "w-full border border-slate-300 dark:border-slate-600 rounded-lg pl-7 pr-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

export default async function NewProductPage() {
  // Load all suppliers for the dropdown selector
  const suppliers = await prisma.supplier.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/products" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 mb-6">
        ← Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Product</h1>

      {/* Show a warning if there are no suppliers yet */}
      {suppliers.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 rounded-lg px-4 py-3 text-sm mb-6">
          You need to{" "}
          <Link href="/suppliers/new" className="underline font-medium">
            add a supplier
          </Link>{" "}
          before you can add products.
        </div>
      )}

      <form action={createProduct} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5">
        {/* Product name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Copper Elbow 15mm"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Description <span className="text-slate-400 text-xs font-normal">(optional)</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            placeholder="Brief description of the product"
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            SKU <span className="text-slate-400 text-xs font-normal">(optional — must be unique)</span>
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            placeholder="e.g. CU-ELB-15"
            className={`${inputClass} font-mono`}
          />
        </div>

        {/* Supplier selector */}
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Supplier <span className="text-red-500">*</span>
          </label>
          <select
            id="supplierId"
            name="supplierId"
            required
            disabled={suppliers.length === 0}
            className={inputClass}
          >
            <option value="">Select a supplier…</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Pricing — three fields in a row */}
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Pricing <span className="text-red-500">*</span></p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="costPrice" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Cost Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className={priceInputClass}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">What you pay</p>
            </div>
            <div>
              <label htmlFor="retailPrice" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Retail Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  id="retailPrice"
                  name="retailPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className={priceInputClass}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Public customers</p>
            </div>
            <div>
              <label htmlFor="tradePrice" className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                Trade Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                <input
                  id="tradePrice"
                  name="tradePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  className={priceInputClass}
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">Trade accounts</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton label="Save Product" loadingLabel="Saving…" disabled={suppliers.length === 0} />
          <Link href="/products" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
