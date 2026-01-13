"use client";
import { useEffect, useMemo, useState } from "react";

type TxStatus = "succeeded" | "failed" | "refunded" | "pending";
type Tx = {
  id: string;
  student: { name: string; email: string };
  course: string;
  amount: number;
  currency: string;
  method: "card" | "upi" | "apple";
  status: TxStatus;
  date: string;
};

function formatCurrency(v: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v);
}

function Badge({ status }: { status: TxStatus }) {
  const classes =
    status === "succeeded"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300"
      : status === "failed"
      ? "bg-rose-100 text-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
      : status === "refunded"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
      : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300";
  const label =
    status === "succeeded" ? "Succeeded" : status === "failed" ? "Failed" : status === "refunded" ? "Refunded" : "Pending";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${classes}`}>{label}</span>;
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-3">
        <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
      <td className="px-3 py-3">
        <div className="h-8 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
      </td>
    </tr>
  );
}

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [selected, setSelected] = useState<Tx | null>(null);
  const [confirmRefund, setConfirmRefund] = useState(false);
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState<"all" | string>("all");
  const [status, setStatus] = useState<"all" | TxStatus>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const seed: Tx[] = [
        { id: "tx_1001", student: { name: "Alex", email: "alex@example.com" }, course: "AI Foundations", amount: 199, currency: "USD", method: "card", status: "succeeded", date: "2026-01-12T10:12:00Z" },
        { id: "tx_1002", student: { name: "Maya", email: "maya@example.com" }, course: "Prompt Engineering", amount: 149, currency: "USD", method: "upi", status: "failed", date: "2026-01-12T08:43:00Z" },
        { id: "tx_1003", student: { name: "Jon", email: "jon@example.com" }, course: "Data Viz Mastery", amount: 99, currency: "USD", method: "card", status: "refunded", date: "2026-01-11T18:21:00Z" },
        { id: "tx_1004", student: { name: "Lia", email: "lia@example.com" }, course: "AI Foundations", amount: 249, currency: "USD", method: "apple", status: "succeeded", date: "2026-01-11T15:17:00Z" },
        { id: "tx_1005", student: { name: "Arjun", email: "arjun@example.com" }, course: "Design Systems Mastery", amount: 249, currency: "USD", method: "card", status: "pending", date: "2026-01-10T12:20:00Z" },
      ];
      setTxs(seed);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const courses = useMemo(() => {
    return Array.from(new Set(txs.map((t) => t.course)));
  }, [txs]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;
    return txs.filter((t) => {
      const byQuery =
        q.length === 0 ||
        t.student.email.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q);
      const byCourse = course === "all" ? true : t.course === course;
      const byStatus = status === "all" ? true : t.status === status;
      const d = new Date(t.date);
      const byFrom = fromDate ? d >= fromDate : true;
      const byTo = toDate ? d <= toDate : true;
      return byQuery && byCourse && byStatus && byFrom && byTo;
    });
  }, [txs, query, course, status, from, to]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Transactions</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">View and manage all payment transactions</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Date range</div>
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
              onChange={(e) => setStatus(e.target.value as "all" | TxStatus)}
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            >
              <option value="all">All</option>
              <option value="succeeded">Succeeded</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Email or Transaction ID"
              className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">Transaction ID</th>
                <th className="px-3 py-2 font-semibold">Student</th>
                <th className="px-3 py-2 font-semibold">Course</th>
                <th className="px-3 py-2 font-semibold">Amount</th>
                <th className="px-3 py-2 font-semibold">Method</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Date</th>
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
                txs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-zinc-600 dark:text-zinc-400">
                      No payments yet
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-zinc-600 dark:text-zinc-400">
                      No results found. Adjust filters or search terms.
                    </td>
                  </tr>
                )
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                    onClick={() => setSelected(t)}
                  >
                    <td className="px-3 py-2">{t.id}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{t.student.name}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{t.student.email}</div>
                    </td>
                    <td className="px-3 py-2">{t.course}</td>
                    <td className="px-3 py-2">{formatCurrency(t.amount, t.currency)}</td>
                    <td className="px-3 py-2">{t.method}</td>
                    <td className="px-3 py-2">
                      <Badge status={t.status} />
                    </td>
                    <td className="px-3 py-2">{new Date(t.date).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(t);
                        }}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="absolute right-0 top-0 h-full w-[380px] overflow-auto border-l border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div className="text-sm font-semibold">Transaction details</div>
              <button
                onClick={() => setSelected(null)}
                className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                Close
              </button>
            </div>
            <div className="space-y-4 px-4 py-3 text-sm">
              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs font-semibold">Transaction Summary</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Amount</div>
                    <div className="font-medium">{formatCurrency(selected.amount, selected.currency)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Status</div>
                    <div className="font-medium"><Badge status={selected.status} /></div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Payment gateway</div>
                    <div className="font-medium">{selected.method === "card" ? "Card" : selected.method === "upi" ? "UPI" : "Apple Pay"}</div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">Order ID</div>
                    <div className="font-medium">{selected.id}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs font-semibold">Student</div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-600 dark:text-zinc-400">Name</div>
                    <div className="font-medium">{selected.student.name}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-600 dark:text-zinc-400">Email</div>
                    <div className="font-medium">{selected.student.email}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs font-semibold">Course</div>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-600 dark:text-zinc-400">Course title</div>
                    <div className="font-medium">{selected.course}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-zinc-600 dark:text-zinc-400">Purchase date</div>
                    <div className="font-medium">{new Date(selected.date).toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="text-xs font-semibold">Payment Timeline</div>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center justify-between">
                    <div className="text-zinc-600 dark:text-zinc-400">Payment initiated</div>
                    <div className="text-xs">{new Date(selected.date).toLocaleString()}</div>
                  </li>
                  {selected.status === "succeeded" && (
                    <li className="flex items-center justify-between">
                      <div className="text-zinc-600 dark:text-zinc-400">Payment succeeded</div>
                      <div className="text-xs">{new Date(selected.date).toLocaleString()}</div>
                    </li>
                  )}
                  {selected.status === "failed" && (
                    <li className="flex items-center justify-between">
                      <div className="text-zinc-600 dark:text-zinc-400">Payment failed</div>
                      <div className="text-xs">{new Date(selected.date).toLocaleString()}</div>
                    </li>
                  )}
                  {selected.status === "refunded" && (
                    <li className="flex items-center justify-between">
                      <div className="text-zinc-600 dark:text-zinc-400">Refund processed</div>
                      <div className="text-xs">{new Date(selected.date).toLocaleString()}</div>
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  onClick={(e) => e.preventDefault()}
                >
                  Download invoice
                </a>
                <button
                  onClick={() => setConfirmRefund(true)}
                  className="inline-flex h-8 items-center justify-center rounded-md bg-rose-600 px-2 text-xs font-medium text-white transition hover:bg-rose-700"
                >
                  Initiate refund
                </button>
              </div>

              <div className="border-t border-zinc-200 pt-3 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                Manage refunds and receipts via your payments processor.
              </div>
            </div>
          </div>
          {confirmRefund && (
            <div className="absolute inset-0 z-50">
              <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmRefund(false)} />
              <div className="absolute left-1/2 top-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 shadow-xl dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
                <div className="text-sm font-semibold">Confirm refund</div>
                <p className="mt-2">
                  This will initiate a refund for {selected ? formatCurrency(selected.amount, selected.currency) : ""}. Confirm to proceed.
                </p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setConfirmRefund(false)}
                    className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setConfirmRefund(false);
                    }}
                    className="inline-flex h-8 items-center justify-center rounded-md bg-rose-600 px-2 text-xs font-medium text-white transition hover:bg-rose-700"
                  >
                    Confirm refund
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
