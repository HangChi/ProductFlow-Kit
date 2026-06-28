"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getToken, login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace(getNextPath());
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      router.replace(getNextPath());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-accent text-white">
              <LockKeyhole size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-medium text-muted">ProductFlow</p>
              <CardTitle>Sign in to My Saas</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <Input
              label={{ en: "Email", zh: "邮箱" }}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              label={{ en: "Password", zh: "密码" }}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error ? (
              <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </p>
            ) : null}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-sm text-muted">
              Default account: admin@example.com / password
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

function getNextPath() {
  if (typeof window === "undefined") {
    return "/";
  }

  return new URLSearchParams(window.location.search).get("next") || "/";
}
