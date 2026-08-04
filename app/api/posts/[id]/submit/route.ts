import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/core/server/auth";
import { validateForSubmission } from "@/modules/home/lib/postValidation";
import { submitToOnn, OnnSubmissionError } from "@/modules/home/server/onnAdapter";
import { getPost, markFailed, markSubmitted, markSubmitting } from "@/modules/home/server/postRepository";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, { params }: RouteContext) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const id = (await params).id;
  const existing = await getPost(id, session.email);
  if (!existing) return NextResponse.json({ error: "Draft not found." }, { status: 404 });
  if (existing.status === "submitted") return NextResponse.json({ post: existing });

  const fields = validateForSubmission(existing);
  if (Object.keys(fields).length > 0) return NextResponse.json({ error: "Complete the required fields before submitting to ONN.", fields }, { status: 422 });

  const post = await markSubmitting(id, session.email);
  try {
    const result = await submitToOnn(post);
    return NextResponse.json({ post: await markSubmitted(id, session.email, result.submissionId) });
  } catch (error) {
    const submissionError = error instanceof OnnSubmissionError ? error : new OnnSubmissionError("ONN submission failed unexpectedly.", true);
    const failedPost = await markFailed(id, session.email, submissionError.message);
    return NextResponse.json({ error: submissionError.message, retryable: submissionError.retryable, post: failedPost }, { status: submissionError.retryable ? 503 : 422 });
  }
}
