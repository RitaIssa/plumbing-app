"use client";

// TopHeader — shows current section name on the left for orientation,
// and the user avatar on the right.

import { usePathname } from "next/navigation";
import UserAvatar from "./UserAvatar";

const PATH_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/suppliers": "Suppliers",
  "/suppliers/new": "Add Supplier",
  "/products": "Products",
  "/products/new": "Add Product",
  "/accounts": "Accounts",
  "/accounts/new": "Add Account",
  "/settings": "Settings",
};

function getPageLabel(pathname: string): string {
  if (PATH_LABELS[pathname]) return PATH_LABELS[pathname];
  if (pathname.includes("/edit")) {
    if (pathname.startsWith("/suppliers")) return "Edit Supplier";
    if (pathname.startsWith("/products")) return "Edit Product";
    if (pathname.startsWith("/accounts")) return "Edit Account";
  }
  return "";
}

export default function TopHeader() {
  const pathname = usePathname();
  const label = getPageLabel(pathname);

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      {label ? (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      ) : (
        <span />
      )}
      <UserAvatar />
    </header>
  );
}
