"use client";
import { useEffect, useMemo, useState } from "react";

type KPI = { label: string; value: number; suffix?: string };

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
function SkeletonLine({ w = 200 }: { w?: number }) {
  return <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: w }} />;
}
function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-800/40">
      <div className="text-sm font-medium">{title}</div>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
function Donut({ values, labels }: { values: number[]; labels: string[] }) {
  const total = Math.max(1, values.reduce((a, b) => a + b, 0));
  const r = 42;
  const w = 12;
  const c = 2 * Math.PI * r;
  const segs = values.map((v) => (v / total) * c);
  const colors = ["text-indigo-500", "text-emerald-500", "text-amber-500"];
  const starts = segs.map((_, i) => segs.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <g transform="rotate(-90 60 60)">
          <circle cx="60" cy="60" r={r} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth={w} fill="none" />
          {segs.map((s, i) => (
            <circle
              key={i}
              cx="60"
              cy="60"
              r={r}
              stroke="currentColor"
              className={colors[i % colors.length]}
              strokeWidth={w}
              strokeDasharray={`${s} ${c - s}`}
              strokeDashoffset={-starts[i]}
              fill="none"
            />
          ))}
        </g>
      </svg>
      <div className="space-y-1">
        {labels.map((l, i) => (
          <div key={l} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
            <span className={`h-2 w-2 rounded-full ${["bg-indigo-500", "bg-emerald-500", "bg-amber-500"][i % 3]}`} />
            <span>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RevenueAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [mrr, setMrr] = useState(0);
  const [arpu, setArpu] = useState(0);
  const [refundRate, setRefundRate] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);

  const [revSeries, setRevSeries] = useState<number[]>([]);
  const [revLabels, setRevLabels] = useState<string[]>([]);
  const [courseRev, setCourseRev] = useState<Array<{ name: string; revenue: number; enrollments: number; refunds: number }>>([]);
  const [methodSplit, setMethodSplit] = useState<number[]>([]);
  const methodLabels = useMemo(() => ["Card", "UPI", "Bank Transfer"], []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMrr(42000);
      setArpu(52.4);
      setRefundRate(2.1);
      setNetRevenue(7800);

      setRevLabels(["M1", "M2", "M3", "M4", "M5", "M6"]);
      setRevSeries([6200, 6900, 7200, 7600, 8100, 7800]);

      setCourseRev([
        { name: "AI Foundations", revenue: 71280, enrollments: 360, refunds: 12 },
        { name: "Prompt Engineering", revenue: 38620, enrollments: 260, refunds: 8 },
        { name: "Data Viz Mastery", revenue: 12078, enrollments: 122, refunds: 5 },
      ]);

      setMethodSplit([0.62, 0.27, 0.11].map((p) => Math.round(p * 100)));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const kpis: KPI[] = useMemo(() => {
    return [
      { label: "MRR", value: mrr },
      { label: "ARPU", value: arpu },
      { label: "Refund rate", value: refundRate, suffix: "%" },
      { label: "Net revenue", value: netRevenue },
    ];
  }, [mrr, arpu, refundRate, netRevenue]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Revenue Analytics</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Understand revenue trends and monetization health</p>
        </div>
      </div>

      <Card title="KPIs">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mx-auto h-6 w-24">
                  <SkeletonLine w={96} />
                </div>
                <div className="mt-2 mx-auto h-6 w-20">
                  <SkeletonLine w={80} />
                </div>
              </div>
            ))}
          </div>
        ) : mrr > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{k.label}</div>
                <div className="mt-1 text-2xl font-semibold">
                  {k.label === "MRR" || k.label === "Net revenue" ? `$${k.value.toLocaleString()}` : k.value.toLocaleString()}
                  {k.label === "ARPU" ? "" : k.suffix ? k.suffix : ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No revenue data" description="Revenue KPIs will appear once payments are received." />
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card title="Revenue over time">
            {loading ? (
              <div className="space-y-3">
                <SkeletonLine w={320} />
                <SkeletonLine w={280} />
                <SkeletonLine w={300} />
              </div>
            ) : revSeries.length ? (
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-3">
                  {revLabels.map((label, i) => {
                    const val = revSeries[i] || 0;
                    const h = Math.min(160, val / 40);
                    return (
                      <div key={label} className="flex flex-col items-center gap-2">
                        <div className="w-6 rounded bg-indigo-500" style={{ height: `${Math.max(12, h)}px` }} />
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState title="No revenue yet" description="Time series appears as payments come in." />
            )}
          </Card>
        </div>
        <div className="lg:col-span-4">
          <Card title="Payment method split">
            {loading ? (
              <div className="flex items-center gap-4">
                <SkeletonLine w={120} />
                <div>
                  <SkeletonLine w={120} />
                  <div className="mt-2">
                    <SkeletonLine w={160} />
                  </div>
                </div>
              </div>
            ) : methodSplit.length ? (
              <Donut values={methodSplit} labels={methodLabels} />
            ) : (
              <EmptyState title="No payment data" description="Payment methods will show once transactions occur." />
            )}
          </Card>
        </div>
      </div>

      <Card title="Revenue by course">
        {loading ? (
          <div className="space-y-3">
            <SkeletonLine w={320} />
            <SkeletonLine w={280} />
            <SkeletonLine w={300} />
          </div>
        ) : courseRev.length ? (
          <div className="space-y-3">
            {courseRev.map((c) => {
              const w = Math.min(100, Math.round((c.revenue / courseRev[0].revenue) * 100));
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">{c.name}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">${c.revenue.toLocaleString()}</div>
                  </div>
                  <div className="mt-1 h-2 rounded bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-2 rounded bg-emerald-500" style={{ width: `${w}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No course revenue" description="Revenue by course appears after enrollments." />
        )}
      </Card>

      <Card title="Breakdown by course">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <SkeletonLine w={180} />
                <SkeletonLine w={80} />
                <SkeletonLine w={60} />
                <SkeletonLine w={60} />
              </div>
            ))}
          </div>
        ) : courseRev.length ? (
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="max-h-[420px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-semibold">Course</th>
                    <th className="px-3 py-2 font-semibold">Revenue</th>
                    <th className="px-3 py-2 font-semibold">Enrollments</th>
                    <th className="px-3 py-2 font-semibold">Refunds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {courseRev.map((c) => (
                    <tr key={c.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="px-3 py-2">{c.name}</td>
                      <td className="px-3 py-2">${c.revenue.toLocaleString()}</td>
                      <td className="px-3 py-2">{c.enrollments.toLocaleString()}</td>
                      <td className="px-3 py-2">{c.refunds.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState title="No breakdown data" description="Course breakdown appears after revenue events." />
        )}
      </Card>
    </div>
  );
}
