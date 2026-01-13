"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Status = "active" | "completed" | "inactive";
type Student = {
  id: string;
  name: string;
  email: string;
  avatarHue: number;
  coursesCount: number;
  progressPct: number;
  lastActive: string;
  status: Status;
  course: string;
};

function Avatar({ hue }: { hue: number }) {
  return <span className="inline-block h-8 w-8 rounded-full" style={{ backgroundColor: `hsl(${hue}deg 60% 70%)` }} />;
}
function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-32 rounded bg-zinc-200 dark:bg-zinc-800">
      <div className="h-2 rounded bg-indigo-500" style={{ width: `${v}%` }} />
    </div>
  );
}
function Badge({ status }: { status: Status }) {
  const classes =
    status === "active"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : status === "completed"
      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300"
      : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${classes}`}>{status}</span>;
}
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-3">
        <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-1 h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-12 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-2 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-8 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
    </tr>
  );
}

export default function StudentsAllPage() {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState<"all" | string>("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const seed: Student[] = [
        { id: "s1", name: "Alex Johnson", email: "alex@example.com", avatarHue: 210, coursesCount: 3, progressPct: 62, lastActive: "2026-01-12T10:12:00Z", status: "active", course: "AI Foundations" },
        { id: "s2", name: "Maya Singh", email: "maya@example.com", avatarHue: 160, coursesCount: 2, progressPct: 100, lastActive: "2026-01-11T09:30:00Z", status: "completed", course: "Prompt Engineering" },
        { id: "s3", name: "Jon Lee", email: "jon@example.com", avatarHue: 20, coursesCount: 1, progressPct: 15, lastActive: "2025-12-24T14:00:00Z", status: "inactive", course: "Data Viz Mastery" },
        { id: "s4", name: "Lia Perez", email: "lia@example.com", avatarHue: 300, coursesCount: 4, progressPct: 48, lastActive: "2026-01-10T15:17:00Z", status: "active", course: "AI Foundations" },
      ];
      setStudents(seed);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const courses = useMemo(() => Array.from(new Set(students.map((s) => s.course))), [students]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    return students.filter((s) => {
      const byQuery = q.length === 0 || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const byCourse = course === "all" ? true : s.course === course;
      const byStatus = status === "all" ? true : s.status === status;
      const d = new Date(s.lastActive);
      const byFrom = fromDate ? d >= fromDate : true;
      const byTo = toDate ? d <= toDate : true;
      return byQuery && byCourse && byStatus && byFrom && byTo;
    });
  }, [students, query, course, status, from, to]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Students</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage learners across all courses</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name or email"
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            />
          </div>
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Course</div>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            >
              <option value="all">All</option>
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
              onChange={(e) => setStatus(e.target.value as "all" | Status)}
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Last active</div>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              />
              <span className="text-xs text-zinc-500">to</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">Student</th>
                <th className="px-3 py-2 font-semibold">Courses</th>
                <th className="px-3 py-2 font-semibold">Progress</th>
                <th className="px-3 py-2 font-semibold">Last active</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </>
              ) : filtered.length === 0 ? (
                students.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-12">
                      <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                            <path d="M12 3l9 5-9 5-9-5 9-5zm0 7l9 5-9 5-9-5 9-5z" className="fill-current" />
                          </svg>
                        </div>
                        <div className="mt-4 text-base font-medium">No students yet</div>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                          Invite learners by sharing your course link, or create your first course to get started.
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <Link
                            href="/dashboard/marketing"
                            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                          >
                            Share course link
                          </Link>
                          <Link
                            href="/dashboard/courses/new"
                            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                          >
                            Create your first course
                          </Link>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-zinc-600 dark:text-zinc-400">
                      No results found. Adjust filters or search terms.
                    </td>
                  </tr>
                )
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    onClick={() => (window.location.href = `/dashboard/students/details/${s.id}`)}
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-3">
                        <Avatar hue={s.avatarHue} />
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">{s.coursesCount}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={s.progressPct} />
                        <span className="text-xs">{s.progressPct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">{new Date(s.lastActive).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <Badge status={s.status} />
                    </td>
                    <td className="px-3 py-2">
                      <Link
                        href={`/dashboard/students/details/${s.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
