// Root layout — wraps every page in the app.
// We add the sidebar here so it appears on all pages.

import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
        <div className="flex min-h-screen">
          {/* Sidebar navigation on the left */}
          <Sidebar />

          {/* Main content area on the right */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
