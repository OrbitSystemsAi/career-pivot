import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/core/server/auth";
import { parsePostInput } from "@/modules/home/lib/postValidation";
import { listPosts, savePost } from "@/modules/home/server/postRepository";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  return NextResponse.json({ posts: await listPosts(session.email) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const input = parsePostInput(await request.json().catch(() => null));
  const post = await savePost(input, { email: session.email, name: session.displayName });
  return NextResponse.json({ post }, { status: 201 });
}
