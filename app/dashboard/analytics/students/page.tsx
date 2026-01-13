"use client";
import { useEffect, useMemo, useState } from "react";

type KPI = { label: string; value: number; suffix?: string };
type Status = "all" | "active" | "inactive";
type RetentionMatrix = number[][];

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

function Donut({ active, inactive }: { active: number; inactive: number }) {
  const total = Math.max(0, active + inactive);
  const pct = total === 0 ? 0 : Math.round((active / total) * 100);
  const r = 42;
  const w = 12;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="flex items-center gap-4">
      <svg width="120" height="120" viewBox="0 0 120 120">
        <g transform="rotate(-90 60 60)">
          <circle cx="60" cy="60" r={r} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth={w} fill="none" />
          <circle
            cx="60"
            cy="60"
            r={r}
            stroke="currentColor"
            className="text-emerald-500"
            strokeWidth={w}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            fill="none"
          />
        </g>
      </svg>
      <div>
        <div className="text-2xl font-semibold">{pct}% active</div>
        <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
          {active.toLocaleString()} active • {inactive.toLocaleString()} inactive
        </div>
      </div>
    </div>
  );
}

function Heat({ matrix, rowLabels, colLabels }: { matrix: RetentionMatrix; rowLabels: string[]; colLabels: string[] }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[120px_1fr] items-start gap-3">
        <div />
        <div className="grid grid-cols-6 gap-2">
          {colLabels.map((c) => (
            <div key={c} className="text-xs text-zinc-600 dark:text-zinc-400 text-center">
              {c}
            </div>
          ))}
        </div>
        {matrix.map((row, i) => (
          <div key={i} className="contents">
            <div className="text-xs text-zinc-700 dark:text-zinc-300">{rowLabels[i]}</div>
            <div className="grid grid-cols-6 gap-2">
              {row.map((v, j) => {
                const alpha = Math.min(1, Math.max(0.15, v / 100));
                const bg = `rgba(99,102,241,${alpha})`;
                return (
                  <div key={j} className="rounded-md p-2 text-center" style={{ backgroundColor: bg }}>
                    <div className="text-xs font-medium text-white">{v}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>("AI Foundations");
  const [status, setStatus] = useState<Status>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [totalStudents, setTotalStudents] = useState(0);
  const [activeStudents, setActiveStudents] = useState(0);
  const [inactiveStudents, setInactiveStudents] = useState(0);
  const [avgCompletion, setAvgCompletion] = useState(0);
  const [dailyActive, setDailyActive] = useState<number[]>([]);
  const [retention, setRetention] = useState<RetentionMatrix>([]);

  const courses = useMemo(() => ["AI Foundations", "Prompt Engineering", "Data Viz Mastery"], []);

  useEffect(() => {
    if (!selectedCourse) return;
    const timer = setTimeout(() => {
      const base =
        selectedCourse === "AI Foundations"
          ? {
              total: 1200,
              active: 780,
              completion: 62,
              daily: [620, 640, 600, 680, 700, 720, 680, 660, 630, 650, 690, 710, 705, 695],
              retention: [
                [100, 82, 70, 62, 58, 52],
                [100, 80, 68, 60, 55, 50],
                [100, 78, 66, 58, 52, 47],
                [100, 76, 64, 56, 50, 45],
                [100, 74, 62, 54, 48, 44],
                [100, 72, 60, 52, 46, 42],
              ],
            }
          : selectedCourse === "Prompt Engineering"
          ? {
              total: 800,
              active: 520,
              completion: 55,
              daily: [420, 440, 410, 460, 480, 500, 470, 450, 430, 445, 470, 490, 485, 475],
              retention: [
                [100, 78, 66, 58, 52, 47],
                [100, 76, 64, 56, 50, 45],
                [100, 74, 62, 54, 48, 43],
                [100, 72, 60, 52, 46, 41],
                [100, 70, 58, 50, 44, 40],
                [100, 68, 56, 48, 42, 38],
              ],
            }
          : {
              total: 420,
              active: 260,
              completion: 49,
              daily: [220, 235, 210, 240, 255, 265, 250, 240, 230, 235, 245, 255, 250, 245],
              retention: [
                [100, 74, 60, 52, 46, 41],
                [100, 72, 58, 50, 44, 39],
                [100, 70, 56, 48, 42, 37],
                [100, 68, 54, 46, 40, 35],
                [100, 66, 52, 44, 38, 34],
                [100, 64, 50, 42, 36, 32],
              ],
            };

      const fromDate = from ? new Date(from) : null;
      const toDate = to ? new Date(to) : null;
      let rangeFactor = 1;
      if (fromDate && toDate && toDate >= fromDate) {
        const days = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime()) / 86400000) + 1);
        rangeFactor = Math.min(1, Math.max(0.3, days / 30));
      } else if (fromDate || toDate) {
        rangeFactor = 0.7;
      }

      let act = Math.round(base.active * rangeFactor);
      let tot = Math.round(base.total * rangeFactor);
      let inact = Math.max(0, tot - act);
      let comp = base.completion;
      if (status === "active") {
        tot = act;
        inact = 0;
        comp = Math.min(100, Math.round(base.completion + 5));
      } else if (status === "inactive") {
        tot = inact;
        act = 0;
        comp = Math.max(0, Math.round(base.completion - 10));
      }

      const daily = base.daily.map((d) => {
        const s = status === "inactive" ? 0.15 : 1;
        return Math.round(d * rangeFactor * s);
      });

      const ret = base.retention.map((row) =>
        row.map((v) => {
          const s = status === "inactive" ? 0.8 : 1;
          return Math.max(0, Math.min(100, Math.round(v * rangeFactor * s)));
        })
      );

      setTotalStudents(tot);
      setActiveStudents(act);
      setInactiveStudents(inact);
      setAvgCompletion(comp);
      setDailyActive(daily);
      setRetention(ret);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedCourse, status, from, to]);

  const kpis: KPI[] = useMemo(() => {
    return [
      { label: "Total students", value: totalStudents },
      { label: "Active students", value: activeStudents },
      { label: "Inactive students", value: inactiveStudents },
      { label: "Avg completion %", value: avgCompletion, suffix: "%" },
    ];
  }, [totalStudents, activeStudents, inactiveStudents, avgCompletion]);

  const dalLabels = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (13 - i));
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });
  }, []);

  const cohortLabels = useMemo(() => ["Cohort A", "Cohort B", "Cohort C", "Cohort D", "Cohort E", "Cohort F"], []);
  const periodLabels = useMemo(() => ["P1", "P2", "P3", "P4", "P5", "P6"], []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Student Analytics</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Understand learner behavior and retention</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Course</div>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setLoading(true);
                setSelectedCourse(e.target.value);
              }}
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            >
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Status</div>
            <select
              value={status}
              onChange={(e) => {
                setLoading(true);
                setStatus(e.target.value as Status);
              }}
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            >
              {["all", "active", "inactive"].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Enrollment from</div>
            <input
              type="date"
              value={from}
              onChange={(e) => {
                setLoading(true);
                setFrom(e.target.value);
              }}
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            />
          </div>
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Enrollment to</div>
            <input
              type="date"
              value={to}
              onChange={(e) => {
                setLoading(true);
                setTo(e.target.value);
              }}
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            />
          </div>
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
        ) : totalStudents > 0 ? (
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
          <EmptyState title="No data" description="Adjust filters to view student metrics." />
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Card title="Active vs inactive">
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
            ) : (
              <Donut active={activeStudents} inactive={inactiveStudents} />
            )}
          </Card>
        </div>
        <div className="lg:col-span-8">
          <Card title="Cohort retention over time">
            {loading ? (
              <div className="space-y-3">
                <SkeletonLine w={260} />
                <SkeletonLine w={280} />
                <SkeletonLine w={240} />
              </div>
            ) : retention.length ? (
              <Heat matrix={retention} rowLabels={cohortLabels} colLabels={periodLabels} />
            ) : (
              <EmptyState title="No cohort data" description="Retention appears after students engage over time." />
            )}
          </Card>
        </div>
      </div>

      <Card title="Daily active learners">
        {loading ? (
          <div className="space-y-3">
            <SkeletonLine w={320} />
            <SkeletonLine w={280} />
            <SkeletonLine w={300} />
          </div>
        ) : dailyActive.length ? (
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-3 sm:grid-cols-14">
              {dailyActive.map((val, i) => {
                const h = Math.min(160, val * 0.2);
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="w-6 rounded bg-indigo-500" style={{ height: `${Math.max(12, h)}px` }} />
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{dalLabels[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState title="No activity data" description="Activity will appear as students engage daily." />
        )}
      </Card>
    </div>
  );
}
