"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type ReactionKey = "like" | "celebrate" | "love";
type Reactions = { like: number; celebrate: number; love: number; mine: { like: boolean; celebrate: boolean; love: boolean } };
type Comment = { id: string; author: string; role?: string; content: string; when: string };
type Post = {
  id: string;
  author: string;
  role?: string;
  avatarHue: number;
  when: string;
  content: string;
  pinned?: boolean;
  reactions: Reactions;
  comments: Comment[];
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function Avatar({ hue }: { hue: number }) {
  return <span className="inline-block h-8 w-8 rounded-full" style={{ backgroundColor: `hsl(${hue}deg 60% 70%)` }} />;
}

function ReactionButton({
  label,
  emoji,
  active,
  count,
  onClick,
}: {
  label: string;
  emoji: string;
  active: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "inline-flex items-center gap-1 rounded-md border border-indigo-400 bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/50 dark:bg-indigo-900/20 dark:text-indigo-300"
          : "inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      }
      aria-pressed={active}
    >
      <span>{emoji}</span>
      <span>{label}</span>
      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">({count})</span>
    </button>
  );
}

function PostCard({
  post,
  onTogglePin,
  onReact,
  onAddComment,
}: {
  post: Post;
  onTogglePin: (id: string) => void;
  onReact: (id: string, key: ReactionKey) => void;
  onAddComment: (id: string, text: string) => void;
}) {
  const [showComments, setShowComments] = useState(true);
  const [text, setText] = useState("");

  return (
    <article className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar hue={post.avatarHue} />
          <div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold">{post.author}</div>
              {post.role && (
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
                  {post.role}
                </span>
              )}
              {post.pinned && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                  Pinned
                </span>
              )}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">{post.when}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTogglePin(post.id)}
            className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            {post.pinned ? "Unpin" : "Pin"}
          </button>
          <Link
            href={`/dashboard/community/${post.id}`}
            className="inline-flex h-8 items-center justify-center rounded-md border border-zinc-300 bg-white px-2 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
          >
            Open
          </Link>
        </div>
      </header>

      <div className="mt-3 whitespace-pre-wrap text-sm">{post.content}</div>

      <div className="mt-4 flex items-center gap-2">
        <ReactionButton
          label="Like"
          emoji="👍"
          active={post.reactions.mine.like}
          count={post.reactions.like}
          onClick={() => onReact(post.id, "like")}
        />
        <ReactionButton
          label="Celebrate"
          emoji="🎉"
          active={post.reactions.mine.celebrate}
          count={post.reactions.celebrate}
          onClick={() => onReact(post.id, "celebrate")}
        />
        <ReactionButton
          label="Love"
          emoji="❤️"
          active={post.reactions.mine.love}
          count={post.reactions.love}
          onClick={() => onReact(post.id, "love")}
        />
      </div>

      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{post.comments.length} comments</div>
          <button
            onClick={() => setShowComments((v) => !v)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {showComments ? "Hide" : "Show"}
          </button>
        </div>
        {showComments && (
          <div className="mt-3 space-y-3">
            {post.comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <span className="inline-block h-6 w-6 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-semibold">{c.author}</div>
                    {c.role && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
                        {c.role}
                      </span>
                    )}
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">{c.when}</div>
                  </div>
                  <div className="mt-1 text-sm">{c.content}</div>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment"
                className="h-9 flex-1 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none ring-0 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-indigo-400"
              />
              <button
                onClick={() => {
                  const t = text.trim();
                  if (!t) return;
                  onAddComment(post.id, t);
                  setText("");
                }}
                className="inline-flex h-9 items-center justify-center rounded-md bg-indigo-600 px-3 text-xs font-medium text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "p1",
      author: "Founder",
      role: "Admin",
      avatarHue: 220,
      when: "Today, 9:12 AM",
      content: "Weekly wins thread\nShare your progress, questions, and wins from this week.",
      pinned: true,
      reactions: { like: 12, celebrate: 5, love: 3, mine: { like: false, celebrate: false, love: false } },
      comments: [
        { id: uid(), author: "Alex", content: "Shipped course outline and recorded first lesson!", when: "1h ago" },
        { id: uid(), author: "Priya", role: "Moderator", content: "Congrats! Keep momentum going.", when: "58m ago" },
      ],
    },
    {
      id: "p2",
      author: "Maya",
      avatarHue: 160,
      when: "Yesterday, 6:45 PM",
      content: "Question: Best practices for structuring cohort timelines? Looking to balance pace and accountability.",
      reactions: { like: 7, celebrate: 2, love: 1, mine: { like: false, celebrate: false, love: false } },
      comments: [{ id: uid(), author: "Jon", content: "Bi-weekly milestones worked well for us.", when: "12h ago" }],
    },
    {
      id: "p3",
      author: "Arjun",
      avatarHue: 20,
      when: "Mon, 1:10 PM",
      content: "Resource: Uploaded a template for live session run-of-show. Hope it helps.",
      reactions: { like: 3, celebrate: 4, love: 0, mine: { like: false, celebrate: false, love: false } },
      comments: [],
    },
  ]);

  function togglePin(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)));
  }

  function react(id: string, key: ReactionKey) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const was = p.reactions.mine[key];
        const nextCount = Math.max(0, p.reactions[key] + (was ? -1 : 1));
        return {
          ...p,
          reactions: {
            ...p.reactions,
            [key]: nextCount,
            mine: { ...p.reactions.mine, [key]: !was },
          },
        };
      })
    );
  }

  function addComment(id: string, text: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [{ id: uid(), author: "You", role: "Member", content: text, when: "now" }, ...p.comments],
            }
          : p
      )
    );
  }

  const sorted = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }, [posts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Community</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Social but professional space for your members.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
            New post
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-8 space-y-4">
          {sorted.map((p) => (
            <PostCard key={p.id} post={p} onTogglePin={togglePin} onReact={react} onAddComment={addComment} />
          ))}
        </section>
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Guidelines</div>
            <ul className="mt-2 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Be helpful and respectful</li>
              <li>Keep topics course-related</li>
              <li>Use pins for announcements</li>
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="text-sm font-semibold">Pinned</div>
            <ul className="mt-2 space-y-2">
              {sorted.filter((p) => p.pinned).map((p) => (
                <li key={p.id} className="flex items-start gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-sm">{p.content.split("\n")[0]}</span>
                </li>
              ))}
              {sorted.filter((p) => p.pinned).length === 0 && (
                <li className="text-sm text-zinc-600 dark:text-zinc-400">No pinned posts</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}

