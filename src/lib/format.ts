/** Client-safe date/flag helpers — no Node.js APIs */

export function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸",
  GB: "🇬🇧",
  UK: "🇬🇧",
  FR: "🇫🇷",
  DE: "🇩🇪",
  IN: "🇮🇳",
  CN: "🇨🇳",
  JP: "🇯🇵",
  EU: "🇪🇺",
  CA: "🇨🇦",
  AU: "🇦🇺",
  KR: "🇰🇷",
  GLOBAL: "",
};
