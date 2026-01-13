"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Status = "active" | "completed" | "inactive";
type Student = {
  id: string;
  name: string;
  email: string;
  avatarHue: number;
  course: string;
  progressPct: number;
  lastActive: string;
  status: Status;
};
type Op = ">=" | "<=";
type SegmentType = "default" | "custom";
type Rules = {
  course?: "any" | string;
  progress?: { op: Op; value: number };
  lastActive?: { from?: string; to?: string };
  statusEq?: Status;
};
type Segment = {
  id: string;
  name: string;
  type: SegmentType;
  rules: Rules;
};

function Avatar({ hue }: { hue: number }) {
  return <span className="inline-block h-7 w-7 rounded-full" style={{ backgroundColor: `hsl(${hue}deg 60% 70%)` }} />;
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
function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2 w-28 rounded bg-zinc-200 dark:bg-zinc-800">
      <div className="h-2 rounded bg-indigo-500" style={{ width: `${v}%` }} />
    </div>
  );
}

export default function StudentSegmentsPage() {
  const [students, setStudents] = useState<Student[]>([
    { id: "s1", name: "Alex Johnson", email: "alex@example.com", avatarHue: 210, course: "AI Foundations", progressPct: 62, lastActive: "2026-01-12T10:12:00Z", status: "active" },
    { id: "s2", name: "Maya Singh", email: "maya@example.com", avatarHue: 160, course: "Prompt Engineering", progressPct: 100, lastActive: "2026-01-11T09:30:00Z", status: "completed" },
    { id: "s3", name: "Jon Lee", email: "jon@example.com", avatarHue: 20, course: "Data Viz Mastery", progressPct: 15, lastActive: "2025-12-24T14:00:00Z", status: "inactive" },
    { id: "s4", name: "Lia Perez", email: "lia@example.com", avatarHue: 300, course: "AI Foundations", progressPct: 48, lastActive: "2026-01-10T15:17:00Z", status: "active" },
    { id: "s5", name: "Sam Roy", email: "sam@example.com", avatarHue: 60, course: "Prompt Engineering", progressPct: 70, lastActive: "2026-01-06T09:00:00Z", status: "active" },
    { id: "s6", name: "Nina Park", email: "nina@example.com", avatarHue: 280, course: "Data Viz Mastery", progressPct: 30, lastActive: "2025-12-30T19:10:00Z", status: "inactive" },
  ]);
  const courses = useMemo(() => Array.from(new Set(students.map((s) => s.course))), [students]);

  const defaultSegments: Segment[] = useMemo(
    () => [
      { id: "seg_active", name: "Active", type: "default", rules: { statusEq: "active" } },
      { id: "seg_inactive", name: "Inactive", type: "default", rules: { statusEq: "inactive" } },
      { id: "seg_completed", name: "Completed", type: "default", rules: { statusEq: "completed" } },
    ],
    []
  );
  const [customSegments, setCustomSegments] = useState<Segment[]>([
    { id: "seg_custom_ai_high", name: "AI • Progress ≥ 60%", type: "custom", rules: { course: "AI Foundations", progress: { op: ">=", value: 60 } } },
  ]);

  const [selectedId, setSelectedId] = useState<string>(defaultSegments[0].id);
  const selected = useMemo(() => {
    return [...defaultSegments, ...customSegments].find((s) => s.id === selectedId) || defaultSegments[0];
  }, [selectedId, defaultSegments, customSegments]);

  function matches(student: Student, rules: Rules) {
    if (rules.statusEq && student.status !== rules.statusEq) return false;
    if (rules.course && rules.course !== "any" && student.course !== rules.course) return false;
    if (rules.progress) {
      const val = rules.progress.value;
      if (rules.progress.op === ">=" && !(student.progressPct >= val)) return false;
      if (rules.progress.op === "<=" && !(student.progressPct <= val)) return false;
    }
    if (rules.lastActive) {
      const d = new Date(student.lastActive);
      const fromOk = rules.lastActive.from ? d >= new Date(rules.lastActive.from) : true;
      const toOk = rules.lastActive.to ? d <= new Date(rules.lastActive.to) : true;
      if (!(fromOk && toOk)) return false;
    }
    return true;
  }
  const matched = useMemo(() => students.filter((s) => matches(s, selected.rules)), [students, selected]);

  function createSegment() {
    const id = Math.random().toString(36).slice(2, 9);
    const seg: Segment = { id, name: "New segment", type: "custom", rules: { course: "any" } };
    setCustomSegments((prev) => [seg, ...prev]);
    setSelectedId(id);
  }
  function updateSelected(updates: Partial<Segment>) {
    if (selected.type === "default") return;
    setCustomSegments((prev) => prev.map((s) => (s.id === selected.id ? { ...s, ...updates, rules: updates.rules ?? s.rules } : s)));
  }
  function deleteSelected() {
    if (selected.type === "default") return;
    if (!window.confirm("Delete this segment?")) return;
    setCustomSegments((prev) => prev.filter((s) => s.id !== selected.id));
    setSelectedId(defaultSegments[0].id);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Student Segments</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create and manage segments for analytics and campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/students/all"
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            View students
          </Link>
          <button
            onClick={createSegment}
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Create segment
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Segments</div>
            <div className="mt-3">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Default</div>
              <div className="mt-1 space-y-1">
                {defaultSegments.map((seg) => {
                  const count = students.filter((s) => matches(s, seg.rules)).length;
                  const active = selectedId === seg.id;
                  return (
                    <button
                      key={seg.id}
                      onClick={() => setSelectedId(seg.id)}
                      className={
                        active
                          ? "flex w-full items-center justify-between rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 transition dark:bg-zinc-800 dark:text-zinc-100"
                          : "flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      }
                    >
                      <span>{seg.name}</span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Custom</div>
              <div className="mt-1 space-y-1">
                {customSegments.length === 0 ? (
                  <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                    No custom segments yet
                  </div>
                ) : (
                  customSegments.map((seg) => {
                    const count = students.filter((s) => matches(s, seg.rules)).length;
                    const active = selectedId === seg.id;
                    return (
                      <button
                        key={seg.id}
                        onClick={() => setSelectedId(seg.id)}
                        className={
                          active
                            ? "flex w-full items-center justify-between rounded-md bg-zinc-100 px-2 py-2 text-sm font-medium text-zinc-900 transition dark:bg-zinc-800 dark:text-zinc-100"
                            : "flex w-full items-center justify-between rounded-md px-2 py-2 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        }
                      >
                        <span>{seg.name}</span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400">{count}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-8">
          <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={selected.type === "custom" ? selected.name : selected.name}
                  onChange={(e) => selected.type === "custom" && updateSelected({ name: e.target.value })}
                  readOnly={selected.type !== "custom"}
                  className={
                    selected.type === "custom"
                      ? "h-9 w-64 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                      : "h-9 w-64 rounded-md border border-zinc-300 bg-zinc-50 px-2 text-sm text-zinc-900 outline-none dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-100"
                  }
                />
                {selected.type !== "custom" && <span className="text-xs text-zinc-600 dark:text-zinc-400">System segment</span>}
              </div>
              <div className="flex items-center gap-2">
                {selected.type === "custom" && (
                  <button
                    onClick={deleteSelected}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-rose-300 bg-white px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/50 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                  >
                    Delete segment
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-semibold">Course enrolled</div>
                <select
                  value={selected.rules.course ?? "any"}
                  onChange={(e) =>
                    selected.type === "custom" && updateSelected({ rules: { ...selected.rules, course: e.target.value as "any" | string } })
                  }
                  disabled={selected.type !== "custom"}
                  className="mt-2 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                >
                  <option value="any">Any</option>
                  {courses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-semibold">Progress %</div>
                <div className="mt-2 flex items-center gap-2">
                  <select
                    value={selected.rules.progress?.op ?? ">="}
                    onChange={(e) =>
                      selected.type === "custom" &&
                      updateSelected({ rules: { ...selected.rules, progress: { op: e.target.value as Op, value: selected.rules.progress?.value ?? 0 } } })
                    }
                    disabled={selected.type !== "custom"}
                    className="h-9 w-28 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  >
                    <option value=">=">≥</option>
                    <option value="<=">≤</option>
                  </select>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={selected.rules.progress?.value ?? 0}
                    onChange={(e) =>
                      selected.type === "custom" &&
                      updateSelected({ rules: { ...selected.rules, progress: { op: selected.rules.progress?.op ?? ">=", value: Number(e.target.value) } } })
                    }
                    disabled={selected.type !== "custom"}
                    className="h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900 md:col-span-2">
                <div className="text-xs font-semibold">Last active</div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="date"
                    value={selected.rules.lastActive?.from ?? ""}
                    onChange={(e) =>
                      selected.type === "custom" && updateSelected({ rules: { ...selected.rules, lastActive: { ...(selected.rules.lastActive ?? {}), from: e.target.value } } })
                    }
                    disabled={selected.type !== "custom"}
                    className="h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">to</span>
                  <input
                    type="date"
                    value={selected.rules.lastActive?.to ?? ""}
                    onChange={(e) =>
                      selected.type === "custom" && updateSelected({ rules: { ...selected.rules, lastActive: { ...(selected.rules.lastActive ?? {}), to: e.target.value } } })
                    }
                    disabled={selected.type !== "custom"}
                    className="h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-semibold">Student count preview</div>
                <div className="mt-2 text-3xl font-semibold">{matched.length}</div>
                <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Matching students</div>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-semibold">Preview</div>
                <div className="mt-2 space-y-2">
                  {matched.slice(0, 5).map((s) => (
                    <div key={s.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar hue={s.avatarHue} />
                        <div>
                          <div className="text-sm font-medium">{s.name}</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">{s.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={s.status} />
                        <div className="flex items-center gap-2">
                          <ProgressBar value={s.progressPct} />
                          <span className="text-xs">{s.progressPct}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {matched.length === 0 && (
                    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400">
                      No students match the selected rules
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selected.type === "custom" && (
              <div className="mt-4 flex items-center justify-end gap-2">
                <button className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                  Edit rules
                </button>
                <button className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                  Save changes
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

