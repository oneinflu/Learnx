"use client";
import { useEffect, useMemo, useState } from "react";

type KPI = { label: string; value: number; suffix?: string };
type LessonPerf = { name: string; completionPct: number; avgWatchMin: number };
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

export default function CourseAnalyticsPage() {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<Period>("weekly");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [enrollments, setEnrollments] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [dropOffRate, setDropOffRate] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [enrollmentSeries, setEnrollmentSeries] = useState<number[]>([]);
  const [lessonPerf, setLessonPerf] = useState<LessonPerf[]>([]);

  const courses = useMemo(() => ["AI Foundations", "Prompt Engineering", "Data Viz Mastery"], []);

  useEffect(() => {
    if (!selectedCourse && courses.length) {
      setSelectedCourse(courses[0]);
    }
  }, [courses, selectedCourse]);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoading(true);
    const timer = setTimeout(() => {
      if (selectedCourse === "AI Foundations") {
        setEnrollments(360);
        setCompletionRate(62);
        setRevenue(71280);
        setEnrollmentSeries([48, 62, 55, 70, 74, 51]);
        setLessonPerf([
          { name: "Intro to AI", completionPct: 92, avgWatchMin: 12 },
          { name: "Neural networks", completionPct: 78, avgWatchMin: 19 },
          { name: "Ethics & safety", completionPct: 64, avgWatchMin: 15 },
          { name: "Capstone project", completionPct: 48, avgWatchMin: 26 },
        ]);
      } else if (selectedCourse === "Prompt Engineering") {
        setEnrollments(260);
        setCompletionRate(55);
        setRevenue(38620);
        setEnrollmentSeries([34, 41, 39, 45, 48, 53]);
        setLessonPerf([
          { name: "Basics of prompts", completionPct: 88, avgWatchMin: 10 },
          { name: "Chain-of-thought", completionPct: 72, avgWatchMin: 17 },
          { name: "Eval & safety", completionPct: 58, avgWatchMin: 14 },
          { name: "Advanced patterns", completionPct: 52, avgWatchMin: 21 },
        ]);
      } else {
        setEnrollments(122);
        setCompletionRate(49);
        setRevenue(12078);
        setEnrollmentSeries([18, 22, 20, 24, 21, 17]);
        setLessonPerf([
          { name: "Charts 101", completionPct: 84, avgWatchMin: 9 },
          { name: "Color & perception", completionPct: 66, avgWatchMin: 13 },
          { name: "Storytelling", completionPct: 54, avgWatchMin: 11 },
          { name: "Final project", completionPct: 46, avgWatchMin: 20 },
        ]);
      }
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [selectedCourse]);

  useEffect(() => {
    setDropOffRate(Math.max(0, 100 - completionRate));
  }, [completionRate]);

  const kpis: KPI[] = useMemo(() => {
    return [
      { label: "Enrollments", value: enrollments },
      { label: "Completion rate", value: completionRate, suffix: "%" },
      { label: "Drop-off rate", value: dropOffRate, suffix: "%" },
      { label: "Revenue", value: revenue },
    ];
  }, [enrollments, completionRate, dropOffRate, revenue]);

  const labels = useMemo(() => {
    return period === "weekly" ? ["W1", "W2", "W3", "W4", "W5", "W6"] : ["M1", "M2", "M3", "M4", "M5", "M6"];
  }, [period]);

  const funnelHeights = useMemo(() => {
    const base = 100;
    const lessons = lessonPerf.map((l) => l.completionPct);
    return lessons.map((pct) => Math.round((pct / base) * 100));
  }, [lessonPerf]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Course Analytics</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Analyze performance of individual courses</p>
        </div>
        <div className="w-64">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
          >
            <option value="">Select a course</option>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!selectedCourse ? (
        <EmptyState title="No course selected" description="Pick a course to view analytics." />
      ) : (
        <>
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
            ) : enrollments > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {kpis.map((k) => (
                  <div key={k.label} className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">{k.label}</div>
                    <div className="mt-1 text-2xl font-semibold">
                      {k.label === "Revenue" ? `$${k.value.toLocaleString()}` : k.value.toLocaleString()}
                      {k.suffix ? k.suffix : ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No data for course" description="This course has no analytics yet." />
            )}
          </Card>

          <Card
            title="Enrollment trend"
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
            ) : enrollmentSeries.length ? (
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-3">
                  {labels.map((label, i) => {
                    const enr = enrollmentSeries[i] || 0;
                    const h = Math.min(160, enr * 3);
                    return (
                      <div key={label} className="flex flex-col items-center gap-2">
                        <div className="w-6 rounded bg-emerald-500" style={{ height: `${Math.max(12, h)}px` }} />
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <EmptyState title="No data for course" description="Enrollments trend will appear once students join." />
            )}
          </Card>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6 space-y-6">
              <Card title="Lesson-level drop-off funnel">
                {loading ? (
                  <div className="space-y-3">
                    <SkeletonLine w={220} />
                    <SkeletonLine w={260} />
                    <SkeletonLine w={180} />
                  </div>
                ) : lessonPerf.length ? (
                  <div className="space-y-3">
                    {lessonPerf.map((l, i) => {
                      const pct = funnelHeights[i] || 0;
                      return (
                        <div key={l.name}>
                          <div className="flex items-center justify-between">
                            <div className="text-sm">{l.name}</div>
                            <div className="text-xs text-zinc-600 dark:text-zinc-400">{l.completionPct}% completed</div>
                          </div>
                          <div className="mt-1 h-2 rounded bg-zinc-200 dark:bg-zinc-800">
                            <div className="h-2 rounded bg-indigo-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState title="No lesson data" description="Completion funnel appears after students start watching lessons." />
                )}
              </Card>
            </div>
            <div className="lg:col-span-6 space-y-6">
              <Card title="Lessons table">
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <SkeletonLine w={180} />
                        <SkeletonLine w={60} />
                        <SkeletonLine w={80} />
                      </div>
                    ))}
                  </div>
                ) : lessonPerf.length ? (
                  <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="max-h-[420px] overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
                          <tr className="text-left">
                            <th className="px-3 py-2 font-semibold">Lesson name</th>
                            <th className="px-3 py-2 font-semibold">Completion %</th>
                            <th className="px-3 py-2 font-semibold">Avg watch time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                          {lessonPerf.map((l) => (
                            <tr key={l.name} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                              <td className="px-3 py-2">{l.name}</td>
                              <td className="px-3 py-2">{l.completionPct}%</td>
                              <td className="px-3 py-2">{l.avgWatchMin} min</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <EmptyState title="No lesson data" description="Lessons table will populate after learners consume content." />
                )}
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
