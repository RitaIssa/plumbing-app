// Welcome page — shown once right after a user signs up.
// Protected by middleware (must be logged in).

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Wrench, LayoutDashboard, Truck, Package, Users } from "lucide-react";

export default async function WelcomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = user?.user_metadata?.name as string | undefined;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Wrench className="w-8 h-8 text-blue-400" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
          Welcome{name ? `, ${name}` : ""}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-base leading-relaxed">
          Your PlumbingPro account is set up and ready to go. Start by adding your
          suppliers, then build out your product catalogue and customer accounts.
        </p>

        {/* Feature highlights — neutral cards, no colour coding */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <FeatureCard
            icon={<Truck className="w-5 h-5" />}
            title="Suppliers"
            description="Track who you buy from"
          />
          <FeatureCard
            icon={<Package className="w-5 h-5" />}
            title="Products"
            description="Manage pricing tiers"
          />
          <FeatureCard
            icon={<Users className="w-5 h-5" />}
            title="Accounts"
            description="Retail & trade customers"
          />
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-left">
      <div className="mb-2 text-slate-500 dark:text-slate-400">{icon}</div>
      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{title}</p>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
    </div>
  );
}
