"use client";

import { useState } from "react";
import type { NewsStory } from "@/lib/schema";
import { brandLogoUrl, resolveBrandMark } from "@/lib/brands";

/** Responsive square: 56px mobile → 80px desktop (or compact) */
export function StoryImage({
  story,
  compact = false,
}: {
  story: NewsStory;
  compact?: boolean;
}) {
  const brand = resolveBrandMark(story.organization, story.country_code);
  const logoSrc = brandLogoUrl(brand.domain, 128);
  const [failed, setFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const showPhoto = story.image_url && !failed;
  const showLogo = !showPhoto && logoSrc && !logoFailed;

  const box = compact
    ? "h-12 w-12 sm:h-14 sm:w-14"
    : "h-14 w-14 sm:h-20 sm:w-20";

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] ${box}`}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.image_url!}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : showLogo ? (
        <div className="flex h-full w-full items-center justify-center bg-white p-2 dark:bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc!}
            alt={story.organization[0] || "logo"}
            className="h-[55%] w-[55%] object-contain"
            loading="lazy"
            onError={() => setLogoFailed(true)}
          />
        </div>
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-sm font-semibold tracking-tight select-none sm:text-base"
          style={{
            backgroundColor: brand.bg,
            color: brand.fg,
          }}
          aria-hidden
        >
          {brand.label}
        </div>
      )}
    </div>
  );
}
