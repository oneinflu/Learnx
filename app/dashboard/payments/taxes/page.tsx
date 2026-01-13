"use client";
import { useEffect, useMemo, useState } from "react";

type Invoice = {
  number: string;
  student: { name: string; email: string };
  amount: number;
  taxAmount: number;
  currency: string;
  date: string;
};

function formatCurrency(v: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v);
}

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

function SkeletonLine({ w = "w-full" }: { w?: string }) {
  return <div className={`h-4 ${w} animate-pulse rounded bg-zinc-200 dark:bg-zinc-800`} />;
}

export default function TaxesInvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency] = useState("USD");

  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("");
  const [taxId, setTaxId] = useState("");

  const [invoicePrefix, setInvoicePrefix] = useState("INV-");
  const [address, setAddress] = useState("123 Academy St, City, Country");
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const shouldError = false;
      if (shouldError) {
        setError("Failed to load tax and invoice data");
        setLoading(false);
        return;
      }
      setBusinessName("Aurora Labs");
      setCountry("United States");
      setTaxId("GST-12345");
      setInvoices([
        { number: "INV-0001", student: { name: "Alex", email: "alex@example.com" }, amount: 199, taxAmount: 0, currency, date: "2026-01-12T10:12:00Z" },
        { number: "INV-0002", student: { name: "Maya", email: "maya@example.com" }, amount: 149, taxAmount: 15, currency, date: "2026-01-11T09:05:00Z" },
      ]);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [currency]);

  const missingTaxInfo = useMemo(() => {
    return !loading && (!businessName || !country || !taxId);
  }, [loading, businessName, country, taxId]);

  const hasInvoices = useMemo(() => invoices.length > 0, [invoices]);

  if (error) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">
        <div className="text-sm font-semibold">Error</div>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Taxes & Invoices</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Manage tax compliance and invoices</p>
        </div>
      </div>

      {missingTaxInfo && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
          Missing tax information. Add business details to comply with invoicing requirements.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-6 space-y-4">
          <Card
            title="Tax information"
            actions={
              <button className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                Edit
              </button>
            }
          >
            {loading ? (
              <div className="space-y-2">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </div>
            ) : (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600 dark:text-zinc-400">Business name</div>
                  <div className="font-medium">{businessName || "—"}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600 dark:text-zinc-400">Country</div>
                  <div className="font-medium">{country || "—"}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-zinc-600 dark:text-zinc-400">Tax ID</div>
                  <div className="font-medium">{taxId || "—"}</div>
                </div>
              </div>
            )}
          </Card>
        </section>
        <aside className="lg:col-span-6 space-y-4">
          <Card title="Invoice settings">
            {loading ? (
              <div className="space-y-2">
                <SkeletonLine />
                <SkeletonLine />
                <SkeletonLine />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Invoice prefix</div>
                  <input
                    value={invoicePrefix}
                    onChange={(e) => setInvoicePrefix(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
                <div className="sm:col-span-1">
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Logo</div>
                  <div className="mt-1 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-md bg-zinc-200 dark:bg-zinc-800" />
                    <button className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
                      Upload
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Address</div>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-md border border-zinc-300 bg-white p-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                    Save settings
                  </button>
                </div>
              </div>
            )}
          </Card>
        </aside>
      </div>

      <Card title="Invoices">
        {loading ? (
          <div className="space-y-2">
            <SkeletonLine />
            <SkeletonLine />
            <SkeletonLine />
          </div>
        ) : !hasInvoices ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-medium">No invoices generated</div>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Invoices will appear here when purchases complete.</p>
          </div>
        ) : (
          <div className="max-h-[420px] overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
                <tr className="text-left">
                  <th className="px-3 py-2 font-semibold">Invoice number</th>
                  <th className="px-3 py-2 font-semibold">Student</th>
                  <th className="px-3 py-2 font-semibold">Amount</th>
                  <th className="px-3 py-2 font-semibold">Tax amount</th>
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {invoices.map((inv) => (
                  <tr key={inv.number} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-3 py-2">{inv.number}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{inv.student.name}</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{inv.student.email}</div>
                    </td>
                    <td className="px-3 py-2">{formatCurrency(inv.amount, inv.currency)}</td>
                    <td className="px-3 py-2">{formatCurrency(inv.taxAmount, inv.currency)}</td>
                    <td className="px-3 py-2">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="px-3 py-2">
                      <a
                        href="#"
                        className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                        onClick={(e) => e.preventDefault()}
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

