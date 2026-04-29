"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Truck,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sun,
  Moon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";

const STORAGE_KEY = "sidebar-collapsed";

const navItems: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "Suppliers", href: "/suppliers", Icon: Truck },
  { label: "Products", href: "/products", Icon: Package },
  { label: "Accounts", href: "/accounts", Icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setCollapsed(true);
    }
  }, []);

  function collapse(value: boolean) {
    setCollapsed(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  const isSettingsActive = pathname === "/settings" || pathname.startsWith("/settings/");

  return (
    <aside
      className={`${
        collapsed ? "w-[58px]" : "w-[214px]"
      } transition-all duration-200 ease-in-out shrink-0 h-full sticky top-0 bg-slate-950 border-r border-slate-800 text-white flex flex-col`}
    >
      {/* Brand header */}
      <div
        className={`flex items-center border-b border-slate-800 px-3 py-[13px] ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <svg width="26" height="26" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <rect width="70" height="70" rx="14" fill="#1e3a5f"/>
            <rect x="18" y="14" width="34" height="9" rx="4" fill="white"/>
            <rect x="18" y="14" width="9" height="22" rx="4" fill="white"/>
            <rect x="18" y="27" width="34" height="9" rx="4" fill="white"/>
            <rect x="43" y="27" width="9" height="22" rx="4" fill="white"/>
            <rect x="18" y="40" width="34" height="9" rx="4" fill="white"/>
          </svg>
          {!collapsed && (
            <div>
              <h1 className="text-[13px] font-semibold tracking-tight text-white leading-none">SupplyBase</h1>
              <p className="text-[11px] text-slate-500 leading-none mt-1">Business Manager</p>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={() => collapse(true)}
            aria-label="Collapse sidebar"
            className="p-1 rounded text-slate-600 hover:bg-white/5 hover:text-slate-300 transition-colors shrink-0"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={() => collapse(false)}
          aria-label="Expand sidebar"
          className="flex justify-center py-2 border-b border-slate-800 text-slate-600 hover:bg-white/5 hover:text-slate-300 transition-colors"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-3">
        <ul className="space-y-0.5 px-2">
          {navItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  prefetch={true}
                  title={collapsed ? label : undefined}
                  className={`flex items-center py-[7px] rounded-md text-sm font-medium transition-colors ${
                    collapsed ? "justify-center px-2" : "gap-3 px-3"
                  } ${
                    isActive
                      ? "bg-white/[0.08] text-white"
                      : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-blue-400" : ""
                    }`}
                  />
                  {!collapsed && <span className="whitespace-nowrap">{label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer actions */}
      <div className="px-2 py-3 border-t border-slate-800 space-y-0.5">
        <Link
          href="/settings"
          prefetch={true}
          title={collapsed ? "Settings" : undefined}
          className={`flex items-center w-full py-[7px] rounded-md text-sm font-medium transition-colors ${
            collapsed ? "justify-center px-2" : "gap-3 px-3"
          } ${
            isSettingsActive
              ? "bg-white/[0.08] text-white"
              : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.05]"
          }`}
        >
          <Settings
            className={`w-4 h-4 shrink-0 ${isSettingsActive ? "text-blue-400" : ""}`}
          />
          {!collapsed && <span>Settings</span>}
        </Link>

        {mounted && (
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex items-center w-full py-[7px] rounded-md text-sm font-medium transition-colors text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] ${
              collapsed ? "justify-center px-2" : "gap-3 px-3"
            }`}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 shrink-0" />
            ) : (
              <Moon className="w-4 h-4 shrink-0" />
            )}
            {!collapsed && (
              <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
            )}
          </button>
        )}
      </div>
    </aside>
  );
}
