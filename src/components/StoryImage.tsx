import type { NewsStory } from "@/lib/schema";
import { resolveBrandMark } from "@/lib/brands";

/** Fixed 96×96 box — real image or brand/country fallback */
export function StoryImage({
  story,
  size = 96,
}: {
  story: NewsStory;
  size?: 72 | 96 | 120;
}) {
  const dim = size;
  const brand = resolveBrandMark(story.organization, story.country_code);

  if (story.image_url) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--bg-surface)]"
        style={{ width: dim, height: dim }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={story.image_url}
          alt=""
          width={dim}
          height={dim}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-[var(--radius-md)] font-semibold tracking-tight select-none"
      style={{
        width: dim,
        height: dim,
        backgroundColor: brand.bg,
        color: brand.fg,
        fontSize: dim >= 96 ? 22 : 18,
      }}
      aria-hidden
    >
      {brand.label}
    </div>
  );
}
