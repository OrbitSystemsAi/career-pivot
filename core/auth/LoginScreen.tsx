"use client";

import { FormEvent, useState } from "react";

import { useAuth } from "./AuthProvider";

type LoginScreenProps = {
  initialMode?: "login" | "create";
  onBack?: () => void;
};

type PasswordVisibilityButtonProps = {
  isVisible: boolean;
  label: string;
  onToggle: () => void;
};

function PasswordVisibilityButton({
  isVisible,
  label,
  onToggle,
}: PasswordVisibilityButtonProps) {
  return (
    <button
      aria-label={`${isVisible ? "Hide" : "Show"} ${label}`}
      aria-pressed={isVisible}
      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-xl text-[#50677a] transition hover:text-[#116a7e] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1689a3]"
      onClick={onToggle}
      type="button"
    >
      {isVisible ? (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.9 10.9 0 0 1 12 4c5.1 0 8.7 4.3 9.7 5.7.4.5.4 1.1 0 1.6a16.5 16.5 0 0 1-3.1 3.3M6.6 6.6a16.3 16.3 0 0 0-4.3 3.1c-.4.5-.4 1.1 0 1.6C3.3 12.7 6.9 17 12 17c.8 0 1.6-.1 2.3-.3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M2.3 9.7C3.3 8.3 6.9 4 12 4s8.7 4.3 9.7 5.7c.4.5.4 1.1 0 1.6C20.7 12.7 17.1 17 12 17S3.3 12.7 2.3 11.3a1.3 1.3 0 0 1 0-1.6Z"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="10.5"
            r="2.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      )}
    </button>
  );
}

export default function LoginScreen({
  initialMode = "login",
  onBack,
}: LoginScreenProps) {
  const { createAccount, login } = useAuth();
  const [mode, setMode] = useState<"login" | "create">(initialMode);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result =
      mode === "login"
        ? await login({ email, password, rememberMe })
        : await createAccount({
            displayName,
            email,
            password,
            confirmPassword,
            rememberMe,
          });

    if (!result.ok) {
      setError(result.error);
      setIsSubmitting(false);
    }
  }

  function switchMode(nextMode: "login" | "create") {
    setMode(nextMode);
    setPassword("");
    setConfirmPassword("");
    setIsPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
    setError("");
    setIsSubmitting(false);
  }

  return (
    <div
      aria-label={
        mode === "login"
          ? "Log in to Career Pivot"
          : "Create a Career Pivot account"
      }
      aria-modal="true"
      className="fixed inset-0 z-50 h-screen overflow-hidden bg-[#092b39]/70 px-5 py-6 text-[#123541] backdrop-blur-sm sm:px-8 sm:py-8"
      role="dialog"
    >
      <section className="mx-auto grid h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:h-[calc(100vh-4rem)] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-0 overflow-hidden bg-[#0c3241] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-50"
            style={{
              backgroundImage: "url('/nav-texture.png')",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
          <div className="relative">
            <p className="text-xl font-semibold">Career Pivot</p>
            <h1 className="mt-24 max-w-sm text-5xl font-semibold leading-[1.05] tracking-[-0.04em]">
              See your next chapter clearly.
            </h1>
          </div>
          <p className="relative max-w-sm text-base leading-7 text-[#c4dce1]">
            Your career direction, evidence, opportunities, and agents in one
            intelligent workspace.
          </p>
        </div>

        <div className="min-h-0 overflow-y-auto px-7 py-12 sm:px-14 lg:px-16">
          <div className="flex min-h-full flex-col justify-center">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <p className="text-lg font-semibold text-[#0c3241]">Career Pivot</p>
            {onBack ? (
              <button
                className="text-sm font-semibold text-[#116a7e] hover:text-[#ff7a00]"
                onClick={onBack}
                type="button"
              >
                Back
              </button>
            ) : null}
          </div>
          {onBack ? (
            <button
              className="mb-7 hidden w-fit items-center gap-2 text-sm font-semibold text-[#50677a] transition hover:text-[#ff7a00] lg:flex"
              onClick={onBack}
              type="button"
            >
              <span aria-hidden="true">←</span> Back to introduction
            </button>
          ) : null}
          <h2 className="text-4xl font-semibold tracking-[-0.035em] text-[#123541]">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-3 text-base text-[#64748b]">
            {mode === "login"
              ? "Sign in to continue building your career plan."
              : "Start building a career plan that is uniquely yours."}
          </p>

          <p className="mt-4 text-sm text-[#64748b]">
            {mode === "login"
              ? "New to Career Pivot? "
              : "Already have an account? "}
            <button
              className="font-semibold text-[#116a7e] underline decoration-[#ff7a00] decoration-2 underline-offset-4 transition hover:text-[#ff7a00]"
              onClick={() =>
                switchMode(mode === "login" ? "create" : "login")
              }
              type="button"
            >
              {mode === "login" ? "Create an account" : "Log in"}
            </button>
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {mode === "create" ? (
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-[#294653]"
                  htmlFor="create-name"
                >
                  Full name
                </label>
                <input
                  autoComplete="name"
                  className="h-13 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 text-base outline-none transition placeholder:text-[#94a3b8] focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                  id="create-name"
                  minLength={2}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Your name"
                  required
                  type="text"
                  value={displayName}
                />
              </div>
            ) : null}

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-[#294653]"
                htmlFor="login-email"
              >
                Email
              </label>
              <input
                autoComplete="email"
                className="h-13 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 text-base outline-none transition placeholder:text-[#94a3b8] focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                id="login-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-[#294653]"
                htmlFor="login-password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  className="h-13 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 pr-12 text-base outline-none transition placeholder:text-[#94a3b8] focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                  id="login-password"
                  minLength={6}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="6 or more characters"
                  required
                  type={isPasswordVisible ? "text" : "password"}
                  value={password}
                />
                <PasswordVisibilityButton
                  isVisible={isPasswordVisible}
                  label="password"
                  onToggle={() =>
                    setIsPasswordVisible((isVisible) => !isVisible)
                  }
                />
              </div>
            </div>

            {mode === "create" ? (
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-[#294653]"
                  htmlFor="confirm-password"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    autoComplete="new-password"
                    className="h-13 w-full rounded-xl border border-[#bfd3d8] bg-white px-4 pr-12 text-base outline-none transition placeholder:text-[#94a3b8] focus:border-[#1689a3] focus:ring-4 focus:ring-[#cdeef5]"
                    id="confirm-password"
                    minLength={6}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Repeat your password"
                    required
                    type={isConfirmPasswordVisible ? "text" : "password"}
                    value={confirmPassword}
                  />
                  <PasswordVisibilityButton
                    isVisible={isConfirmPasswordVisible}
                    label="confirmation password"
                    onToggle={() =>
                      setIsConfirmPasswordVisible((isVisible) => !isVisible)
                    }
                  />
                </div>
              </div>
            ) : null}

            <label className="flex cursor-pointer items-center gap-3 text-sm text-[#50677a]">
              <input
                checked={rememberMe}
                className="h-4 w-4 accent-[#116a7e]"
                onChange={(event) => setRememberMe(event.target.checked)}
                type="checkbox"
              />
              Keep me signed in on this device
            </label>

            {error ? (
              <p
                aria-live="polite"
                className="rounded-xl bg-[#fff2e8] px-4 py-3 text-sm text-[#a84c0b]"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <button
              className="h-13 w-full rounded-xl bg-[#123f4d] px-5 text-base font-semibold text-white transition hover:bg-[#ff7a00] focus:outline-none focus:ring-4 focus:ring-[#ffd7b2] disabled:cursor-wait disabled:opacity-65"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                  ? "Log in"
                  : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs leading-5 text-[#80909e]">
            Development access: accounts are stored on this local server.
          </p>
          </div>
        </div>
      </section>
    </div>
  );
}
