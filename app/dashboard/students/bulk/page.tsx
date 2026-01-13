"use client";
import { useEffect, useMemo, useRef, useState } from "react";

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
type Action = "enroll" | "remove" | "email";

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
    <div className="h-2 w-full rounded bg-zinc-200 dark:bg-zinc-800">
      <div className="h-2 rounded bg-indigo-500" style={{ width: `${v}%` }} />
    </div>
  );
}

export default function StudentsBulkPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [currentAction, setCurrentAction] = useState<Action | null>(null);
  const [courseToEnroll, setCourseToEnroll] = useState<string>("AI Foundations");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [banner, setBanner] = useState<string>("");
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const [csvFileName, setCsvFileName] = useState<string>("");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [mapName, setMapName] = useState<string>("");
  const [mapEmail, setMapEmail] = useState<string>("");
  const [mapCourse, setMapCourse] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importSummary, setImportSummary] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const seed: Student[] = [
      { id: "s1", name: "Alex Johnson", email: "alex@example.com", avatarHue: 210, course: "AI Foundations", progressPct: 62, lastActive: "2026-01-12T10:12:00Z", status: "active" },
      { id: "s2", name: "Maya Singh", email: "maya@example.com", avatarHue: 160, course: "Prompt Engineering", progressPct: 100, lastActive: "2026-01-11T09:30:00Z", status: "completed" },
      { id: "s3", name: "Jon Lee", email: "jon@example.com", avatarHue: 20, course: "Data Viz Mastery", progressPct: 15, lastActive: "2025-12-24T14:00:00Z", status: "inactive" },
      { id: "s4", name: "Lia Perez", email: "lia@example.com", avatarHue: 300, course: "AI Foundations", progressPct: 48, lastActive: "2026-01-10T15:17:00Z", status: "active" },
      { id: "s5", name: "Sam Roy", email: "sam@example.com", avatarHue: 60, course: "Prompt Engineering", progressPct: 70, lastActive: "2026-01-06T09:00:00Z", status: "active" },
    ];
    setStudents(seed);
  }, []);

  const selectedIds = useMemo(() => Object.keys(selected).filter((id) => selected[id]), [selected]);
  const selectionCount = selectedIds.length;

  function toggleSelectAll() {
    const next = !selectAll;
    setSelectAll(next);
    if (next) {
      const all: Record<string, boolean> = {};
      students.forEach((s) => (all[s.id] = true));
      setSelected(all);
    } else {
      setSelected({});
    }
  }
  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      const allChecked = students.length > 0 && students.every((s) => next[s.id]);
      setSelectAll(allChecked);
      return next;
    });
  }

  function exportCsv() {
    const headers = ["name", "email", "course", "status", "progressPct", "lastActive"];
    const rows = selectedIds.length ? selectedIds.map((id) => students.find((s) => s.id === id)!) : students;
    const csv = [headers.join(","), ...rows.map((s) => [s.name, s.email, s.course, s.status, String(s.progressPct), s.lastActive].join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function performAction() {
    if (!currentAction) return;
    if (currentAction === "enroll") {
      setBanner(`Enrolled ${selectionCount} students in ${courseToEnroll}`);
    } else if (currentAction === "email") {
      setBanner(`Email sent to ${selectionCount} students`);
    } else if (currentAction === "remove") {
      setBanner(`Removed access for ${selectionCount} students`);
    }
    setCurrentAction(null);
    setShowConfirmRemove(false);
    setEmailSubject("");
    setEmailBody("");
  }

  function detectHeaders(headers: string[]) {
    setMapName(headers.includes("name") ? "name" : headers[0] ?? "");
    setMapEmail(headers.includes("email") ? "email" : headers[1] ?? "");
    setMapCourse(headers.includes("course") ? "course" : headers[2] ?? "");
  }
  function parseCsv(text: string) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (!lines.length) {
      setValidationErrors(["Empty CSV file"]);
      setCsvHeaders([]);
      setCsvRows([]);
      return;
    }
    const headers = lines[0].split(",").map((h) => h.trim());
    const rows = lines.slice(1).map((l) => l.split(",").map((v) => v.trim()));
    setCsvHeaders(headers);
    setCsvRows(rows);
    detectHeaders(headers);
    setValidationErrors([]);
  }
  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFileName(file.name);
    const text = await file.text();
    parseCsv(text);
  }
  function validateMapping() {
    const idxName = csvHeaders.indexOf(mapName);
    const idxEmail = csvHeaders.indexOf(mapEmail);
    const idxCourse = csvHeaders.indexOf(mapCourse);
    const errors: string[] = [];
    if (idxName < 0) errors.push("Name column not mapped");
    if (idxEmail < 0) errors.push("Email column not mapped");
    if (idxCourse < 0) errors.push("Course column not mapped");
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    csvRows.forEach((row, i) => {
      const email = row[idxEmail];
      if (!email || !emailRe.test(email)) errors.push(`Row ${i + 2}: invalid email`);
    });
    setValidationErrors(errors);
    return errors.length === 0;
  }
  function startImport() {
    if (!csvHeaders.length || !csvRows.length) {
      setValidationErrors(["No CSV selected"]);
      return;
    }
    const ok = validateMapping();
    if (!ok) return;
    setImporting(true);
    setImportProgress(0);
    setImportSummary({ success: 0, failed: 0 });
    let success = 0;
    let failed = 0;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      const simulatedFail = i % 7 === 0;
      if (simulatedFail) {
        failed++;
      } else {
        success++;
      }
      setImportProgress(Math.round((i / csvRows.length) * 100));
      setImportSummary({ success, failed });
      if (i >= csvRows.length) {
        clearInterval(timer);
        setImporting(false);
        setBanner(failed ? `Imported ${success} students • ${failed} failed` : `Imported ${success} students`);
      }
    }, 120);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Bulk Actions & Import</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage students at scale</p>
        </div>
      </div>

      {banner && (
        <div className="rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-950/30 dark:text-indigo-300">
          <div className="flex items-center justify-between">
            <span>{banner}</span>
            <button className="text-xs underline" onClick={() => setBanner("")}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
              <span>Select all</span>
            </label>
            <span className="text-xs text-zinc-600 dark:text-zinc-400">{selectionCount} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentAction("enroll")}
              disabled={selectionCount === 0}
              className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition disabled:opacity-60 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Enroll in course
            </button>
            <button
              onClick={() => setCurrentAction("email")}
              disabled={selectionCount === 0}
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition disabled:opacity-60 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Send email
            </button>
            <button
              onClick={() => {
                setCurrentAction("remove");
                setShowConfirmRemove(true);
              }}
              disabled={selectionCount === 0}
              className="inline-flex h-9 items-center justify-center rounded-md border border-rose-300 bg-white px-3 text-sm font-medium text-rose-700 transition disabled:opacity-60 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
            >
              Remove access
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
                <tr className="text-left">
                  <th className="px-3 py-2 font-semibold">
                    <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
                  </th>
                  <th className="px-3 py-2 font-semibold">Student</th>
                  <th className="px-3 py-2 font-semibold">Course</th>
                  <th className="px-3 py-2 font-semibold">Progress</th>
                  <th className="px-3 py-2 font-semibold">Last active</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-3 py-2">
                      <input type="checkbox" checked={!!selected[s.id]} onChange={() => toggleOne(s.id)} />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Avatar hue={s.avatarHue} />
                        <div>
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">{s.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">{s.course}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-40">
                          <ProgressBar value={s.progressPct} />
                        </div>
                        <span className="text-xs">{s.progressPct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">{new Date(s.lastActive).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {currentAction === "enroll" && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Enroll in course</div>
              <button className="text-xs underline" onClick={() => setCurrentAction(null)}>
                Cancel
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <select
                value={courseToEnroll}
                onChange={(e) => setCourseToEnroll(e.target.value)}
                className="h-9 w-72 rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              >
                <option value="AI Foundations">AI Foundations</option>
                <option value="Prompt Engineering">Prompt Engineering</option>
                <option value="Data Viz Mastery">Data Viz Mastery</option>
              </select>
              <button
                onClick={performAction}
                className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {currentAction === "email" && (
          <div className="mt-4 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Send email</div>
              <button className="text-xs underline" onClick={() => setCurrentAction(null)}>
                Cancel
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Subject"
                className="h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              />
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                placeholder="Message"
                className="h-28 w-full rounded-md border border-zinc-300 bg-white p-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              />
              <div className="flex items-center justify-end">
                <button
                  onClick={performAction}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmRemove && (
          <div className="mt-4 rounded-lg border border-rose-300 bg-rose-50 p-3 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Remove access</div>
            </div>
            <p className="mt-2 text-sm">This is a destructive action. Are you sure you want to remove access for {selectionCount} students?</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={performAction}
                className="inline-flex h-9 items-center justify-center rounded-md border border-rose-300 bg-white px-3 text-sm font-medium text-rose-700 transition hover:bg-rose-50 dark:border-rose-900/50 dark:bg-zinc-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
              >
                Confirm remove
              </button>
              <button
                onClick={() => {
                  setShowConfirmRemove(false);
                  setCurrentAction(null);
                }}
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Import students</div>
            <div className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">Upload a CSV and map columns</div>
          </div>
          <div className="flex items-center gap-2">
            <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Upload CSV
            </button>
            <button
              onClick={startImport}
              disabled={importing || !csvRows.length}
              className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition disabled:opacity-60 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Start import
            </button>
          </div>
        </div>

        {csvFileName && (
          <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="text-xs">File: {csvFileName}</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">{csvRows.length} rows</div>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <div>
                <div className="text-xs font-semibold">Map name</div>
                <select
                  value={mapName}
                  onChange={(e) => setMapName(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                >
                  {csvHeaders.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs font-semibold">Map email</div>
                <select
                  value={mapEmail}
                  onChange={(e) => setMapEmail(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                >
                  {csvHeaders.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="text-xs font-semibold">Map course</div>
                <select
                  value={mapCourse}
                  onChange={(e) => setMapCourse(e.target.value)}
                  className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                >
                  {csvHeaders.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="mt-3 rounded-lg border border-rose-300 bg-rose-50 p-3 text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            <div className="text-sm font-semibold">Validation errors</div>
            <ul className="mt-2 list-disc pl-5 text-sm">
              {validationErrors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}

        {csvRows.length > 0 && validationErrors.length === 0 && (
          <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Column mapping preview</div>
            <div className="mt-2 overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="px-3 py-2">CSV</th>
                    <th className="px-3 py-2">Mapped to</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  <tr>
                    <td className="px-3 py-2">{mapName}</td>
                    <td className="px-3 py-2">name</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">{mapEmail}</td>
                    <td className="px-3 py-2">email</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2">{mapCourse}</td>
                    <td className="px-3 py-2">course</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {importing && (
          <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Importing...</div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                {importSummary.success} imported • {importSummary.failed} failed
              </div>
            </div>
            <div className="mt-2">
              <ProgressBar value={importProgress} />
            </div>
          </div>
        )}

        {!importing && (importSummary.success > 0 || importSummary.failed > 0) && (
          <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Import summary</div>
            <div className="mt-2 text-sm">
              <span className="text-emerald-600 dark:text-emerald-400">{importSummary.success} success</span> •{" "}
              <span className="text-rose-700 dark:text-rose-300">{importSummary.failed} failed</span>
            </div>
            {importSummary.failed > 0 && (
              <div className="mt-2 rounded-md border border-amber-300 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                Partial import success. Review validation and try again.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

