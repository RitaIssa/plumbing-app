// Account detail page — shows full account info, notes, and purchase history.

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, MapPin, Pencil, ShoppingCart, FileText } from "lucide-react";
import AddPurchaseModal from "@/components/AddPurchaseModal";

export default async function AccountDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const [account, products] = await Promise.all([
    prisma.account.findUnique({
      where: { id },
      include: {
        purchases: {
          include: { product: true },
          orderBy: { date: "desc" },
        },
      },
    }),
    prisma.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        retailPrice: true,
        tradePrice: true,
      },
    }),
  ]);

  if (!account) notFound();

  const totalPurchases = account.purchases.length;
  const totalSpent = account.purchases.reduce((sum, p) => {
    const price = account.type === "TRADE" ? p.product.tradePrice : p.product.retailPrice;
    return sum + price * p.quantity;
  }, 0);

  return (
    <div className="p-8 max-w-5xl">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/accounts"
          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          ← Back to Accounts
        </Link>
        <Link
          href={`/accounts/${id}/edit`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          Edit Account
        </Link>
      </div>

      {/* Account info card */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
        <div className="flex items-start gap-3 flex-wrap mb-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{account.name}</h1>
          <span
            className={`mt-1 inline-block text-xs px-2 py-0.5 rounded font-medium shrink-0 ${
              account.type === "TRADE"
                ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            {account.type === "TRADE" ? "Trade" : "Retail"}
          </span>
        </div>
        <p className="text-sm text-slate-400 mb-0">
          Member since{" "}
          {new Date(account.createdAt).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>

        {/* Contact details */}
        {(account.email || account.phone || account.address) && (
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {account.email && (
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <a
                    href={`mailto:${account.email}`}
                    className="text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {account.email}
                  </a>
                </div>
              </div>
            )}
            {account.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                  <a
                    href={`tel:${account.phone}`}
                    className="text-sm text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {account.phone}
                  </a>
                </div>
              </div>
            )}
            {account.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Address</p>
                  <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-line">
                    {account.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notes card — only shown if notes exist */}
      {account.notes && (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Internal Notes
            </h2>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
            {account.notes}
          </p>
        </div>
      )}

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-400 mb-1">Total Purchases</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalPurchases}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5">
          <p className="text-xs text-slate-400 mb-1">Total Spent</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* Purchase history */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300">Purchase History</h2>
          <AddPurchaseModal
            accountId={id}
            accountType={account.type}
            products={products}
          />
        </div>

        {account.purchases.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No purchases yet</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              Record the first purchase for this account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    Product
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    Qty
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    Unit Price
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    Total
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-slate-600 dark:text-slate-400">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {account.purchases.map((purchase) => {
                  const unitPrice =
                    account.type === "TRADE"
                      ? purchase.product.tradePrice
                      : purchase.product.retailPrice;
                  const total = unitPrice * purchase.quantity;
                  return (
                    <tr
                      key={purchase.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {new Date(purchase.date).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/products/${purchase.productId}`}
                          className="font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {purchase.product.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-slate-400">
                        {purchase.quantity}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-slate-400">
                        ${unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                        ${total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {purchase.notes || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
