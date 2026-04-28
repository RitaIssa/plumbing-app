// Product detail page — full info for a single product.

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Pencil, Package } from "lucide-react";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { supplier: true },
  });

  if (!product) notFound();

  const hasDimensions = product.width || product.height || product.depth || product.weight;

  return (
    <div className="p-8 max-w-4xl">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/products"
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          ← Back to Products
        </Link>
        <Link
          href={`/products/${id}/edit`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Product
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-0">
          {/* Image panel */}
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full sm:w-64 h-48 sm:h-auto object-cover shrink-0"
            />
          ) : (
            <div className="w-full sm:w-64 h-48 sm:h-auto flex items-center justify-center bg-slate-50 dark:bg-slate-900/40 shrink-0">
              <Package className="w-12 h-12 text-slate-200 dark:text-slate-700" />
            </div>
          )}

          {/* Main info */}
          <div className="flex-1 p-6">
            <div className="flex items-start gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              {product.category && (
                <span className="mt-1 text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium shrink-0">
                  {product.category}
                </span>
              )}
            </div>

            {product.sku && (
              <p className="text-xs font-mono text-slate-400 mb-2">{product.sku}</p>
            )}

            {product.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{product.description}</p>
            )}

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Supplier:{" "}
              <Link
                href={`/suppliers/${product.supplierId}`}
                className="text-blue-500 hover:underline font-medium"
              >
                {product.supplier.name}
              </Link>
            </p>
          </div>
        </div>

        {/* Prices + stock */}
        <div className="border-t border-slate-100 dark:border-slate-700 px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-5">
          <div>
            <p className="text-xs text-slate-400 mb-1">Cost Price</p>
            <p className="text-lg font-semibold font-mono text-slate-700 dark:text-slate-300">
              ${product.costPrice.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Retail Price</p>
            <p className="text-lg font-semibold font-mono text-green-700 dark:text-green-400">
              ${product.retailPrice.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Trade Price</p>
            <p className="text-lg font-semibold font-mono text-orange-600 dark:text-orange-400">
              ${product.tradePrice.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Stock</p>
            {product.stockQuantity === 0 ? (
              <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                Out of stock
              </span>
            ) : product.stockQuantity <= 5 ? (
              <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                Low — {product.stockQuantity} left
              </span>
            ) : (
              <p className="text-lg font-semibold font-mono text-slate-700 dark:text-slate-300">
                {product.stockQuantity}
              </p>
            )}
          </div>
        </div>

        {/* Dimensions */}
        {hasDimensions && (
          <div className="border-t border-slate-100 dark:border-slate-700 px-6 py-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Dimensions</p>
            <div className="flex flex-wrap gap-6">
              {product.width && (
                <div>
                  <p className="text-xs text-slate-400">Width</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.width} cm</p>
                </div>
              )}
              {product.height && (
                <div>
                  <p className="text-xs text-slate-400">Height</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.height} cm</p>
                </div>
              )}
              {product.depth && (
                <div>
                  <p className="text-xs text-slate-400">Depth</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.depth} cm</p>
                </div>
              )}
              {product.weight && (
                <div>
                  <p className="text-xs text-slate-400">Weight</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{product.weight} kg</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
