"use client";

import { useEffect, useRef, useState } from "react";

const SITE = "https://ai-news-orbit.vercel.app";
const TITLE = "AI News Orbit — morning briefing";
const DETAILS = `Open the daily agentic AI briefing:\n${SITE}\n\nWeekdays only (Mon–Fri).`;

/** Next weekday at 09:00 local, as YYYYMMDDTHHMMSS for Google dates param */
function nextWeekdayNine(): { start: string; end: string; icsStart: string; icsEnd: string } {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  // If past 9am today, or weekend, move forward
  const day = d.getDay(); // 0 Sun … 6 Sat
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
  // ICS uses local floating time
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
  // Outlook deep link (all-day style path uses ISO)
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
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-1.5 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        Add reminder
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--bg-app)] shadow-lg"
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
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#fff] text-xs font-bold text-[#4285F4] border border-[var(--border-default)]">
              G
            </span>
            Google Calendar
          </a>
          <a
            role="menuitem"
            href={outlookUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            onClick={() => setOpen(false)}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0078D4] text-xs font-bold text-white">
              O
            </span>
            Outlook / Microsoft
          </a>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            onClick={() => {
              downloadIcs();
              setOpen(false);
            }}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--bg-surface)] text-xs font-bold text-[var(--text-primary)] border border-[var(--border-default)]">
              
            </span>
            Apple Calendar (.ics)
          </button>
        </div>
      )}
    </div>
  );
}
