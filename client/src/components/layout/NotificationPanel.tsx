import { useEffect, useRef, useState } from "react";
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { type ApiNotification, notificationApi } from "@/api/client";

const TYPE_COLORS: Record<ApiNotification["type"], string> = {
  trip: "bg-[var(--navy)]",
  community: "bg-emerald-500",
  reminder: "bg-amber-500",
  system: "bg-slate-400",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ApiNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Fetch on open
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    notificationApi
      .list()
      .then(({ items, unreadCount }) => {
        setItems(items);
        setUnread(unreadCount);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  // Poll unread count every 60s while panel is closed
  useEffect(() => {
    if (open) return;
    const tick = () =>
      notificationApi
        .list()
        .then(({ unreadCount }) => setUnread(unreadCount))
        .catch(() => {});
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleMarkRead = async (id: string) => {
    await notificationApi.markRead(id).catch(() => {});
    setItems((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
    setUnread((c) => Math.max(0, c - 1));
  };

  const handleMarkAllRead = async () => {
    await notificationApi.markAllRead().catch(() => {});
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  };

  const handleRemove = async (id: string) => {
    const target = items.find((n) => n._id === id);
    await notificationApi.remove(id).catch(() => {});
    setItems((prev) => prev.filter((n) => n._id !== id));
    if (target && !target.read) setUnread((c) => Math.max(0, c - 1));
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        aria-label="Travel notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full border border-[var(--line)] p-2.5 text-[var(--navy)] transition hover:border-[var(--gold)] hover:bg-[var(--sand)]"
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)] text-[9px] font-black text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[360px] rounded-2xl border border-[var(--line)] bg-[color:var(--canvas)] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
            <span className="font-serif text-[15px] font-bold text-[var(--navy)]">
              Notifications {unread > 0 && <span className="ml-1 rounded-full bg-[var(--gold)] px-1.5 py-0.5 text-[10px] font-black text-white">{unread}</span>}
            </span>
            <div className="flex items-center gap-1">
              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all read"
                  className="rounded-lg p-1.5 text-[var(--ink-muted)] transition hover:bg-[var(--sand)] hover:text-[var(--navy)]"
                >
                  <CheckCheck size={15} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1.5 text-[var(--ink-muted)] transition hover:bg-[var(--sand)] hover:text-[var(--navy)]"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col gap-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-2 w-2 mt-1.5 shrink-0 rounded-full bg-[var(--sand)]" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-3/4 rounded bg-[var(--sand)] animate-pulse" />
                      <div className="h-2.5 w-full rounded bg-[var(--sand)] animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Bell size={28} className="text-[var(--ink-muted)]" />
                <p className="text-sm font-medium text-[var(--ink-muted)]">You're all caught up</p>
                <p className="text-xs text-[var(--ink-muted)]/60">No notifications yet</p>
              </div>
            ) : (
              <ul>
                {items.map((n) => (
                  <li
                    key={n._id}
                    className={`group flex gap-3 border-b border-[var(--line)] px-4 py-3 transition last:border-0 ${n.read ? "opacity-60" : "bg-[var(--sand)]/30"}`}
                  >
                    {/* Type dot */}
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_COLORS[n.type]}`} />

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      {n.link ? (
                        <Link
                          href={n.link}
                          onClick={() => { if (!n.read) handleMarkRead(n._id); setOpen(false); }}
                          className="block text-[13px] font-semibold leading-snug text-[var(--navy)] hover:underline"
                        >
                          {n.title}
                        </Link>
                      ) : (
                        <p className="text-[13px] font-semibold leading-snug text-[var(--navy)]">{n.title}</p>
                      )}
                      {n.body && <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--ink-muted)]">{n.body}</p>}
                      <p className="mt-1 text-[11px] text-[var(--ink-muted)]/60">{timeAgo(n.createdAt)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-col gap-1 opacity-0 transition group-hover:opacity-100">
                      {!n.read && (
                        <button
                          onClick={() => handleMarkRead(n._id)}
                          title="Mark as read"
                          className="rounded p-1 text-[var(--ink-muted)] hover:bg-[var(--sand)] hover:text-[var(--navy)]"
                        >
                          <Check size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => handleRemove(n._id)}
                        title="Remove"
                        className="rounded p-1 text-[var(--ink-muted)] hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-[var(--line)] px-4 py-2.5 text-center">
              <button
                onClick={handleMarkAllRead}
                className="text-[12px] font-semibold text-[var(--navy)] hover:text-[var(--gold)]"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
