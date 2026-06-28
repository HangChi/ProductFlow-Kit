"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, LogIn } from "lucide-react";
import { I18nText, LanguageProvider, LanguageToggle } from "@/components/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  apiGet,
  apiPost,
  clearAuthSession,
  getAuthToken,
  saveAuthSession,
  type ApiEnvelope,
  type AuthSession,
  type AuthUser,
} from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      return;
    }

    apiGet<ApiEnvelope<AuthUser>>("/api/auth/me", { token })
      .then((payload) => {
        saveAuthSession({ token, user: payload.data });
        router.replace("/");
      })
      .catch(() => clearAuthSession());
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = await apiPost<ApiEnvelope<AuthSession>>(
        "/api/auth/login",
        { email, password },
        { skipAuth: true },
      );
      saveAuthSession(payload.data);
      router.replace("/");
      router.refresh();
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LanguageProvider>
      <main className="min-h-screen bg-surface px-4 py-6">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-md flex-col justify-center">
          <div className="mb-4 flex items-center justify-between gap-3">
            <Link
              href="/"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:shadow-focus"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <I18nText value={{ en: "Workspace", zh: "\u5de5\u4f5c\u533a" }} />
            </Link>
            <LanguageToggle />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-accent">ProductFlow</p>
                  <CardTitle className="mt-1 text-xl">
                    <I18nText value={{ en: "Sign in to Saas Admin Jpa", zh: "\u767b\u5f55 Saas Admin Jpa" }} />
                  </CardTitle>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accentSoft text-accent">
                  <LogIn size={20} aria-hidden="true" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-5 py-5">
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <Input
                  label={{ en: "Email", zh: "\u90ae\u7bb1" }}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
                <Input
                  label={{ en: "Password", zh: "\u5bc6\u7801" }}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />
                {error ? (
                  <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-danger">
                    {error}
                  </p>
                ) : null}
                <Button type="submit" className="w-full" disabled={loading}>
                  <LogIn size={16} aria-hidden="true" />
                  <I18nText
                    value={
                      loading
                        ? { en: "Signing in...", zh: "\u6b63\u5728\u767b\u5f55..." }
                        : { en: "Sign in", zh: "\u767b\u5f55" }
                    }
                  />
                </Button>
              </form>
              <p className="mt-4 text-center text-xs text-muted">admin@example.com / password</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </LanguageProvider>
  );
}
