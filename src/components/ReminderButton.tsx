"use client";

import { useEffect, useRef, useState } from "react";

const SITE = "https://ai-news-orbit.vercel.app";
const TITLE = "AI News Orbit — morning briefing";
const DETAILS = `Open the daily agentic AI briefing:\n${SITE}\n\nWeekdays only (Mon–Fri).`;

function nextWeekdayNine(): { start: string; end: string; icsStart: string; icsEnd: string } {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  const day = d.getDay();
  if (day === 0) d.setDate(d.getDate() + 1);
  else if (day === 6) d.setDate(d.getDate() + 2);
  else if (new Date().getHours() >= 9) {
    d.setDate(d.getDate() + 1);
    const n = d.getDay();
    if (n === 0) d.setDate(d.getDate() + 1);
    if (n === 6) d.setDate(d.getDate() + 2);
  }
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = d.getFullYear();
  const m = pad(d.getMonth() + 1);
  const dayNum = pad(d.getDate());
  const startLocal = `${y}${m}${dayNum}T090000`;
  const endLocal = `${y}${m}${dayNum}T091500`;
  return { start: startLocal, end: endLocal, icsStart: startLocal, icsEnd: endLocal };
}

function googleCalendarUrl() {
  const { start, end } = nextWeekdayNine();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: TITLE,
    details: DETAILS,
    location: SITE,
    dates: `${start}/${end}`,
    recur: "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function outlookUrl() {
  const { start } = nextWeekdayNine();
  const y = start.slice(0, 4);
  const m = start.slice(4, 6);
  const d = start.slice(6, 8);
  const startIso = `${y}-${m}-${d}T09:00:00`;
  const endIso = `${y}-${m}-${d}T09:15:00`;
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: TITLE,
    body: DETAILS,
    startdt: startIso,
    enddt: endIso,
    location: SITE,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function buildIcs(): string {
  const { icsStart, icsEnd } = nextWeekdayNine();
  const uid = `orbit-briefing-${Date.now()}@ai-news-orbit`;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AI News Orbit//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART:${icsStart}`,
    `DTEND:${icsEnd}`,
    "RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR",
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DETAILS.replace(/\n/g, "\\n")}`,
    `URL:${SITE}`,
    `LOCATION:${SITE}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function downloadIcs() {
  const blob = new Blob([buildIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ai-news-orbit-briefing.ics";
  a.click();
  URL.revokeObjectURL(url);
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 23 23" aria-hidden>
      <path fill="#f35325" d="M1 1h10v10H1z" />
      <path fill="#81bc06" d="M12 1h10v10H12z" />
      <path fill="#05a6f0" d="M1 12h10v10H1z" />
      <path fill="#ffba08" d="M12 12h10v10H12z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export function ReminderButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span className="hidden xs:inline sm:inline">Add reminder</span>
        <span className="sm:hidden">Remind</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[min(100vw-2rem,16.5rem)] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-app)] shadow-lg"
        >
          <div className="border-b border-[var(--border-default)] px-3 py-2.5">
            <p className="text-xs font-medium text-[var(--text-primary)]">Weekday briefing</p>
            <p className="text-[11px] leading-snug text-[var(--text-secondary)]">
              Mon–Fri · 9:00 AM · opens AI News Orbit
            </p>
          </div>
          <a
            role="menuitem"
            href={googleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)] bg-white">
              <GoogleIcon />
            </span>
            Google Calendar
          </a>
          <a
            role="menuitem"
            href={outlookUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)] bg-white">
              <MicrosoftIcon />
            </span>
            Microsoft Outlook
          </a>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            onClick={() => {
              downloadIcs();
              setOpen(false);
            }}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] text-[var(--text-primary)]">
              <AppleIcon />
            </span>
            Apple Calendar
          </button>
        </div>
      )}
    </div>
  );
}
