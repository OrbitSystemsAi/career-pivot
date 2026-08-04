import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

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
  distribution: {
    audience: "public" | "network" | "groups";
    channels: Array<"onn" | "career-pivot">;
  };
  status: "draft" | "submitting" | "submitted" | "failed";
  submissionAttempts: number;
  lastError?: string;
  onnSubmissionId?: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
};

type CareerPivotData = {
  accounts: StoredAccount[];
  posts: StoredPost[];
};

const emptyData: CareerPivotData = { accounts: [], posts: [] };
const dataFile = path.join(
  process.cwd(),
  ".data",
  process.env.CAREER_PIVOT_DATA_FILE ?? "career-pivot.json",
);
let writeQueue = Promise.resolve();

async function readData(): Promise<CareerPivotData> {
  try {
    const value = JSON.parse(await readFile(dataFile, "utf8")) as Partial<CareerPivotData>;
    return {
      accounts: Array.isArray(value.accounts) ? value.accounts : [],
      posts: Array.isArray(value.posts) ? value.posts : [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyData;
    throw error;
  }
}

async function persistData(data: CareerPivotData) {
  await mkdir(path.dirname(dataFile), { recursive: true });
  const temporaryFile = `${dataFile}.${process.pid}.tmp`;
  await writeFile(temporaryFile, JSON.stringify(data, null, 2), "utf8");
  await rename(temporaryFile, dataFile);
}

export async function queryData<T>(query: (data: CareerPivotData) => T | Promise<T>) {
  await writeQueue;
  return query(await readData());
}

export async function mutateData<T>(mutation: (data: CareerPivotData) => T | Promise<T>) {
  let result!: T;
  const operation = writeQueue.then(async () => {
    const data = await readData();
    result = await mutation(data);
    await persistData(data);
  });
  writeQueue = operation.catch(() => undefined);
  await operation;
  return result;
}
