"use client";
import { useEffect, useMemo, useState } from "react";

type KPI = {
  lifetimeRevenue: number;
  monthRevenue: number;
  pendingPayouts: number;
  refunds: number;
};

type TxStatus = "succeeded" | "failed" | "refunded" | "pending";
type Tx = { id: string; amount: number; currency: string; status: TxStatus; when: string; customer: string };

function formatCurrency(v: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v);
}

function Badge({ status }: { status: TxStatus }) {
  const classes =
    status === "succeeded"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : status === "failed"
      ? "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
      : status === "refunded"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
  const label =
    status === "succeeded" ? "Succeeded" : status === "failed" ? "Failed" : status === "refunded" ? "Refunded" : "Pending";
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

function RevenueLineChart({ points }: { points: number[] }) {
  const max = Math.max(1, ...points);
  return (
    <div className="h-32 w-full rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-full items-end gap-1">
        {points.map((p, i) => (
          <div key={i} className="w-full bg-indigo-500/30" style={{ height: `${(p / max) * 100}%` }} />
        ))}
      </div>
    </div>
  );
}

function PaymentsDonut({ succeeded, failed }: { succeeded: number; failed: number }) {
  const total = Math.max(1, succeeded + failed);
  const successPct = Math.round((succeeded / total) * 100);
  type WithVar = React.CSSProperties & { ["--p"]: string };
  const style: WithVar = { ["--p"]: `${successPct}%` };
  return (
    <div className="flex items-center gap-4">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[conic-gradient(theme(colors.indigo.500)_0%_var(--p),theme(colors.rose.500)_var(--p)_100%)]" style={style}>
        <div className="h-12 w-12 rounded-full bg-white dark:bg-zinc-900" />
      </div>
      <div className="text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" /> Succeeded {succeeded}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-rose-500" /> Failed {failed}
        </div>
      </div>
    </div>
  );
}

export default function PaymentsOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [currency] = useState("USD");

  useEffect(() => {
    const timer = setTimeout(() => {
      const shouldError = false;
      if (shouldError) {
        setError("Failed to load payments data");
        setLoading(false);
        return;
      }
      const hasData = true;
      if (!hasData) {
        setKpi({ lifetimeRevenue: 0, monthRevenue: 0, pendingPayouts: 0, refunds: 0 });
        setTxs([]);
      } else {
        setKpi({ lifetimeRevenue: 182340, monthRevenue: 7820, pendingPayouts: 2340, refunds: 560 });
        setTxs([
          { id: "tx_1", amount: 199, currency, status: "succeeded", when: "Today, 10:12 AM", customer: "alex@example.com" },
          { id: "tx_2", amount: 149, currency, status: "failed", when: "Today, 08:43 AM", customer: "maya@example.com" },
          { id: "tx_3", amount: 99, currency, status: "refunded", when: "Yesterday, 06:21 PM", customer: "jon@example.com" },
          { id: "tx_4", amount: 249, currency, status: "succeeded", when: "Yesterday, 03:17 PM", customer: "lia@example.com" },
        ]);
      }
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currency]);

  const revenuePoints = useMemo(() => [12, 18, 25, 20, 30, 28, 36, 42, 40, 48, 52, 60], []);
  const succeededCount = useMemo(() => txs.filter((t) => t.status === "succeeded").length, [txs]);
  const failedCount = useMemo(() => txs.filter((t) => t.status === "failed").length, [txs]);

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
          <h1 className="text-lg font-semibold">Payments</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Track your revenue, payouts, and refunds</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total revenue">
          {loading ? (
            <SkeletonLine w="w-1/2" />
          ) : (
            <div className="text-2xl font-semibold">{formatCurrency(kpi?.lifetimeRevenue ?? 0, currency)}</div>
          )}
        </Card>
        <Card title="This month">
          {loading ? (
            <SkeletonLine w="w-1/2" />
          ) : (
            <div className="text-2xl font-semibold">{formatCurrency(kpi?.monthRevenue ?? 0, currency)}</div>
          )}
        </Card>
        <Card title="Pending payouts">
          {loading ? (
            <SkeletonLine w="w-1/2" />
          ) : (
            <div className="text-2xl font-semibold">{formatCurrency(kpi?.pendingPayouts ?? 0, currency)}</div>
          )}
        </Card>
        <Card title="Refund amount">
          {loading ? (
            <SkeletonLine w="w-1/2" />
          ) : (
            <div className="text-2xl font-semibold">{formatCurrency(kpi?.refunds ?? 0, currency)}</div>
          )}
        </Card>
      </div>

      {/* Charts + Activity */}
      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 space-y-4">
          <Card title="Revenue over time">
            {loading ? (
              <div className="space-y-2">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </div>
            ) : (
              <RevenueLineChart points={revenuePoints} />
            )}
          </Card>

          <Card title="Recent activity">
            {loading ? (
              <div className="space-y-2">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </div>
            ) : txs.length === 0 ? (
              <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-medium">No payments yet</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Transactions will appear as you start selling.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {txs.map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="text-sm">{t.customer}</div>
                    <div className="text-sm font-medium">{formatCurrency(t.amount, t.currency)}</div>
                    <Badge status={t.status} />
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{t.when}</div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
        <aside className="lg:col-span-4 space-y-4">
          <Card title="Success vs failed">
            {loading ? (
              <SkeletonLine />
            ) : (
              <PaymentsDonut succeeded={succeededCount} failed={failedCount} />
            )}
          </Card>
          <Card title="Notes">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">Connect your processor to see live data.</div>
          </Card>
        </aside>
      </div>
    </div>
  );
}
