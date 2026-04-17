"use client";

// AppShell — wraps the whole app and shows the sidebar only on authenticated pages.
// Auth pages (login, signup, etc.) get a full-screen layout with no sidebar.
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const AUTH_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password", "/welcome"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
