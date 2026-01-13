"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  status: "draft" | "published";
  price: number;
  type: "self-paced" | "cohort" | "bundle";
  students: number;
};

const initialCourses: Course[] = [
  { id: "1", title: "AI Foundations", status: "published", price: 199, type: "self-paced", students: 324 },
  { id: "2", title: "Prompt Engineering", status: "published", price: 149, type: "cohort", students: 198 },
  { id: "3", title: "Data Viz Mastery", status: "draft", price: 99, type: "self-paced", students: 0 },
  { id: "4", title: "No-Code Automations", status: "published", price: 0, type: "bundle", students: 412 },
];

export default function CoursesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [price, setPrice] = useState<"all" | "free" | "paid">("all");
  const [type, setType] = useState<"all" | "self-paced" | "cohort" | "bundle">("all");

  const filtered = useMemo(() => {
    return initialCourses.filter((c) => {
      const statusOk = status === "all" ? true : c.status === status;
      const priceOk = price === "all" ? true : price === "free" ? c.price === 0 : c.price > 0;
      const typeOk = type === "all" ? true : c.type === type;
      return statusOk && priceOk && typeOk;
    });
  }, [status, price, type]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Courses</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage and analyze your courses.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/courses/new"
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Create Course
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("grid")}
            className={
              view === "grid"
                ? "inline-flex h-8 items-center justify-center rounded-md bg-zinc-100 px-2 text-xs font-medium dark:bg-zinc-800"
                : "inline-flex h-8 items-center justify-center rounded-md px-2 text-xs text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={
              view === "list"
                ? "inline-flex h-8 items-center justify-center rounded-md bg-zinc-100 px-2 text-xs font-medium dark:bg-zinc-800"
                : "inline-flex h-8 items-center justify-center rounded-md px-2 text-xs text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }
          >
            List
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-600 dark:text-zinc-400">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "all" | "draft" | "published")}
              className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-600 dark:text-zinc-400">Price</label>
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value as "all" | "free" | "paid")}
              className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-zinc-600 dark:text-zinc-400">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "all" | "self-paced" | "cohort" | "bundle")}
              className="h-8 rounded-md border border-zinc-300 bg-white px-2 text-xs outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            >
              <option value="all">All</option>
              <option value="self-paced">Self-paced</option>
              <option value="cohort">Cohort</option>
              <option value="bundle">Bundle</option>
            </select>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="text-sm font-medium">No courses match the filters</div>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Try adjusting filters or create a new course.
          </p>
          <div className="mt-3">
            <Link
              href="/dashboard/courses/new"
              className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Create Course
            </Link>
          </div>
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{c.title}</div>
                  <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    {c.type === "self-paced" ? "Self-paced" : c.type === "cohort" ? "Cohort" : "Bundle"}
                  </div>
                </div>
                <span
                  className={
                    c.status === "published"
                      ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                      : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300"
                  }
                >
                  {c.status === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm font-medium">{c.price === 0 ? "Free" : `$${c.price}`}</div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.students} students</div>
              </div>
              <div className="mt-4 flex items-center justify-end">
                <Link
                  href={`/dashboard/courses/${c.id}/builder`}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-12 gap-3 border-b border-zinc-200 p-3 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-3 text-right">Students</div>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {filtered.map((c) => (
              <div key={c.id} className="grid grid-cols-12 items-center gap-3 p-3">
                <div className="col-span-5">
                  <div className="truncate text-sm font-medium">{c.title}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">
                    {c.type === "self-paced" ? "Self-paced" : c.type === "cohort" ? "Cohort" : "Bundle"}
                  </div>
                </div>
                <div className="col-span-2">
                  <span
                    className={
                      c.status === "published"
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300"
                    }
                  >
                    {c.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="col-span-2 text-sm">{c.price === 0 ? "Free" : `$${c.price}`}</div>
                <div className="col-span-3 text-right text-sm">{c.students}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
