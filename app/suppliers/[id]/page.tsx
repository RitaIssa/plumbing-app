// Supplier detail page — shows all info about one supplier and their products.

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe, Pencil, Package } from "lucide-react";
import FaviconImage from "@/components/FaviconImage";

export default async function SupplierDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);

  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      products: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!supplier) notFound();

  return (
    <div className="p-8 max-w-5xl">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/suppliers"
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          ← Back to Suppliers
        </Link>
        <Link
          href={`/suppliers/${id}/edit`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Supplier
        </Link>
      </div>

      {/* Supplier info card */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {supplier.website && (
              <FaviconImage
                website={supplier.website}
                name={supplier.name}
                size={64}
                className="w-12 h-12 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 p-1.5 shrink-0"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{supplier.name}</h1>
              <p className="text-sm text-slate-400 mt-1">
                {supplier.products.length}{" "}
                {supplier.products.length === 1 ? "product" : "products"}
              </p>
            </div>
          </div>
          {supplier.website && (
            <a
              href={supplier.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0"
            >
              <Globe className="w-4 h-4" />
              Visit Website
            </a>
          )}
        </div>

        {/* Contact details */}
        {(supplier.email || supplier.phone || supplier.address) && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {supplier.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <a
                    href={`mailto:${supplier.email}`}
                    className="text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {supplier.email}
                  </a>
                </div>
              </div>
            )}
            {supplier.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                  <a
                    href={`tel:${supplier.phone}`}
                    className="text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {supplier.phone}
                  </a>
                </div>
              </div>
            )}
            {supplier.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Address</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">
                    {supplier.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">Products</h2>
          <Link
            href={`/products/new`}
            className="text-sm text-blue-500 hover:underline"
          >
            + Add Product
          </Link>
        </div>

        {supplier.products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No products yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Add a product and assign it to this supplier.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                  Product
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                  SKU
                </th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                  Cost
                </th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                  Retail
                </th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                  Trade
                </th>
                <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                  Stock
                </th>
                <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {supplier.products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 dark:text-slate-200">{product.name}</p>
                    {product.description && (
                      <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[220px]">
                        {product.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                    {product.sku || "—"}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-slate-400">
                    ${product.costPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-green-700 dark:text-green-400">
                    ${product.retailPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium text-orange-600 dark:text-orange-400">
                    ${product.tradePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {product.stockQuantity === 0 ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        Out of stock
                      </span>
                    ) : product.stockQuantity <= 5 ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                        Low stock
                      </span>
                    ) : (
                      <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                        {product.stockQuantity}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
