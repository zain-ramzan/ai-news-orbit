"use client";

import { useState } from "react";
import type { NewsStory } from "@/lib/schema";
import { brandLogoUrl, resolveBrandMark } from "@/lib/brands";

/** Fixed square box — story image → org logo → letter fallback */
export function StoryImage({
  story,
  size = 96,
}: {
  story: NewsStory;
  size?: 72 | 96 | 120;
}) {
  const brand = resolveBrandMark(story.organization, story.country_code);
  const logoSrc = brandLogoUrl(brand.domain, 128);
  const [failed, setFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const showPhoto = story.image_url && !failed;
  const showLogo = !showPhoto && logoSrc && !logoFailed;

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
      style={{ width: size, height: size }}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.image_url!}
          alt=""
          width={size}
          height={size}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : showLogo ? (
        <div className="flex h-full w-full items-center justify-center bg-white p-3 dark:bg-zinc-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc!}
            alt={story.organization[0] || "logo"}
            width={Math.round(size * 0.55)}
            height={Math.round(size * 0.55)}
            className="object-contain"
            loading="lazy"
            onError={() => setLogoFailed(true)}
          />
        </div>
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-semibold tracking-tight select-none"
          style={{
            backgroundColor: brand.bg,
            color: brand.fg,
            fontSize: size >= 96 ? 22 : 18,
          }}
          aria-hidden
        >
          {brand.label}
        </div>
      )}
    </div>
  );
}
