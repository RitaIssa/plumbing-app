// Root layout — wraps every page in the app.
// We add the sidebar here so it appears on all pages.

import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "SupplyBase — Business Manager",
  description: "Manage suppliers, products, and customer accounts",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning prevents a mismatch when next-themes sets the class on <html>
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 antialiased">
        <ThemeProvider>
          {/* AppShell shows the sidebar on app pages and hides it on auth pages */}
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
