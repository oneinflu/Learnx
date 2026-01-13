import Link from "next/link";

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

function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-800/40">
      <div className="text-sm font-medium">{title}</div>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export default function DashboardHome() {
  const revenue = { mrr: 42000, last30d: 7800, growthPct: 5.6 };
  const activeStudents = 1204;
  const coursePerformance = [
    { name: "AI Foundations", enrollments: 324, completionRate: 62 },
    { name: "Prompt Engineering", enrollments: 198, completionRate: 54 },
    { name: "Data Viz Mastery", enrollments: 87, completionRate: 48 },
  ];
  const upcomingSessions = [
    { title: "Live Q&A: AI", startsAt: "Jan 20, 4:00 PM", duration: "60m" },
    { title: "Workshop: Monetize Courses", startsAt: "Jan 23, 5:30 PM", duration: "90m" },
  ];
  const activity = [
    { label: "New enrollment", detail: "AI Foundations", when: "2h ago" },
    { label: "Payment received", detail: "$199 • Prompt Engineering", when: "4h ago" },
    { label: "New post", detail: "Community: Weekly wins", when: "6h ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Quick snapshot of your academy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/courses/new"
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Create course
          </Link>
          <Link
            href="/dashboard/live/new"
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Start live class
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Card title="Revenue">
            {revenue.mrr > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-2xl font-semibold">${(revenue.mrr / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">MRR</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-2xl font-semibold">${revenue.last30d}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Last 30d</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                    {revenue.growthPct}%
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Growth</div>
                </div>
              </div>
            ) : (
              <EmptyState
                title="No revenue yet"
                description="Start by creating your first course and enabling payments."
                action={
                  <Link
                    href="/dashboard/courses/new"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Create course
                  </Link>
                }
              />
            )}
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card title="Active students">
            {activeStudents > 0 ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-3xl font-semibold">{activeStudents}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Currently engaged</div>
              </div>
            ) : (
              <EmptyState title="No students yet" description="Invite students or share your academy link." />
            )}
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card
            title="Course performance"
            actions={
              <Link
                href="/dashboard/courses"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View all
              </Link>
            }
          >
            {coursePerformance.length ? (
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {coursePerformance.map((c) => (
                  <div key={c.name} className="flex items-center justify-between py-2">
                    <div className="truncate text-sm">{c.name}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.enrollments} enrollments</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.completionRate}% completion</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No courses"
                description="Create your first course to see performance insights."
                action={
                  <Link
                    href="/dashboard/courses/new"
                    className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Create course
                  </Link>
                }
              />
            )}
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Card title="Upcoming live sessions" actions={<Link href="/dashboard/live" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">View all</Link>}>
            {upcomingSessions.length ? (
              <ul className="space-y-2">
                {upcomingSessions.map((s) => (
                  <li key={s.title} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div>
                      <div className="text-sm font-medium">{s.title}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{s.startsAt} • {s.duration}</div>
                    </div>
                    <Link href="/dashboard/live/new" className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                      Start
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                title="No upcoming sessions"
                description="Schedule a live session to engage your students."
                action={<Link href="/dashboard/live/new" className="inline-flex h-8 items-center justify-center rounded-md bg-indigo-600 px-2 text-xs font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">Schedule session</Link>}
              />
            )}
          </Card>
        </div>
        <div className="lg:col-span-6">
          <Card title="Recent activity" actions={<Link href="/dashboard/activity" className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">View all</Link>}>
            {activity.length ? (
              <ul className="space-y-2">
                {activity.map((a, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="text-sm">{a.label}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">{a.detail} • {a.when}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No recent activity" description="Activity from enrollments, payments, and posts will appear here." />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
