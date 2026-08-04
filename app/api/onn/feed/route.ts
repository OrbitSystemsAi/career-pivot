import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/core/server/auth";
import type { OnnFeedSignal } from "@/modules/home/lib/onnFeedSignals";
import { loadOnnFeed } from "@/modules/home/server/onnFeedAdapter";

export const dynamic = "force-dynamic";

function signals(value: unknown): OnnFeedSignal[] | null {
  if (!Array.isArray(value) || value.length > 30) return null;
  const parsed = value.filter((item): item is OnnFeedSignal => Boolean(item && typeof item === "object" && typeof item.slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) && typeof item.weight === "number" && item.weight >= 0 && item.weight <= 10 && ["career", "interest", "group", "network"].includes(item.source)));
  return parsed.length === value.length ? parsed : null;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => null) as { topics?: unknown; classifications?: unknown } | null;
  const topics = signals(body?.topics), classifications = signals(body?.classifications);
  if (!topics || !classifications || (!topics.length && !classifications.length)) return NextResponse.json({ error: "Invalid feed preferences." }, { status: 400 });
  try {
    const feed = await loadOnnFeed(session.email, { topics, classifications });
    return NextResponse.json({ feed }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Your personalized edition is temporarily unavailable." }, { status: 503 });
  }
}
