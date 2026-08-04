import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { mutateData, queryData, type StoredAccount } from "./dataStore";

const SESSION_COOKIE = "career_pivot_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30;

export type ServerSession = {
  version: 3;
  email: string;
  displayName: string;
  signedInAt: string;
  onboardingRequired?: boolean;
  onboardingReturnVisit?: boolean;
  expiresAt: number;
};

function sessionSecret() {
  const configured = process.env.AUTH_SESSION_SECRET;
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SESSION_SECRET is required in production.");
  }
  return "career-pivot-development-session-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function serializeSession(session: ServerSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function parseSession(token?: string): ServerSession | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ServerSession;
    if (session.version !== 3 || session.expiresAt <= Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getServerSession() {
  return parseSession((await cookies()).get(SESSION_COOKIE)?.value);
}

export async function requireServerSession() {
  const session = await getServerSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}

export async function setServerSession(account: Pick<StoredAccount, "email" | "displayName" | "onboardingRequired">, onboardingReturnVisit = false) {
  const session: ServerSession = {
    version: 3,
    email: account.email,
    displayName: account.displayName,
    signedInAt: new Date().toISOString(),
    onboardingRequired: account.onboardingRequired,
    onboardingReturnVisit,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000,
  };
  (await cookies()).set(SESSION_COOKIE, serializeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
  return session;
}

export async function clearServerSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

export function hashPassword(password: string, salt = randomBytes(16).toString("base64url")) {
  return { salt, hash: scryptSync(password, salt, 64).toString("base64url") };
}

export function passwordMatches(password: string, account: StoredAccount) {
  const actual = scryptSync(password, account.passwordSalt, 64);
  const expected = Buffer.from(account.passwordHash, "base64url");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function findAccount(email: string) {
  return queryData((data) => data.accounts.find((account) => account.email === email));
}

export async function createAccount(account: StoredAccount) {
  return mutateData((data) => {
    if (data.accounts.some((candidate) => candidate.email === account.email)) throw new Error("ACCOUNT_EXISTS");
    data.accounts.push(account);
    return account;
  });
}

export async function updateAccount(email: string, update: Partial<StoredAccount>) {
  return mutateData((data) => {
    const account = data.accounts.find((candidate) => candidate.email === email);
    if (!account) throw new Error("ACCOUNT_NOT_FOUND");
    Object.assign(account, update);
    return account;
  });
}

export async function removeAccount(email: string) {
  return mutateData((data) => {
    data.accounts = data.accounts.filter((account) => account.email !== email);
    data.posts = data.posts.filter((post) => post.authorEmail !== email);
  });
}
