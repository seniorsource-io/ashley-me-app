"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signUp.email({
      name,
      email,
      password,
    });

    if (error) {
      if (
        error.message?.toLowerCase().includes("domain") ||
        error.message?.toLowerCase().includes("rejected") ||
        error.status === 403
      ) {
        setError("Only @seniorsource.io email addresses can sign up.");
      } else {
        setError(error.message ?? "Sign up failed. Please try again.");
      }
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <div className="w-full max-w-[400px]">
      <div className="bg-white rounded-2xl border border-[hsl(var(--border))] shadow-card p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-heading text-lg font-medium tracking-tight text-foreground"
          >
            Senior One Source
          </Link>
          <h1 className="font-heading text-2xl font-semibold text-foreground mt-4">
            Create your account
          </h1>
          <p className="text-sm text-[hsl(var(--muted))] mt-1">
            Get started with Senior One Source
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-medium text-foreground mb-1.5"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-[hsl(var(--dot))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-foreground mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@seniorsource.io"
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-[hsl(var(--dot))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-foreground mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full rounded-lg border border-[hsl(var(--border))] bg-white px-3.5 py-2.5 text-sm text-foreground placeholder:text-[hsl(var(--dot))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-shadow"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-[hsl(var(--background))] text-sm font-semibold py-2.5 rounded-lg hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-[hsl(var(--muted))]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
