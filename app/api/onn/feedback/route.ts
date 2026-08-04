import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/core/server/auth";
import { sendOnnFeedback } from "@/modules/home/server/onnFeedAdapter";

const interactions = ["shown", "opened", "saved", "dismissed", "useful", "not_relevant"] as const;

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => null) as { itemType?: unknown; itemId?: unknown; interaction?: unknown } | null;
  if (!body || !["first_party", "external_news"].includes(String(body.itemType)) || typeof body.itemId !== "string" || body.itemId.length > 100 || !interactions.includes(body.interaction as typeof interactions[number])) return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
  try {
    await sendOnnFeedback(session.email, { itemType: body.itemType as "first_party" | "external_news", itemId: body.itemId, interaction: body.interaction as typeof interactions[number] });
    return NextResponse.json({ recorded: true }, { status: 201 });
  } catch {
    return NextResponse.json({ recorded: false }, { status: 503 });
  }
}
