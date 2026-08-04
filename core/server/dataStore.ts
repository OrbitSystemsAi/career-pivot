import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export type StoredAccount = {
  email: string;
  displayName: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  onboardingRequired: boolean;
  onboardingCompletedAt?: string;
};

export type StoredPost = {
  id: string;
  authorEmail: string;
  authorName: string;
  project: string;
  title: string;
  summary: string;
  body: string;
  topics: string[];
  citations: Array<{ label: string; url: string }>;
  distribution: { audience: "public" | "network" | "groups"; channels: Array<"onn" | "career-pivot"> };
  status: "draft" | "submitting" | "submitted" | "failed";
  submissionAttempts: number;
  lastError?: string;
  onnSubmissionId?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
};

type CareerPivotData = { accounts: StoredAccount[]; posts: StoredPost[] };
type AccountRow = {
  email: string;
  display_name: string;
  password_hash: string;
  password_salt: string;
  created_at: Date | string;
  onboarding_required: boolean;
  onboarding_completed_at: Date | string | null;
};
type PostRow = { payload: StoredPost };

const dataFile = path.join(process.cwd(), ".data", process.env.CAREER_PIVOT_DATA_FILE ?? "career-pivot.json");
let writeQueue = Promise.resolve();
let sqlClient: NeonQueryFunction<false, false> | null = null;

function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  sqlClient ??= neon(url);
  return sqlClient;
}

function accountFromRow(row: AccountRow): StoredAccount {
  return {
    email: row.email,
    displayName: row.display_name,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    createdAt: new Date(row.created_at).toISOString(),
    onboardingRequired: row.onboarding_required,
    onboardingCompletedAt: row.onboarding_completed_at ? new Date(row.onboarding_completed_at).toISOString() : undefined,
  };
}

async function readLocalData(): Promise<CareerPivotData> {
  try {
    const value = JSON.parse(await readFile(dataFile, "utf8")) as Partial<CareerPivotData>;
    return { accounts: Array.isArray(value.accounts) ? value.accounts : [], posts: Array.isArray(value.posts) ? value.posts : [] };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { accounts: [], posts: [] };
    throw error;
  }
}

async function mutateLocalData<T>(mutation: (data: CareerPivotData) => T | Promise<T>) {
  let result!: T;
  const operation = writeQueue.then(async () => {
    const data = await readLocalData();
    result = await mutation(data);
    await mkdir(path.dirname(dataFile), { recursive: true });
    const temporaryFile = `${dataFile}.${process.pid}.tmp`;
    await writeFile(temporaryFile, JSON.stringify(data, null, 2), "utf8");
    await rename(temporaryFile, dataFile);
  });
  writeQueue = operation.catch(() => undefined);
  await operation;
  return result;
}

export async function findStoredAccount(email: string) {
  const database = sql();
  if (!database) return (await readLocalData()).accounts.find((account) => account.email === email);
  const rows = await database`select email, display_name, password_hash, password_salt, created_at, onboarding_required, onboarding_completed_at from career_pivot_accounts where email = ${email}` as AccountRow[];
  return rows[0] ? accountFromRow(rows[0]) : undefined;
}

export async function insertStoredAccount(account: StoredAccount) {
  const database = sql();
  if (!database) return mutateLocalData((data) => {
    if (data.accounts.some((candidate) => candidate.email === account.email)) throw new Error("ACCOUNT_EXISTS");
    data.accounts.push(account);
    return account;
  });
  try {
    const rows = await database`
      insert into career_pivot_accounts (email, display_name, password_hash, password_salt, created_at, onboarding_required, onboarding_completed_at)
      values (${account.email}, ${account.displayName}, ${account.passwordHash}, ${account.passwordSalt}, ${account.createdAt}, ${account.onboardingRequired}, ${account.onboardingCompletedAt ?? null})
      returning email, display_name, password_hash, password_salt, created_at, onboarding_required, onboarding_completed_at` as AccountRow[];
    return accountFromRow(rows[0]);
  } catch (error) {
    if ((error as { code?: string }).code === "23505") throw new Error("ACCOUNT_EXISTS");
    throw error;
  }
}

export async function updateStoredAccount(email: string, update: Partial<StoredAccount>) {
  const current = await findStoredAccount(email);
  if (!current) throw new Error("ACCOUNT_NOT_FOUND");
  const account = { ...current, ...update };
  const database = sql();
  if (!database) return mutateLocalData((data) => {
    const index = data.accounts.findIndex((candidate) => candidate.email === email);
    if (index < 0) throw new Error("ACCOUNT_NOT_FOUND");
    data.accounts[index] = account;
    return account;
  });
  const rows = await database`
    update career_pivot_accounts set display_name = ${account.displayName}, password_hash = ${account.passwordHash}, password_salt = ${account.passwordSalt}, onboarding_required = ${account.onboardingRequired}, onboarding_completed_at = ${account.onboardingCompletedAt ?? null}
    where email = ${email}
    returning email, display_name, password_hash, password_salt, created_at, onboarding_required, onboarding_completed_at` as AccountRow[];
  if (!rows[0]) throw new Error("ACCOUNT_NOT_FOUND");
  return accountFromRow(rows[0]);
}

export async function removeStoredAccount(email: string) {
  const database = sql();
  if (!database) return mutateLocalData((data) => {
    data.accounts = data.accounts.filter((account) => account.email !== email);
    data.posts = data.posts.filter((post) => post.authorEmail !== email);
  });
  await database`delete from career_pivot_accounts where email = ${email}`;
}

export async function listStoredPosts(authorEmail: string) {
  const database = sql();
  if (!database) return (await readLocalData()).posts.filter((post) => post.authorEmail === authorEmail).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const rows = await database`select payload from career_pivot_posts where author_email = ${authorEmail} order by updated_at desc` as PostRow[];
  return rows.map((row) => row.payload);
}

export async function findStoredPost(id: string, authorEmail: string) {
  const database = sql();
  if (!database) return (await readLocalData()).posts.find((post) => post.id === id && post.authorEmail === authorEmail);
  const rows = await database`select payload from career_pivot_posts where id = ${id} and author_email = ${authorEmail}` as PostRow[];
  return rows[0]?.payload;
}

export async function upsertStoredPost(post: StoredPost) {
  const database = sql();
  if (!database) return mutateLocalData((data) => {
    const index = data.posts.findIndex((candidate) => candidate.id === post.id && candidate.authorEmail === post.authorEmail);
    if (index < 0) data.posts.push(post); else data.posts[index] = post;
    return post;
  });
  const payload = JSON.stringify(post);
  const rows = await database`
    insert into career_pivot_posts (id, author_email, updated_at, payload) values (${post.id}, ${post.authorEmail}, ${post.updatedAt}, ${payload}::jsonb)
    on conflict (id) do update set author_email = excluded.author_email, updated_at = excluded.updated_at, payload = excluded.payload
    where career_pivot_posts.author_email = excluded.author_email returning payload` as PostRow[];
  if (!rows[0]) throw new Error("POST_NOT_FOUND");
  return rows[0].payload;
}

export async function removeStoredPost(id: string, authorEmail: string) {
  const database = sql();
  if (!database) return mutateLocalData((data) => {
    const index = data.posts.findIndex((post) => post.id === id && post.authorEmail === authorEmail);
    if (index < 0) return false;
    data.posts.splice(index, 1);
    return true;
  });
  const rows = await database`delete from career_pivot_posts where id = ${id} and author_email = ${authorEmail} returning id` as Array<{ id: string }>;
  return rows.length > 0;
}
