"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthSession = {
  version: 2;
  email: string;
  displayName: string;
  signedInAt: string;
  onboardingRequired?: boolean;
  onboardingReturnVisit?: boolean;
};

type StoredAccount = {
  email: string;
  displayName: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  onboardingRequired?: boolean;
  onboardingCompletedAt?: string;
};

type LoginInput = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type CreateAccountInput = LoginInput & {
  displayName: string;
  confirmPassword: string;
};

type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

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
const AUTH_STORAGE_KEY = "osai.auth.session.v1";
const ACCOUNTS_STORAGE_KEY = "osai.auth.accounts.v1";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_HASH_ITERATIONS = 150_000;

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return window.btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = window.atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function derivePasswordHash(password: string, salt: Uint8Array) {
  const saltBuffer = Uint8Array.from(salt).buffer;
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
      salt: saltBuffer,
      iterations: PASSWORD_HASH_ITERATIONS,
    },
    passwordKey,
    256,
  );

  return bytesToBase64(new Uint8Array(derivedBits));
}

function readAccounts(): StoredAccount[] {
  const storedValue = window.localStorage.getItem(ACCOUNTS_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    const accounts = JSON.parse(storedValue) as StoredAccount[];
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: StoredAccount[]) {
  window.localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function removeOSaiStorage(storage: Storage) {
  const keysToRemove: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);

    if (key?.startsWith("osai.")) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => storage.removeItem(key));
}

function readStoredSession(): AuthSession | null {
  const storedValue =
    window.localStorage.getItem(AUTH_STORAGE_KEY) ??
    window.sessionStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    const session = JSON.parse(storedValue) as Partial<AuthSession>;

    if (
      session.version !== 2 ||
      typeof session.email !== "string" ||
      typeof session.displayName !== "string" ||
      typeof session.signedInAt !== "string"
    ) {
      return null;
    }

    return session as AuthSession;
  } catch {
    return null;
  }
}

function getDisplayName(email: string) {
  return email
    .split("@")[0]
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function saveSession(session: AuthSession, rememberMe: boolean) {
  const serializedSession = JSON.stringify(session);

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY);

  if (rememberMe) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, serializedSession);
  } else {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, serializedSession);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      setSession(readStoredSession());
      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydration);
  }, []);

  const login = useCallback(
    async ({ email, password, rememberMe }: LoginInput): Promise<LoginResult> => {
      const normalizedEmail = email.trim().toLowerCase();

      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        return { ok: false, error: "Enter a valid email address." };
      }

      if (password.length < 6) {
        return {
          ok: false,
          error: "Your password must contain at least 6 characters.",
        };
      }

      const account = readAccounts().find(
        (candidate) => candidate.email === normalizedEmail,
      );

      if (!account) {
        return {
          ok: false,
          error: "No account was found for this email. Create an account first.",
        };
      }

      const passwordHash = await derivePasswordHash(
        password,
        base64ToBytes(account.passwordSalt),
      );

      if (passwordHash !== account.passwordHash) {
        return { ok: false, error: "Incorrect password. Try again." };
      }

      const nextSession: AuthSession = {
        version: 2,
        email: normalizedEmail,
        displayName:
          account.displayName || getDisplayName(normalizedEmail) || "OSai User",
        signedInAt: new Date().toISOString(),
        onboardingRequired: account.onboardingRequired === true,
      };
      saveSession(nextSession, rememberMe);
      setSession(nextSession);
      return { ok: true };
    },
    [],
  );

  const createAccount = useCallback(
    async ({
      displayName,
      email,
      password,
      confirmPassword,
      rememberMe,
    }: CreateAccountInput): Promise<LoginResult> => {
      const normalizedName = displayName.trim().replace(/\s+/g, " ");
      const normalizedEmail = email.trim().toLowerCase();

      if (normalizedName.length < 2) {
        return { ok: false, error: "Enter your full name." };
      }

      if (!EMAIL_PATTERN.test(normalizedEmail)) {
        return { ok: false, error: "Enter a valid email address." };
      }

      if (password.length < 6) {
        return {
          ok: false,
          error: "Your password must contain at least 6 characters.",
        };
      }

      if (password !== confirmPassword) {
        return { ok: false, error: "Your passwords do not match." };
      }

      const accounts = readAccounts();

      if (accounts.some((account) => account.email === normalizedEmail)) {
        return {
          ok: false,
          error: "An account already exists for this email. Log in instead.",
        };
      }

      const passwordSalt = window.crypto.getRandomValues(new Uint8Array(16));
      const passwordHash = await derivePasswordHash(password, passwordSalt);

      saveAccounts([
        ...accounts,
        {
          email: normalizedEmail,
          displayName: normalizedName,
          passwordHash,
          passwordSalt: bytesToBase64(passwordSalt),
          createdAt: new Date().toISOString(),
          onboardingRequired: true,
        },
      ]);

      const nextSession: AuthSession = {
        version: 2,
        email: normalizedEmail,
        displayName: normalizedName,
        signedInAt: new Date().toISOString(),
        onboardingRequired: true,
      };

      saveSession(nextSession, rememberMe);
      setSession(nextSession);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setSession(null);
  }, []);

  const completeOnboarding = useCallback(() => {
    if (!session) {
      return;
    }

    const completedAt = new Date().toISOString();
    const accounts = readAccounts().map((account) =>
      account.email === session.email
        ? {
            ...account,
            onboardingRequired: false,
            onboardingCompletedAt: completedAt,
          }
        : account,
    );
    const nextSession: AuthSession = {
      ...session,
      onboardingRequired: false,
      onboardingReturnVisit: false,
    };

    saveAccounts(accounts);
    const rememberMe = window.localStorage.getItem(AUTH_STORAGE_KEY) !== null;
    saveSession(nextSession, rememberMe);
    setSession(nextSession);
  }, [session]);

  const reopenOnboarding = useCallback(() => {
    if (!session) {
      return;
    }

    const nextSession: AuthSession = {
      ...session,
      onboardingRequired: true,
      onboardingReturnVisit: true,
    };
    const rememberMe = window.localStorage.getItem(AUTH_STORAGE_KEY) !== null;

    saveSession(nextSession, rememberMe);
    setSession(nextSession);
  }, [session]);

  const deleteAccount = useCallback(() => {
    const remainingAccounts = session
      ? readAccounts().filter((account) => account.email !== session.email)
      : readAccounts();

    removeOSaiStorage(window.localStorage);
    removeOSaiStorage(window.sessionStorage);

    if (remainingAccounts.length > 0) {
      saveAccounts(remainingAccounts);
    }

    setSession(null);
  }, [session]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: session?.version === 2,
      isHydrated,
      requiresOnboarding: session?.onboardingRequired === true,
      session,
      login,
      createAccount,
      logout,
      completeOnboarding,
      reopenOnboarding,
      deleteAccount,
    }),
    [
      completeOnboarding,
      createAccount,
      deleteAccount,
      isHydrated,
      login,
      logout,
      reopenOnboarding,
      session,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
