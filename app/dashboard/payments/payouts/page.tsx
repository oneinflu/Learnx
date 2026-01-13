"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type PayoutStatus = "processing" | "completed" | "failed";
type Payout = { id: string; amount: number; currency: string; bank: string; status: PayoutStatus; eta: string };

function formatCurrency(v: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v);
}

function Badge({ status }: { status: PayoutStatus }) {
  const classes =
    status === "completed"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : status === "failed"
      ? "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
      : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
  const label = status === "completed" ? "Completed" : status === "failed" ? "Failed" : "Processing";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${classes}`}>{label}</span>;
}

function Card({ title, children, actions }: { title: string; children: React.ReactNode; actions?: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">{title}</h2>
        {actions}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-4 ${w} animate-pulse rounded bg-zinc-200 dark:bg-zinc-800`} />;
}

export default function PayoutsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bankConnected, setBankConnected] = useState<boolean | null>(null);
  const [available, setAvailable] = useState(0);
  const [nextPayout, setNextPayout] = useState(0);
  const [lastPayoutDate, setLastPayoutDate] = useState<string | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [currency] = useState("USD");

  useEffect(() => {
    const timer = setTimeout(() => {
      const shouldError = false;
      if (shouldError) {
        setError("Failed to load payouts data");
        setLoading(false);
        return;
      }
      const connected = true;
      setBankConnected(connected);
      if (!connected) {
        setAvailable(0);
        setNextPayout(0);
        setLastPayoutDate(null);
        setPayouts([]);
      } else {
        setAvailable(12450);
        setNextPayout(2350);
        setLastPayoutDate("2026-01-08T10:00:00Z");
        setPayouts([
          { id: "po_9001", amount: 2000, currency, bank: "Chase •••• 1234", status: "completed", eta: "2026-01-08" },
          { id: "po_9002", amount: 350, currency, bank: "Chase •••• 1234", status: "processing", eta: "2026-01-15" },
          { id: "po_9003", amount: 1200, currency, bank: "Chase •••• 1234", status: "failed", eta: "2026-01-06" },
        ]);
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currency]);

  const hasData = useMemo(() => payouts.length > 0, [payouts]);

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
        <div className="text-sm font-semibold">Error</div>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Payouts</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Track money moving from platform to bank</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card title="Available balance">
          {loading ? <SkeletonLine w="w-1/2" /> : <div className="text-2xl font-semibold">{formatCurrency(available, currency)}</div>}
        </Card>
        <Card title="Next payout amount">
          {loading ? <SkeletonLine w="w-1/2" /> : <div className="text-2xl font-semibold">{formatCurrency(nextPayout, currency)}</div>}
        </Card>
        <Card title="Last payout date">
          {loading ? <SkeletonLine w="w-1/2" /> : <div className="text-sm font-medium">{lastPayoutDate ? new Date(lastPayoutDate).toLocaleDateString() : "—"}</div>}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 space-y-4">
          <Card title="Payouts">
            {loading ? (
              <div className="space-y-2">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </div>
            ) : !hasData ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-medium">No payouts yet</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Payouts will appear once funds are available and scheduled.</p>
              </div>
            ) : (
              <div className="max-h-[420px] overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
                    <tr className="text-left">
                      <th className="px-3 py-2 font-semibold">Payout ID</th>
                      <th className="px-3 py-2 font-semibold">Amount</th>
                      <th className="px-3 py-2 font-semibold">Bank account</th>
                      <th className="px-3 py-2 font-semibold">Status</th>
                      <th className="px-3 py-2 font-semibold">Expected date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                    {payouts.map((p) => (
                      <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                        <td className="px-3 py-2">{p.id}</td>
                        <td className="px-3 py-2">{formatCurrency(p.amount, p.currency)}</td>
                        <td className="px-3 py-2">{p.bank}</td>
                        <td className="px-3 py-2">
                          <Badge status={p.status} />
                        </td>
                        <td className="px-3 py-2">{new Date(p.eta).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </section>
        <aside className="lg:col-span-4 space-y-4">
          <Card
            title="Bank account"
            actions={
              <Link
                href="/dashboard/settings"
                className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Manage payout settings
              </Link>
            }
          >
            {loading ? (
              <SkeletonLine />
            ) : bankConnected ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                Connected to bank
              </div>
            ) : (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                Bank not connected. Connect to receive payouts.
              </div>
            )}
          </Card>

          {!loading && payouts.some((p) => p.status === "failed") && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
              A payout failed recently. Please verify your bank details and retry.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

