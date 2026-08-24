/** Orbit mark — ring + node, works light and dark */
export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="16" cy="16" r="14" fill="currentColor" className="text-[var(--accent)]" />
      <ellipse
        cx="16"
        cy="16"
        rx="10"
        ry="5.5"
        stroke="white"
        strokeWidth="1.6"
        opacity="0.95"
        transform="rotate(-28 16 16)"
      />
      <circle cx="24.5" cy="11.5" r="2.4" fill="white" />
      <circle cx="16" cy="16" r="2.2" fill="white" opacity="0.9" />
    </svg>
  );
}
