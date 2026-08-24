import { NextRequest, NextResponse } from "next/server";
import { searchStories } from "@/lib/news";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? undefined;
  const verification = searchParams.get("verification") ?? undefined;
  const organization = searchParams.get("organization") ?? undefined;
  const country = searchParams.get("country") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 50);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);

  const { stories, total } = searchStories(q, {
    category,
    verification: verification as "confirmed" | "reported" | "rumor" | undefined,
    organization,
    country,
    limit,
    offset,
  });

  return NextResponse.json(
    { stories, total, offset, limit },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
