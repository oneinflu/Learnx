"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "next-themes";

type Item = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 6h11v2H10v-2zM10 13h11v4H10v-4z" className="fill-current" />
    </svg>
  );
}
function CoursesIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M3 5h18v2H3V5zm0 4h12v2H3V9zm0 4h18v2H3v-2zm0 4h12v2H3v-2z" className="fill-current" />
    </svg>
  );
}
function StudentsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0v1H5v-1z" className="fill-current" />
    </svg>
  );
}
function CommunityIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M7 8a4 4 0 118 0 4 4 0 01-8 0zm-4 12a8 8 0 0116 0v2H3v-2z" className="fill-current" />
    </svg>
  );
}
function PaymentsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M3 5h18v4H3V5zm0 6h18v8H3v-8zm2 3h10v2H5v-2z" className="fill-current" />
    </svg>
  );
}
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 transition ${open ? "rotate-90" : ""}`} fill="none">
      <path d="M8 5l8 7-8 7" className="fill-current" />
    </svg>
  );
}
function MarketingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M3 4l14 6v6l-14 6V4zm16 6h2v6h-2v-6z" className="fill-current" />
    </svg>
  );
}
function AnalyticsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M5 3h2v18H5V3zm6 8h2v10h-2V11zm6-5h2v15h-2V6z" className="fill-current" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 3a8.94 8.94 0 00-.52-1.8l2.08-1.62-2-3.46-2.52 1a9.03 9.03 0 00-1.56-.9L15.7 1h-3.4l-.72 3.22c-.55.2-1.08.47-1.56.8l-2.52-1-2 3.46 2.08 1.62c-.23.58-.4 1.18-.52 1.8L1 12v4l3.54.94c.12.62.29 1.22.52 1.8L3 20.36l2 3.46 2.52-1c.48.33 1.01.6 1.56.8L12.3 29h3.4l.72-3.22c.55-.2 1.08-.47 1.56-.8l2.52 1 2-3.46-2.08-1.62c.23-.58.4-1.18.52-1.8L29 16v-4l-3.54-.94z" className="fill-current" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1015.5 14l5 5-1.5 1.5-5-5zM6.5 10a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" className="fill-current" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
      <path d="M12 2a6 6 0 016 6v4l2 3H4l2-3V8a6 6 0 016-6zm0 20a3 3 0 01-3-3h6a3 3 0 01-3 3z" className="fill-current" />
    </svg>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const [paymentsOpen, setPaymentsOpen] = useState(pathname.startsWith("/dashboard/payments"));
  const [studentsOpen, setStudentsOpen] = useState(pathname.startsWith("/dashboard/students"));
  const [marketingOpen, setMarketingOpen] = useState(pathname.startsWith("/dashboard/marketing"));
  const [analyticsOpen, setAnalyticsOpen] = useState(pathname.startsWith("/dashboard/analytics"));

  const items: Item[] = [
    { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
    { label: "Courses", href: "/dashboard/courses", icon: <CoursesIcon /> },
    { label: "Community", href: "/dashboard/community", icon: <CommunityIcon /> },
    { label: "Settings", href: "/dashboard/settings", icon: <SettingsIcon /> },
  ];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }
  const paymentsActive = pathname.startsWith("/dashboard/payments");
  const studentsActive = pathname.startsWith("/dashboard/students");
  const marketingActive = pathname.startsWith("/dashboard/marketing");
  const analyticsActive = pathname.startsWith("/dashboard/analytics");
  const settingsActive = pathname.startsWith("/dashboard/settings");
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="flex">
        <aside
          className={
            collapsed
              ? "flex h-screen w-20 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
              : "flex h-screen w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
          }
        >
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-md bg-zinc-900 dark:bg-zinc-50" />
              {!collapsed && <span className="text-sm font-semibold">SaaS Platform</span>}
            </div>
            <button
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed((c) => !c)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              <span className="sr-only">Toggle</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M4 6h16v2H4V6zm4 5h12v2H8v-2zm-4 5h16v2H4v-2z" className="fill-current" />
              </svg>
            </button>
          </div>
          <nav className="mt-2 flex-1 space-y-1 px-2">
            {items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={
                    active
                      ? "group flex items-center gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                      : "group flex items-center gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }
                >
                  <span
                    className={
                      active
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"
                    }
                  >
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
            {collapsed ? (
              <Link
                href="/dashboard/marketing/overview"
                aria-label="Marketing"
                className={
                  marketingActive
                    ? "group flex items-center gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                    : "group flex items-center gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }
              >
                <span className={marketingActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"}>
                  <MarketingIcon />
                </span>
              </Link>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setMarketingOpen((v) => !v)}
                  className={
                    marketingActive
                      ? "group flex w-full items-center justify-between gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                      : "group flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className={marketingActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"}>
                      <MarketingIcon />
                    </span>
                    <span className="truncate">Marketing</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    <ChevronIcon open={marketingOpen} />
                  </span>
                </button>
                {marketingOpen && (
                  <div className="mt-1 space-y-1 pl-9">
                    {[
                      { label: "Overview", href: "/dashboard/marketing/overview" },
                      { label: "Coupons", href: "/dashboard/marketing/coupons" },
                      { label: "Affiliates", href: "/dashboard/marketing/affiliates" },
                      { label: "Campaigns", href: "/dashboard/marketing/campaigns" },
                    ].map((sub) => {
                      const active = isActive(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={
                            active
                              ? "flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1.5 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                              : "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          }
                        >
                          <span className={active ? "h-1.5 w-1.5 rounded-full bg-indigo-500" : "h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"} />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {collapsed ? (
              <Link
                href="/dashboard/analytics/overview"
                aria-label="Analytics"
                className={
                  analyticsActive
                    ? "group flex items-center gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                    : "group flex items-center gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }
              >
                <span className={analyticsActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"}>
                  <AnalyticsIcon />
                </span>
              </Link>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setAnalyticsOpen((v) => !v)}
                  className={
                    analyticsActive
                      ? "group flex w-full items-center justify-between gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                      : "group flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className={analyticsActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"}>
                      <AnalyticsIcon />
                    </span>
                    <span className="truncate">Analytics</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    <ChevronIcon open={analyticsOpen} />
                  </span>
                </button>
                {analyticsOpen && (
                  <div className="mt-1 space-y-1 pl-9">
                    {[
                      { label: "Overview", href: "/dashboard/analytics/overview" },
                      { label: "Courses", href: "/dashboard/analytics/courses" },
                      { label: "Students", href: "/dashboard/analytics/students" },
                      { label: "Revenue", href: "/dashboard/analytics/revenue" },
                    ].map((sub) => {
                      const active = isActive(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={
                            active
                              ? "flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1.5 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                              : "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          }
                        >
                          <span className={active ? "h-1.5 w-1.5 rounded-full bg-indigo-500" : "h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"} />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {collapsed ? (
              <Link
                href="/dashboard/students/all"
                aria-label="Students"
                className={
                  studentsActive
                    ? "group flex items-center gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                    : "group flex items-center gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }
              >
                <span className={studentsActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"}>
                  <StudentsIcon />
                </span>
              </Link>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setStudentsOpen((v) => !v)}
                  className={
                    studentsActive
                      ? "group flex w-full items-center justify-between gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                      : "group flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className={studentsActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"}>
                      <StudentsIcon />
                    </span>
                    <span className="truncate">Students</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    <ChevronIcon open={studentsOpen} />
                  </span>
                </button>
                {studentsOpen && (
                  <div className="mt-1 space-y-1 pl-9">
                    {[
                      { label: "All", href: "/dashboard/students/all" },
                      { label: "Segments", href: "/dashboard/students/segments" },
                      { label: "Bulk & Import", href: "/dashboard/students/bulk" },
                    ].map((sub) => {
                      const active = isActive(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={
                            active
                              ? "flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1.5 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                              : "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          }
                        >
                          <span className={active ? "h-1.5 w-1.5 rounded-full bg-indigo-500" : "h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"} />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            {collapsed ? (
              <Link
                href="/dashboard/payments/overview"
                aria-label="Payments"
                className={
                  paymentsActive
                    ? "group flex items-center gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                    : "group flex items-center gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }
              >
                <span className={paymentsActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"}>
                  <PaymentsIcon />
                </span>
              </Link>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setPaymentsOpen((v) => !v)}
                  className={
                    paymentsActive
                      ? "group flex w-full items-center justify-between gap-3 rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                      : "group flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }
                >
                  <span className="flex items-center gap-3">
                    <span className={paymentsActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200"}>
                      <PaymentsIcon />
                    </span>
                    <span className="truncate">Payments</span>
                  </span>
                  <span className="text-zinc-500 dark:text-zinc-400">
                    <ChevronIcon open={paymentsOpen} />
                  </span>
                </button>
                {paymentsOpen && (
                  <div className="mt-1 space-y-1 pl-9">
                    {[
                      { label: "Overview", href: "/dashboard/payments/overview" },
                      { label: "Transactions", href: "/dashboard/payments/transactions" },
                      { label: "Payouts", href: "/dashboard/payments/payouts" },
                      { label: "Taxes", href: "/dashboard/payments/taxes" },
                    ].map((sub) => {
                      const active = isActive(sub.href);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={
                            active
                              ? "flex items-center gap-2 rounded-md bg-zinc-100 px-2 py-1.5 text-sm font-medium text-zinc-900 ring-0 transition dark:bg-zinc-800 dark:text-zinc-100"
                              : "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                          }
                        >
                          <span className={active ? "h-1.5 w-1.5 rounded-full bg-indigo-500" : "h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"} />
                          <span className="truncate">{sub.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </nav>
          
          <div className="border-t border-zinc-200 p-2 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            {!collapsed && <span>v0.1 • All systems normal</span>}
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center">
                <span className="absolute left-3 text-zinc-500 dark:text-zinc-400">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  placeholder="Search"
                  className="h-9 w-72 rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800" aria-label="Notifications">
                <BellIcon />
                <span className="absolute right-1 top-1 inline-block h-2 w-2 rounded-full bg-rose-500" />
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-300 bg-white text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                  <path d="M12 3a9 9 0 100 18c-3.866 0-7-3.134-7-7s3.134-7 7-7z" className="fill-current" />
                </svg>
              </button>
              <button className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                <span className="inline-block h-6 w-6 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="hidden md:inline">Founder</span>
              </button>
            </div>
          </header>
          <main className="flex-1 bg-zinc-50 p-6 dark:bg-black">{children}</main>
        </div>
      </div>
    </div>
  );
}
