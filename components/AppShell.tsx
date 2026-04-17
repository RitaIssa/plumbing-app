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
    // h-screen + overflow-hidden locks the shell to the viewport so only the main area scrolls
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
