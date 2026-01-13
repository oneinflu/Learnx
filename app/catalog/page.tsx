"use client";
import Link from "next/link";
import { useMemo, useState } from "react";

type Course = {
  id: string;
  title: string;
  author: string;
  category: string;
  language: string;
  price: number;
  featured?: boolean;
};

const initialCourses: Course[] = [
  { id: "c1", title: "AI Foundations", author: "Aurora Labs", category: "AI", language: "English", price: 199, featured: true },
  { id: "c2", title: "Prompt Engineering", author: "Signal School", category: "AI", language: "English", price: 149, featured: true },
  { id: "c3", title: "Design Systems Mastery", author: "Forma Institute", category: "Design", language: "English", price: 249 },
  { id: "c4", title: "Data Viz Mastery", author: "ChartCraft", category: "Data", language: "English", price: 99 },
  { id: "c5", title: "No-Code Automations", author: "FlowOps", category: "Productivity", language: "English", price: 0 },
  { id: "c6", title: "Growth Marketing Basics", author: "ScaleCo", category: "Marketing", language: "English", price: 129 },
  { id: "c7", title: "Spanish for Creators", author: "LinguaHub", category: "Language", language: "Spanish", price: 89 },
];

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState<"all" | "free" | "paid">("all");
  const [category, setCategory] = useState<"all" | string>("all");
  const [language, setLanguage] = useState<"all" | string>("all");

  const categories = useMemo(() => Array.from(new Set(initialCourses.map((c) => c.category))), []);
  const languages = useMemo(() => Array.from(new Set(initialCourses.map((c) => c.language))), []);

  const featured = useMemo(() => initialCourses.filter((c) => c.featured), []);

  const filtered = useMemo(() => {
    return initialCourses.filter((c) => {
      const q = query.toLowerCase().trim();
      const matchesQuery =
        q.length === 0 ||
        c.title.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      const priceOk = price === "all" ? true : price === "free" ? c.price === 0 : c.price > 0;
      const categoryOk = category === "all" ? true : c.category === category;
      const languageOk = language === "all" ? true : c.language === language;
      return matchesQuery && priceOk && categoryOk && languageOk;
    });
  }, [query, price, category, language]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Explore courses</h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Premium courses curated for creators, institutes, and teams.
            </p>
          </div>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Start free trial
          </Link>
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-zinc-500 dark:text-zinc-400">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1015.5 14l5 5-1.5 1.5-5-5zM6.5 10a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" className="fill-current" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses"
                className="h-9 w-72 rounded-lg border border-zinc-300 bg-white pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-indigo-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-600 dark:text-zinc-400">Price</label>
                <select
                  value={price}
                  onChange={(e) => setPrice(e.target.value as "all" | "free" | "paid")}
                  className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                >
                  <option value="all">All</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-600 dark:text-zinc-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                >
                  <option value="all">All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-zinc-600 dark:text-zinc-400">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-xs outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                >
                  <option value="all">All</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Featured courses</h2>
              <Link
                href="/catalog"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                View all
              </Link>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((c) => (
                <CatalogCard key={c.id} course={c} highlight />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">All courses</h2>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">{filtered.length} results</div>
            </div>
            {filtered.length ? (
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((c) => (
                  <CatalogCard key={c.id} course={c} />
                ))}
              </div>
            ) : (
              <div className="mt-3 rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-medium">No courses found</div>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  Try adjusting filters or search terms.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CatalogCard({ course, highlight }: { course: Course; highlight?: boolean }) {
  return (
    <div
      className={
        highlight
          ? "rounded-xl border border-indigo-200 bg-white p-4 shadow-sm ring-1 ring-indigo-100 transition hover:shadow-md dark:border-indigo-800 dark:bg-zinc-900 dark:ring-0"
          : "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
      }
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{course.title}</div>
          <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">{course.author}</div>
        </div>
        <span
          className={
            course.price === 0
              ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              : "rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300"
          }
        >
          {course.price === 0 ? "Free" : `$${course.price}`}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
            {course.category}
          </span>
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
            {course.language}
          </span>
        </div>
        <Link
          href={`/signup`}
          className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          Enroll
        </Link>
      </div>
    </div>
  );
}

