"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Activity,
  Bot,
  Database,
  FileText,
  Home,
  Mail,
  Settings,
  Shield,
  LogOut,
  Users,
} from "lucide-react";
import { I18nText, LanguageProvider, LanguageToggle } from "@/components/i18n";
import { getCurrentUser, getStoredUser, getToken, logout, type AuthenticatedUser } from "@/lib/api";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/roles', label: 'Roles', icon: Shield },
  { href: '/audit', label: 'Audit Logs', icon: Activity },
  { href: '/prototype', label: 'Prototype', icon: Database },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthenticatedUser | null>(() => getStoredUser());
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      const token = getToken();
      if (!token) {
        router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (!cancelled) {
          setUser(currentUser);
          setSessionError("");
        }
      } catch (caught) {
        if (!cancelled) {
          setSessionError(caught instanceof Error ? caught.message : "Authentication failed");
          router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false);
        }
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  const linkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium transition " +
      (active
        ? "bg-accent text-white shadow-sm"
        : "text-slate-700 hover:bg-surfaceStrong hover:text-ink")
    );
  };

  const mobileLinkClass = (href: string) => {
    const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return (
      "inline-flex h-9 shrink-0 items-center gap-2 rounded-md border px-3 text-sm font-medium transition " +
      (active
        ? "border-accent bg-accent text-white"
        : "border-border bg-white text-slate-700 hover:border-accent hover:text-accent")
    );
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-surface">
        <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-panel/95 px-4 py-5 shadow-sm backdrop-blur lg:block">
          <div className="flex h-full flex-col">
            <div className="mb-7 rounded-md border border-border bg-surface px-3 py-3">
              <p className="text-xs font-semibold uppercase text-accent">ProductFlow</p>
              <h1 className="mt-1 truncate text-lg font-semibold text-ink">My Saas</h1>
              <p className="mt-1 truncate text-xs text-muted">SaaS Admin</p>
            </div>
            <nav className="grid gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={linkClass(item.href)}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span className="truncate"><I18nText value={item.label} /></span>
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto rounded-md border border-border bg-surface px-3 py-3 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
                <span className="font-medium"><I18nText value={{ en: "Signed in", zh: "已登录" }} /></span>
              </div>
              <p className="mt-1 truncate text-xs text-muted">{user?.email ?? "Checking session..."}</p>
            </div>
          </div>
        </aside>

        <main className="lg:pl-72">
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            <header className="sticky top-0 z-20 -mx-4 mb-5 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:mb-6 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted">SaaS Admin</p>
                    <h2 className="truncate text-2xl font-semibold text-ink"><I18nText value={{ en: "Workspace", zh: "工作区" }} /></h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <LanguageToggle />
                    <div className="hidden rounded-md border border-border bg-white px-3 py-2 text-sm text-slate-700 shadow-sm sm:block">
                      {user?.name ?? <I18nText value={{ en: "Checking session", zh: "正在检查会话" }} />}
                    </div>
                    <Button type="button" variant="secondary" onClick={handleLogout}>
                      <LogOut size={16} aria-hidden="true" />
                      <I18nText value={{ en: "Logout", zh: "退出" }} />
                    </Button>
                  </div>
                </div>
                <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden" aria-label="Primary">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={mobileLinkClass(item.href)}
                      >
                        <Icon size={16} aria-hidden="true" />
                        <span><I18nText value={item.label} /></span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </header>
            {checkingSession ? (
              <div className="rounded-md border border-border bg-white px-4 py-3 text-sm text-muted shadow-sm">
                <I18nText value={{ en: "Checking session...", zh: "正在检查会话..." }} />
              </div>
            ) : sessionError ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {sessionError}
              </div>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}
