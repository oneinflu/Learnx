"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Status = "active" | "completed" | "inactive";
type CourseStatus = "in progress" | "completed";
type Tab = "overview" | "courses" | "payments" | "certificates" | "activity";

type StudentProfile = {
  id: string;
  name: string;
  email: string;
  avatarHue: number;
  status: Status;
  lastActive: string;
};
type CourseEnrollment = {
  id: string;
  title: string;
  progressPct: number;
  status: CourseStatus;
};
type TxStatus = "succeeded" | "failed" | "refunded" | "pending";
type Transaction = {
  id: string;
  course: string;
  amount: number;
  currency: string;
  status: TxStatus;
  date: string;
};
type Certificate = {
  id: string;
  course: string;
  issuedOn: string;
  url: string;
};
type ActivityEvent = {
  label: string;
  detail: string;
  when: string;
};

function Avatar({ hue }: { hue: number }) {
  return <span className="inline-block h-12 w-12 rounded-full" style={{ backgroundColor: `hsl(${hue}deg 60% 70%)` }} />;
}
function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-full rounded bg-zinc-200 dark:bg-zinc-800">
      <div className="h-2 rounded bg-indigo-500" style={{ width: `${v}%` }} />
    </div>
  );
}
function StatusBadge({ status }: { status: Status }) {
  const classes =
    status === "active"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : status === "completed"
      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
      : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${classes}`}>{status}</span>;
}
function TxBadge({ status }: { status: TxStatus }) {
  const classes =
    status === "succeeded"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : status === "failed"
      ? "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
      : status === "refunded"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${classes}`}>{status}</span>;
}
function SkeletonLine({ w }: { w: number }) {
  return <div className="h-3 rounded bg-zinc-200 dark:bg-zinc-800" style={{ width: w }} />;
}
function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = String(params.studentId);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const base: Record<string, StudentProfile> = {
        s1: { id: "s1", name: "Alex Johnson", email: "alex@example.com", avatarHue: 210, status: "active", lastActive: "2026-01-12T10:12:00Z" },
        s2: { id: "s2", name: "Maya Singh", email: "maya@example.com", avatarHue: 160, status: "completed", lastActive: "2026-01-11T09:30:00Z" },
        s3: { id: "s3", name: "Jon Lee", email: "jon@example.com", avatarHue: 20, status: "inactive", lastActive: "2025-12-24T14:00:00Z" },
        s4: { id: "s4", name: "Lia Perez", email: "lia@example.com", avatarHue: 300, status: "active", lastActive: "2026-01-10T15:17:00Z" },
      };
      const p = base[studentId] ?? { id: studentId, name: "Unknown", email: "unknown@example.com", avatarHue: 220, status: "inactive", lastActive: new Date().toISOString() };
      setProfile(p);
      setEnrollments([
        { id: "c1", title: "AI Foundations", progressPct: p.id === "s2" ? 100 : 62, status: p.id === "s2" ? "completed" : "in progress" },
        { id: "c2", title: "Prompt Engineering", progressPct: p.id === "s3" ? 15 : 48, status: p.id === "s3" ? "in progress" : "in progress" },
      ]);
      setTxs([
        { id: "tx_1001", course: "AI Foundations", amount: 199, currency: "USD", status: "succeeded", date: "2026-01-05T12:10:00Z" },
        { id: "tx_1002", course: "Prompt Engineering", amount: 149, currency: "USD", status: "succeeded", date: "2026-01-06T08:50:00Z" },
      ]);
      setCerts(p.id === "s2" ? [{ id: "cert_1", course: "AI Foundations", issuedOn: "2026-01-11T09:35:00Z", url: "#" }] : []);
      setActivity([
        { label: "Enrolled", detail: "AI Foundations", when: "Jan 05, 2026" },
        { label: "Payment received", detail: "$199 • AI Foundations", when: "Jan 05, 2026" },
        { label: "Lesson completed", detail: "Module 2 • AI Foundations", when: "Jan 08, 2026" },
        { label: "Enrolled", detail: "Prompt Engineering", when: "Jan 06, 2026" },
      ]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [studentId]);

  const overallProgress = useMemo(() => {
    if (!enrollments.length) return 0;
    const sum = enrollments.reduce((acc, e) => acc + e.progressPct, 0);
    return Math.round(sum / enrollments.length);
  }, [enrollments]);
  const completedCount = useMemo(() => enrollments.filter((e) => e.status === "completed").length, [enrollments]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {profile ? <Avatar hue={profile.avatarHue} /> : <span className="inline-block h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />}
          <div>
            <h1 className="text-lg font-semibold">{profile ? profile.name : "Loading..."}</h1>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">{profile ? profile.email : ""}</div>
          </div>
        </div>
        <Link
          href="/dashboard/students/all"
          className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Back to Students
        </Link>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { key: "overview", label: "Overview" },
            { key: "courses", label: "Courses" },
            { key: "payments", label: "Payments" },
            { key: "certificates", label: "Certificates" },
            { key: "activity", label: "Activity" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className={
                tab === (t.key as Tab)
                  ? "inline-flex h-9 items-center justify-center rounded-md bg-zinc-100 px-3 text-sm font-medium text-zinc-900 transition dark:bg-zinc-800 dark:text-zinc-100"
                  : "inline-flex h-9 items-center justify-center rounded-md px-3 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Profile</h2>
              </div>
              <div className="mt-3 space-y-3">
                {loading || !profile ? (
                  <>
                    <div className="flex items-center gap-3">
                      <span className="inline-block h-12 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                      <div className="space-y-2">
                        <SkeletonLine w={140} />
                        <SkeletonLine w={180} />
                      </div>
                    </div>
                    <SkeletonLine w={220} />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Avatar hue={profile.avatarHue} />
                      <div>
                        <div className="text-sm font-medium">{profile.name}</div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">{profile.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={profile.status} />
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">Last active {new Date(profile.lastActive).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
            </section>
          </div>
          <div className="lg:col-span-8">
            <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Summary</h2>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-2xl font-semibold">{enrollments.length}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Courses enrolled</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="text-2xl font-semibold">{completedCount}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Completed</div>
                </div>
                <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="w-48">
                      <ProgressBar value={overallProgress} />
                    </div>
                    <div className="text-sm">{overallProgress}%</div>
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Overall progress</div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Courses</h2>
          </div>
          <div className="mt-3">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <SkeletonLine w={240} />
                    <div className="mt-2">
                      <SkeletonLine w={320} />
                    </div>
                  </div>
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center text-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                No course enrollments
              </div>
            ) : (
              <div className="space-y-3">
                {enrollments.map((e) => (
                  <div key={e.id} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                      <div className="truncate text-sm font-medium">{e.title}</div>
                      <span
                        className={
                          e.status === "completed"
                            ? "rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-medium text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
                            : "rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300"
                        }
                      >
                        {e.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <ProgressBar value={e.progressPct} />
                      <span className="text-xs">{e.progressPct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "payments" && (
        <section className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="max-h-[520px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
                <tr className="text-left">
                  <th className="px-3 py-2 font-semibold">Transaction</th>
                  <th className="px-3 py-2 font-semibold">Course</th>
                  <th className="px-3 py-2 font-semibold">Amount</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {loading ? (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-3 py-3">
                          <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 w-36 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="h-8 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : txs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-zinc-600 dark:text-zinc-400">
                      No payments yet
                    </td>
                  </tr>
                ) : (
                  txs.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                      <td className="px-3 py-2">{t.id}</td>
                      <td className="px-3 py-2">{t.course}</td>
                      <td className="px-3 py-2">{formatCurrency(t.amount, t.currency)}</td>
                      <td className="px-3 py-2">
                        <TxBadge status={t.status} />
                      </td>
                      <td className="px-3 py-2">{new Date(t.date).toLocaleString()}</td>
                      <td className="px-3 py-2">
                        <button className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                          Download invoice
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "certificates" && (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Certificates</h2>
          </div>
          <div className="mt-3">
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <SkeletonLine w={260} />
                    <div className="mt-2">
                      <SkeletonLine w={180} />
                    </div>
                  </div>
                ))}
              </div>
            ) : certs.length === 0 ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center text-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                No certificates
              </div>
            ) : (
              <div className="space-y-3">
                {certs.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div>
                      <div className="text-sm font-medium">{c.course}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Issued {new Date(c.issuedOn).toLocaleDateString()}</div>
                    </div>
                    <a
                      href={c.url}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {tab === "activity" && (
        <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Activity</h2>
          </div>
          <div className="mt-3">
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <SkeletonLine w={220} />
                    <SkeletonLine w={140} />
                  </div>
                ))}
              </div>
            ) : activity.length === 0 ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center text-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                No recent activity
              </div>
            ) : (
              <ul className="space-y-2">
                {activity.map((a, i) => (
                  <li key={i} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="text-sm">{a.label}</div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {a.detail} • {a.when}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

