import { NextRequest, NextResponse } from "next/server";
import {
  clearServerSession,
  createAccount,
  findAccount,
  getServerSession,
  hashPassword,
  passwordMatches,
  removeAccount,
  setServerSession,
  updateAccount,
} from "@/core/server/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ session: await getServerSession() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const mode = body?.mode;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!EMAIL_PATTERN.test(email) || password.length < 6) {
    return NextResponse.json({ error: "Enter a valid email and password." }, { status: 400 });
  }

  if (mode === "register") {
    const displayName = typeof body?.displayName === "string" ? body.displayName.trim().replace(/\s+/g, " ") : "";
    if (displayName.length < 2) return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
    const { hash, salt } = hashPassword(password);
    try {
      const account = await createAccount({ email, displayName, passwordHash: hash, passwordSalt: salt, createdAt: new Date().toISOString(), onboardingRequired: true });
      return NextResponse.json({ session: await setServerSession(account) }, { status: 201 });
    } catch (error) {
      if ((error as Error).message === "ACCOUNT_EXISTS") return NextResponse.json({ error: "An account already exists for this email. Log in instead." }, { status: 409 });
      throw error;
    }
  }

  if (mode === "login") {
    const account = await findAccount(email);
    if (!account || !passwordMatches(password, account)) return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    return NextResponse.json({ session: await setServerSession(account) });
  }

  return NextResponse.json({ error: "Unsupported authentication request." }, { status: 400 });
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  const body = await request.json().catch(() => null) as { onboardingRequired?: boolean; onboardingReturnVisit?: boolean } | null;
  if (typeof body?.onboardingRequired !== "boolean") return NextResponse.json({ error: "Invalid onboarding state." }, { status: 400 });
  const account = await updateAccount(session.email, {
    onboardingRequired: body.onboardingRequired,
    onboardingCompletedAt: body.onboardingRequired ? undefined : new Date().toISOString(),
  });
  return NextResponse.json({ session: await setServerSession(account, body.onboardingReturnVisit === true) });
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  if (request.nextUrl.searchParams.get("account") === "true" && session) await removeAccount(session.email);
  await clearServerSession();
  return new NextResponse(null, { status: 204 });
}
