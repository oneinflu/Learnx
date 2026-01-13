"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type KPI = { label: string; value: number; suffix?: string };
type CoursePerf = { name: string; enrollments: number; completionRate: number };
type SourcePerf = { source: string; visits: number; enrollments: number };
type Period = "weekly" | "monthly";

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

export default function AnalyticsOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("weekly");
  const [revenueTotal, setRevenueTotal] = useState(0);
  const [activeLearners, setActiveLearners] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [revenueSeries, setRevenueSeries] = useState<number[]>([]);
  const [enrollmentSeries, setEnrollmentSeries] = useState<number[]>([]);
  const [courses, setCourses] = useState<CoursePerf[]>([]);
  const [sources, setSources] = useState<SourcePerf[]>([]);
  const [activeVsInactive, setActiveVsInactive] = useState<{ active: number; inactive: number }>({ active: 0, inactive: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevenueTotal(184320);
      setActiveLearners(1260);
      setCompletionRate(58);
      setConversionRate(5);
      setRevenueSeries([12800, 15640, 14210, 16880, 17550, 16240]);
      setEnrollmentSeries([180, 220, 205, 248, 260, 232]);
      setCourses([
        { name: "AI Foundations", enrollments: 360, completionRate: 62 },
        { name: "Prompt Engineering", enrollments: 260, completionRate: 55 },
        { name: "Data Viz Mastery", enrollments: 122, completionRate: 49 },
      ]);
      setSources([
        { source: "Organic", visits: 5200, enrollments: 340 },
        { source: "Ads", visits: 3800, enrollments: 210 },
        { source: "Affiliates", visits: 2450, enrollments: 162 },
        { source: "Email", visits: 1400, enrollments: 30 },
      ]);
      setActiveVsInactive({ active: 1260, inactive: 380 });
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const kpis: KPI[] = useMemo(() => {
    return [
      { label: "Total revenue", value: revenueTotal },
      { label: "Active learners", value: activeLearners },
      { label: "Course completion rate", value: completionRate, suffix: "%" },
      { label: "Conversion rate", value: conversionRate, suffix: "%" },
    ];
  }, [revenueTotal, activeLearners, completionRate, conversionRate]);

  const labels = useMemo(() => {
    return period === "weekly" ? ["W1", "W2", "W3", "W4", "W5", "W6"] : ["M1", "M2", "M3", "M4", "M5", "M6"];
  }, [period]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Analytics</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Understand how your academy is performing</p>
        </div>
        <Link
          href="/dashboard/marketing/overview"
          className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Marketing
        </Link>
      </div>

      <Card title="Top KPIs">
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
        ) : revenueTotal > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{k.label}</div>
                <div className="mt-1 text-2xl font-semibold">
                  {k.label === "Total revenue" ? `$${k.value.toLocaleString()}` : k.value.toLocaleString()}
                  {k.suffix ? k.suffix : ""}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No data yet" description="Start sharing your courses and inviting learners to see analytics." />
        )}
      </Card>

      <Card
        title="Revenue & enrollments"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPeriod("weekly")}
              className={period === "weekly" ? "inline-flex h-7 items-center justify-center rounded-md bg-indigo-600 px-2 text-xs font-medium text-white" : "inline-flex h-7 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"}
            >
              Weekly
            </button>
            <button
              onClick={() => setPeriod("monthly")}
              className={period === "monthly" ? "inline-flex h-7 items-center justify-center rounded-md bg-indigo-600 px-2 text-xs font-medium text-white" : "inline-flex h-7 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"}
            >
              Monthly
            </button>
          </div>
        }
      >
        {loading ? (
          <div className="space-y-3">
            <SkeletonLine w={320} />
            <SkeletonLine w={280} />
            <SkeletonLine w={300} />
          </div>
        ) : revenueSeries.length ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <div>Revenue</div>
              <div>Enrollments</div>
            </div>
            <div className="grid grid-cols-6 gap-3">
              {labels.map((label, i) => {
                const rev = revenueSeries[i] || 0;
                const enr = enrollmentSeries[i] || 0;
                const revH = Math.min(160, Math.round(rev / 200));
                const enrH = Math.min(160, enr * 3);
                return (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="flex items-end gap-2">
                      <div className="w-6 rounded bg-indigo-500" style={{ height: `${Math.max(16, revH)}px` }} />
                      <div className="w-6 rounded bg-emerald-500" style={{ height: `${Math.max(12, enrH)}px` }} />
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="No data yet" description="Chart will populate as you begin selling and enrolling students." />
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <Card
            title="Top performing courses"
            actions={<Link href="/dashboard/courses" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">View courses</Link>}
          >
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <SkeletonLine w={180} />
                    <SkeletonLine w={80} />
                  </div>
                ))}
              </div>
            ) : courses.length ? (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {courses.map((c) => (
                  <div key={c.name} className="flex items-center justify-between py-2">
                    <div className="truncate text-sm">{c.name}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.enrollments} enrollments • {c.completionRate}% completion</div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No courses yet" description="Create courses to see performance insights." />
            )}
          </Card>
          <Card title="Active vs inactive students">
            {loading ? (
              <div className="space-y-2">
                <SkeletonLine w={220} />
              </div>
            ) : activeVsInactive.active + activeVsInactive.inactive > 0 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <div className="text-sm">Active</div>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{activeVsInactive.active}</div>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-zinc-400" />
                  <div className="text-sm">Inactive</div>
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{activeVsInactive.inactive}</div>
              </div>
            ) : (
              <EmptyState title="No student data" description="Invite and engage students to see activity distribution." />
            )}
          </Card>
        </div>
        <aside className="lg:col-span-4 space-y-6">
          <Card title="Traffic sources summary">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <SkeletonLine w={120} />
                    <SkeletonLine w={80} />
                  </div>
                ))}
              </div>
            ) : sources.length ? (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {sources.map((s) => (
                  <div key={s.source} className="flex items-center justify-between py-2">
                    <div className="truncate text-sm">{s.source}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {s.visits.toLocaleString()} visits • {s.enrollments} enrollments
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No sources yet" description="Connect analytics to track acquisition channels." />
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
