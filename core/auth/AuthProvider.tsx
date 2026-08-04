"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthSession = {
  version: 3;
  email: string;
  displayName: string;
  signedInAt: string;
  onboardingRequired?: boolean;
  onboardingReturnVisit?: boolean;
  expiresAt: number;
};

type LegacyStoredAccount = {
  email: string;
  displayName: string;
  passwordHash: string;
  passwordSalt: string;
};

type LoginInput = { email: string; password: string; rememberMe: boolean };
type CreateAccountInput = LoginInput & { displayName: string; confirmPassword: string };
type LoginResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  isAuthenticated: boolean;
  isHydrated: boolean;
  requiresOnboarding: boolean;
  session: AuthSession | null;
  login: (input: LoginInput) => Promise<LoginResult>;
  createAccount: (input: CreateAccountInput) => Promise<LoginResult>;
  logout: () => void;
  completeOnboarding: () => void;
  reopenOnboarding: () => void;
  deleteAccount: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LEGACY_ACCOUNTS_STORAGE_KEY = "osai.auth.accounts.v1";
const LEGACY_PASSWORD_HASH_ITERATIONS = 150_000;

function base64ToBytes(value: string) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

async function deriveLegacyPasswordHash(password: string, salt: Uint8Array) {
  const passwordKey = await window.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: Uint8Array.from(salt).buffer,
      iterations: LEGACY_PASSWORD_HASH_ITERATIONS,
    },
    passwordKey,
    256,
  );
  return bytesToBase64(new Uint8Array(derivedBits));
}

function readLegacyAccounts() {
  try {
    const accounts = JSON.parse(window.localStorage.getItem(LEGACY_ACCOUNTS_STORAGE_KEY) ?? "[]") as LegacyStoredAccount[];
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

async function verifyLegacyAccount(email: string, password: string) {
  const account = readLegacyAccounts().find((candidate) => candidate.email === email);
  if (!account) return null;
  const passwordHash = await deriveLegacyPasswordHash(password, base64ToBytes(account.passwordSalt));
  return passwordHash === account.passwordHash ? account : null;
}

function removeLegacyAccount(email: string) {
  const remainingAccounts = readLegacyAccounts().filter((account) => account.email !== email);
  if (remainingAccounts.length === 0) {
    window.localStorage.removeItem(LEGACY_ACCOUNTS_STORAGE_KEY);
  } else {
    window.localStorage.setItem(LEGACY_ACCOUNTS_STORAGE_KEY, JSON.stringify(remainingAccounts));
  }
}

function removeOSaiStorage(storage: Storage) {
  const keysToRemove: string[] = [];
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (key?.startsWith("osai.")) keysToRemove.push(key);
  }
  keysToRemove.forEach((key) => storage.removeItem(key));
}

async function readResponse(response: Response) {
  return response.json().catch(() => ({})) as Promise<{ session?: AuthSession; error?: string }>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then(readResponse)
      .then((result) => {
        if (active) setSession(result.session ?? null);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setIsHydrated(true);
      });
    return () => { active = false; };
  }, []);

  const authenticate = useCallback(async (body: Record<string, unknown>): Promise<LoginResult> => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await readResponse(response);
      if (!response.ok || !result.session) return { ok: false, error: result.error ?? "Authentication failed." };
      setSession(result.session);
      return { ok: true };
    } catch {
      return { ok: false, error: "The server could not be reached. Try again." };
    }
  }, []);

  const login = useCallback(async ({ email, password }: LoginInput): Promise<LoginResult> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_PATTERN.test(normalizedEmail)) return { ok: false, error: "Enter a valid email address." };
    if (password.length < 6) return { ok: false, error: "Your password must contain at least 6 characters." };
    const loginResult = await authenticate({ mode: "login", email: normalizedEmail, password });
    if (loginResult.ok) return loginResult;

    const legacyAccount = await verifyLegacyAccount(normalizedEmail, password);
    if (!legacyAccount) return loginResult;

    const migrationResult = await authenticate({
      mode: "register",
      displayName: legacyAccount.displayName,
      email: normalizedEmail,
      password,
    });
    if (migrationResult.ok) removeLegacyAccount(normalizedEmail);
    return migrationResult;
  }, [authenticate]);

  const createAccount = useCallback(async ({ displayName, email, password, confirmPassword }: CreateAccountInput): Promise<LoginResult> => {
    const normalizedName = displayName.trim().replace(/\s+/g, " ");
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedName.length < 2) return { ok: false, error: "Enter your full name." };
    if (!EMAIL_PATTERN.test(normalizedEmail)) return { ok: false, error: "Enter a valid email address." };
    if (password.length < 6) return { ok: false, error: "Your password must contain at least 6 characters." };
    if (password !== confirmPassword) return { ok: false, error: "Your passwords do not match." };
    return authenticate({ mode: "register", displayName: normalizedName, email: normalizedEmail, password });
  }, [authenticate]);

  const logout = useCallback(() => {
    void fetch("/api/auth/session", { method: "DELETE" });
    setSession(null);
  }, []);

  const setOnboarding = useCallback((onboardingRequired: boolean, onboardingReturnVisit = false) => {
    if (!session) return;
    const optimistic = { ...session, onboardingRequired, onboardingReturnVisit };
    setSession(optimistic);
    void fetch("/api/auth/session", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onboardingRequired, onboardingReturnVisit }),
    }).then(readResponse).then((result) => {
      if (result.session) setSession(result.session);
    });
  }, [session]);

  const completeOnboarding = useCallback(() => setOnboarding(false), [setOnboarding]);
  const reopenOnboarding = useCallback(() => setOnboarding(true, true), [setOnboarding]);

  const deleteAccount = useCallback(() => {
    void fetch("/api/auth/session?account=true", { method: "DELETE" });
    removeOSaiStorage(window.localStorage);
    removeOSaiStorage(window.sessionStorage);
    setSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: session?.version === 3,
    isHydrated,
    requiresOnboarding: session?.onboardingRequired === true,
    session,
    login,
    createAccount,
    logout,
    completeOnboarding,
    reopenOnboarding,
    deleteAccount,
  }), [completeOnboarding, createAccount, deleteAccount, isHydrated, login, logout, reopenOnboarding, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
