"use client";

// Sidebar navigation component.
// It uses usePathname() to highlight the current active link — that's why it needs "use client".

import Link from "next/link";
import { usePathname } from "next/navigation";

// Each item in the nav has a label and a URL path
const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Suppliers", href: "/suppliers", icon: "🏭" },
  { label: "Products", href: "/products", icon: "📦" },
  { label: "Accounts", href: "/accounts", icon: "👥" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-slate-800 text-white flex flex-col">
      {/* App title / logo area */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold tracking-tight">
          🔧 PlumbingPro
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Business Manager</p>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            // Highlight the link if the current URL starts with the link's href
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer area */}
      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">Plumbing Supplies Co.</p>
      </div>
    </aside>
  );
}
