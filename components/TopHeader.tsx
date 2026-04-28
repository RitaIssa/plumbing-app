"use client";

import UserAvatar from "./UserAvatar";

export default function TopHeader() {
  return (
    <header className="h-14 shrink-0 flex items-center justify-end px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
      <UserAvatar />
    </header>
  );
}
