"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Channel = "email" | "whatsapp";
type Status = "draft" | "scheduled" | "sent";
type Campaign = {
  id: string;
  name: string;
  channel: Channel;
  segment: string;
  status: Status;
  openRate?: number;
  clickRate?: number;
  scheduledAt?: string;
  subject?: string;
  body?: string;
};

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    draft: "bg-zinc-200 text-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-300",
    scheduled: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300",
    sent: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300",
  };
  const label = status === "draft" ? "Draft" : status === "scheduled" ? "Scheduled" : "Sent";
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${map[status]}`}>{label}</span>;
}
function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
      <td className="px-3 py-3"><div className="h-8 w-28 rounded bg-zinc-200 dark:bg-zinc-800" /></td>
    </tr>
  );
}

export default function CampaignsPage() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [segment, setSegment] = useState("All students");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCampaigns([
        { id: "c1", name: "Welcome series", channel: "email", segment: "New signups", status: "sent", openRate: 42, clickRate: 8, subject: "Welcome to the Academy" },
        { id: "c2", name: "Course reminder", channel: "whatsapp", segment: "Active last 7 days", status: "scheduled", scheduledAt: "2026-01-20T10:00" },
        { id: "c3", name: "AI Foundations launch", channel: "email", segment: "Course: AI Foundations", status: "draft" },
      ]);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const variablesPreview = useMemo(() => {
    const sample = { name: "Ava Chen", course: "Prompt Engineering" };
    const resolvedSubject = subject.replaceAll("{{name}}", sample.name).replaceAll("{{course}}", sample.course);
    const resolvedBody = body.replaceAll("{{name}}", sample.name).replaceAll("{{course}}", sample.course);
    return { subject: resolvedSubject, body: resolvedBody };
  }, [subject, body]);

  const segments = useMemo(
    () => ["All students", "New signups", "Active last 7 days", "Inactive 30 days", "Course: AI Foundations", "Course: Data Viz Mastery"],
    []
  );

  function openCreate() {
    setShowModal(true);
    setStep(1);
    setName("");
    setChannel("email");
    setSegment("All students");
    setSubject("");
    setBody("");
    setScheduleAt("");
    setError("");
  }
  function nextStep() {
    if (step === 1) {
      if (!channel) {
        setError("Select a channel");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!segment) {
        setError("Select a segment");
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      if (!subject.trim() || !body.trim()) {
        setError("Subject and message are required");
        return;
      }
      setStep(4);
      return;
    }
  }
  function prevStep() {
    setError("");
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3 | 4) : s));
  }
  function saveDraft() {
    const payload: Campaign = {
      id: Math.random().toString(36).slice(2, 9),
      name: name || "Untitled campaign",
      channel,
      segment,
      status: "draft",
      subject,
      body,
    };
    setCampaigns((prev) => [payload, ...prev]);
    setShowModal(false);
  }
  function scheduleCampaign() {
    if (!scheduleAt) {
      setError("Select schedule date and time");
      return;
    }
    const payload: Campaign = {
      id: Math.random().toString(36).slice(2, 9),
      name: name || "Untitled campaign",
      channel,
      segment,
      status: "scheduled",
      scheduledAt: scheduleAt,
      subject,
      body,
    };
    setCampaigns((prev) => [payload, ...prev]);
    setShowModal(false);
  }
  function sendNow() {
    const payload: Campaign = {
      id: Math.random().toString(36).slice(2, 9),
      name: name || "Untitled campaign",
      channel,
      segment,
      status: "sent",
      openRate: 0,
      clickRate: 0,
      subject,
      body,
    };
    setCampaigns((prev) => [payload, ...prev]);
    setShowModal(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Campaigns</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create and track communication campaigns</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/marketing/overview"
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Back to overview
          </Link>
          <button
            onClick={openCreate}
            className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            Create campaign
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="max-h-[520px] overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white dark:bg-zinc-900">
              <tr className="text-left">
                <th className="px-3 py-2 font-semibold">Campaign name</th>
                <th className="px-3 py-2 font-semibold">Channel</th>
                <th className="px-3 py-2 font-semibold">Segment</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Open rate</th>
                <th className="px-3 py-2 font-semibold">Click rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-12">
                    <div className="mx-auto max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
                          <path d="M3 13h18v2H3v-2zm2-4h14v2H5V9zm3-4h8v2H8V5zm3 12h2v4h-2v-4z" className="fill-current" />
                        </svg>
                      </div>
                      <div className="mt-4 text-base font-medium">No campaigns yet</div>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Create your first campaign to communicate with students.</p>
                      <div className="mt-4">
                        <button
                          onClick={openCreate}
                          className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                          Create campaign
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                    <td className="px-3 py-2">{c.name}</td>
                    <td className="px-3 py-2 capitalize">{c.channel}</td>
                    <td className="px-3 py-2">{c.segment}</td>
                    <td className="px-3 py-2"><StatusBadge status={c.status} /></td>
                    <td className="px-3 py-2">{c.status === "sent" && typeof c.openRate === "number" ? `${c.openRate}%` : "—"}</td>
                    <td className="px-3 py-2">{c.status === "sent" && typeof c.clickRate === "number" ? `${c.clickRate}%` : "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="absolute left-1/2 top-1/2 w-[680px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <div className="text-sm font-semibold">Create Campaign</div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <div className={step >= 1 ? "rounded-full bg-indigo-600 px-2 py-0.5 text-white" : "rounded-full bg-zinc-200 px-2 py-0.5"}>1</div>
                <div className="text-zinc-600 dark:text-zinc-400">Channel</div>
                <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
                <div className={step >= 2 ? "rounded-full bg-indigo-600 px-2 py-0.5 text-white" : "rounded-full bg-zinc-200 px-2 py-0.5"}>2</div>
                <div className="text-zinc-600 dark:text-zinc-400">Segment</div>
                <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
                <div className={step >= 3 ? "rounded-full bg-indigo-600 px-2 py-0.5 text-white" : "rounded-full bg-zinc-200 px-2 py-0.5"}>3</div>
                <div className="text-zinc-600 dark:text-zinc-400">Message</div>
                <div className="h-px w-8 bg-zinc-200 dark:bg-zinc-800" />
                <div className={step >= 4 ? "rounded-full bg-indigo-600 px-2 py-0.5 text-white" : "rounded-full bg-zinc-200 px-2 py-0.5"}>4</div>
                <div className="text-zinc-600 dark:text-zinc-400">Schedule / Send</div>
              </div>
            </div>
            <div className="space-y-3 px-4 py-3 text-sm">
              {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300">{error}</div>}
              {step === 1 && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Campaign name</div>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., January Newsletter"
                      className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Channel</div>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value as Channel)}
                      className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                    >
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Student segment</div>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                  >
                    {segments.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {step === 3 && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Subject line</div>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Welcome to the Academy"
                      className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                    />
                    <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">Variables: {"{{name}}"}, {"{{course}}"}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Message body</div>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your message. Use {{name}} and {{course}}."
                      className="mt-1 h-40 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                      <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Variables preview</div>
                      <div className="mt-2 text-sm">
                        <div className="font-medium">{variablesPreview.subject || "Subject preview"}</div>
                        <div className="mt-1 text-zinc-700 dark:text-zinc-300">{variablesPreview.body || "Message preview"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {step === 4 && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Schedule</div>
                    <input
                      type="datetime-local"
                      value={scheduleAt}
                      onChange={(e) => setScheduleAt(e.target.value)}
                      className="mt-1 h-9 w-full rounded-md border border-zinc-300 bg-white px-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={scheduleCampaign}
                      className="inline-flex h-9 items-center justify-center rounded-md border border-indigo-300 bg-white px-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-900/50 dark:bg-zinc-900 dark:text-indigo-300 dark:hover:bg-indigo-950/30"
                    >
                      Schedule
                    </button>
                    <button
                      onClick={sendNow}
                      className="inline-flex h-9 items-center justify-center rounded-md bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700"
                    >
                      Send now
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevStep}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Back
                  </button>
                  <button
                    onClick={saveDraft}
                    className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Save draft
                  </button>
                </div>
                {step < 4 && (
                  <button
                    onClick={nextStep}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
