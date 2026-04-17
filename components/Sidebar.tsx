"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Truck,
  Package,
  Users,
  Wrench,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Suppliers", href: "/suppliers", Icon: Truck },
  { label: "Products", href: "/products", Icon: Package },
  { label: "Accounts", href: "/accounts", Icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={`${
        collapsed ? "w-16" : "w-56"
      } transition-all duration-300 ease-in-out shrink-0 min-h-screen bg-slate-800 text-white flex flex-col`}
    >
      {/* Header row — logo + title left, chevron right (expanded); icon centered (collapsed) */}
      <div
        className={`flex items-center border-b border-slate-700 px-3 py-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Wrench className="w-5 h-5 text-blue-400 shrink-0" />
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold tracking-tight">PlumbingPro</h1>
              <p className="text-xs text-slate-400">Business Manager</p>
            </div>
          )}
        </div>

        {/* Chevron lives in the header row when expanded */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            aria-label="Collapse sidebar"
            className="p-1 rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Expand button shown just below the logo when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expand sidebar"
          className="flex justify-center py-2 border-b border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Navigation links */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map(({ label, href, Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");

            return (
              <li key={href}>
                <Link
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`flex items-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    collapsed ? "justify-center px-2" : "gap-3 px-3"
                  } ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <span className="whitespace-nowrap">{label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer — company name + logout */}
      <div className="px-3 py-4 border-t border-slate-700 space-y-2">
        {!collapsed && (
          <p className="text-xs text-slate-500 whitespace-nowrap">
            Plumbing Supplies Co.
          </p>
        )}
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign out" : undefined}
          className={`flex items-center w-full py-2 rounded-lg text-sm font-medium transition-colors text-slate-400 hover:bg-slate-700 hover:text-white ${
            collapsed ? "justify-center px-2" : "gap-3 px-3"
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
