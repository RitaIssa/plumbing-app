// Root layout — wraps every page in the app.
// We add the sidebar here so it appears on all pages.

import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "PlumbingPro — Business Manager",
  description: "Manage suppliers, products, and customer accounts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased">
        {/* AppShell shows the sidebar on app pages and hides it on auth pages */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
