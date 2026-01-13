"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type KPI = { label: string; value: number; suffix?: string };
type CoursePerf = { name: string; visits: number; signups: number; enrollments: number };
type SourcePerf = { source: string; visits: number; signups: number; enrollments: number };

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

export default function MarketingOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState(0);
  const [signups, setSignups] = useState(0);
  const [enrollments, setEnrollments] = useState(0);
  const [courses, setCourses] = useState<CoursePerf[]>([]);
  const [sources, setSources] = useState<SourcePerf[]>([]);
  const [affiliateSharePct, setAffiliateSharePct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisits(12450);
      setSignups(1860);
      setEnrollments(742);
      setCourses([
        { name: "AI Foundations", visits: 5200, signups: 880, enrollments: 360 },
        { name: "Prompt Engineering", visits: 4200, signups: 610, enrollments: 260 },
        { name: "Data Viz Mastery", visits: 3050, signups: 370, enrollments: 122 },
      ]);
      setSources([
        { source: "Organic", visits: 5200, signups: 830, enrollments: 340 },
        { source: "Ads", visits: 3800, signups: 560, enrollments: 210 },
        { source: "Affiliates", visits: 2450, signups: 370, enrollments: 162 },
        { source: "Email", visits: 1400, signups: 100, enrollments: 30 },
      ]);
      setAffiliateSharePct(22);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const kpis: KPI[] = useMemo(() => {
    const cr = visits > 0 ? Math.round((enrollments / visits) * 1000) / 10 : 0;
    return [
      { label: "Visitors", value: visits },
      { label: "Signups", value: signups },
      { label: "Enrollments", value: enrollments },
      { label: "Conversion rate", value: cr, suffix: "%" },
    ];
  }, [visits, signups, enrollments]);

  const funnel = useMemo(() => {
    const v = visits || 0;
    const s = signups || 0;
    const e = enrollments || 0;
    const sPct = v ? Math.round((s / v) * 100) : 0;
    const ePct = s ? Math.round((e / s) * 100) : 0;
    const drop1 = 100 - sPct;
    const drop2 = 100 - ePct;
    return { v, s, e, sPct, ePct, drop1, drop2 };
  }, [visits, signups, enrollments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Marketing</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Track how learners discover and purchase your courses</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/marketing/campaigns"
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Create campaign
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <Card title="Top KPIs">
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mx-auto h-7 w-24">
                      <SkeletonLine w={96} />
                    </div>
                    <div className="mt-2 mx-auto h-6 w-16">
                      <SkeletonLine w={64} />
                    </div>
                  </div>
                ))}
              </div>
            ) : visits > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {kpis.map((k) => (
                  <div key={k.label} className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">{k.label}</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {k.value.toLocaleString()}
                      {k.suffix ? k.suffix : ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No data yet"
                description="Start campaigns or share your course links to see visitors, signups, and enrollments."
                action={
                  <Link
                    href="/dashboard/marketing/campaigns"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Create campaign
                  </Link>
                }
              />
            )}
          </Card>

          <Card title="Conversion funnel">
            {loading ? (
              <div className="space-y-3">
                <SkeletonLine w={280} />
                <SkeletonLine w={320} />
                <SkeletonLine w={220} />
              </div>
            ) : visits > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm">Visit</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">{funnel.v.toLocaleString()}</div>
                </div>
                <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-2 rounded bg-indigo-500" style={{ width: "100%" }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Signup</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {funnel.s.toLocaleString()} • {funnel.sPct}% conversion • {funnel.drop1}% drop-off
                  </div>
                </div>
                <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-2 rounded bg-indigo-500" style={{ width: `${funnel.sPct}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm">Purchase</div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {funnel.e.toLocaleString()} • {funnel.ePct}% conversion • {funnel.drop2}% drop-off
                  </div>
                </div>
                <div className="h-2 rounded bg-zinc-200 dark:bg-zinc-800">
                  <div className="h-2 rounded bg-indigo-500" style={{ width: `${Math.min(100, funnel.ePct)}%` }} />
                </div>
              </div>
            ) : (
              <EmptyState title="No data yet" description="Funnel metrics will appear as you begin acquiring traffic." />
            )}
          </Card>

          <Card
            title="Top converting courses"
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
                {courses.map((c) => {
                  const cr = c.visits ? Math.round((c.enrollments / c.visits) * 1000) / 10 : 0;
                  return (
                    <div key={c.name} className="flex items-center justify-between py-2">
                      <div className="truncate text-sm">{c.name}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{cr}% conversion</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="No courses yet" description="Create a course to see conversion performance." />
            )}
          </Card>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <Card title="Top traffic sources">
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
                {sources.map((s) => {
                  const cr = s.visits ? Math.round((s.enrollments / s.visits) * 1000) / 10 : 0;
                  return (
                    <div key={s.source} className="flex items-center justify-between py-2">
                      <div className="truncate text-sm">{s.source}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        {s.visits.toLocaleString()} visits • {cr}% conv
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="No sources yet" description="Connect analytics and start campaigns to see traffic sources." />
            )}
          </Card>

          <Card title="Affiliate contribution">
            {loading ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <SkeletonLine w={80} />
              </div>
            ) : affiliateSharePct > 0 ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-3xl font-semibold">{affiliateSharePct}%</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">of enrollments from affiliates</div>
              </div>
            ) : (
              <EmptyState
                title="No affiliate data"
                description="Launch an affiliate program to attribute enrollments."
                action={<Link href="/dashboard/marketing/affiliates" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">Manage affiliates</Link>}
              />
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}

