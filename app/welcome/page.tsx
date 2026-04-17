// Welcome page — shown once right after a user signs up or confirms their account.
// Protected by middleware (must be logged in to reach this page).
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
        {/* Icon */}
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

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <FeatureCard
            icon={<Truck className="w-5 h-5" />}
            title="Suppliers"
            description="Track who you buy from"
            color="blue"
          />
          <FeatureCard
            icon={<Package className="w-5 h-5" />}
            title="Products"
            description="Manage pricing tiers"
            color="green"
          />
          <FeatureCard
            icon={<Users className="w-5 h-5" />}
            title="Accounts"
            description="Retail & trade customers"
            color="purple"
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
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "purple";
}) {
  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800",
    purple: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800",
  };

  return (
    <div className={`rounded-xl border p-4 text-left ${colorMap[color]}`}>
      <div className="mb-2">{icon}</div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs opacity-70 mt-0.5">{description}</p>
    </div>
  );
}
