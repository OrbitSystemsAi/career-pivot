import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/core/server/auth";
import { parsePostInput } from "@/modules/home/lib/postValidation";
import { deletePost, getPost, savePost } from "@/modules/home/server/postRepository";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const post = await getPost((await params).id, session.email);
  if (!post) return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  return NextResponse.json({ post }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    const post = await savePost(parsePostInput(await request.json().catch(() => null)), { email: session.email, name: session.displayName }, (await params).id);
    return NextResponse.json({ post });
  } catch (error) {
    const message = (error as Error).message;
    if (message === "POST_NOT_FOUND") return NextResponse.json({ error: "Draft not found." }, { status: 404 });
    if (message === "POST_ALREADY_SUBMITTED") return NextResponse.json({ error: "Submitted stories cannot be edited." }, { status: 409 });
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  try {
    await deletePost((await params).id, session.email);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = (error as Error).message;
    if (message === "POST_NOT_FOUND") return NextResponse.json({ error: "Draft not found." }, { status: 404 });
    if (message === "POST_ALREADY_SUBMITTED") return NextResponse.json({ error: "Submitted stories cannot be deleted." }, { status: 409 });
    throw error;
  }
}
