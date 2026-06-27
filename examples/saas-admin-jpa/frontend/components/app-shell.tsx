import Link from "next/link";
import {
  Activity,
  Bot,
  Database,
  FileText,
  Home,
  Mail,
  Settings,
  Shield,
  Users,
} from "lucide-react";

const navigation = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/roles', label: 'Roles', icon: Shield },
  { href: '/audit', label: 'Audit Logs', icon: Activity },
  { href: '/prototype', label: 'Prototype', icon: Database },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-border bg-white/90 px-4 py-5 backdrop-blur lg:block">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">ProductFlow</p>
          <h1 className="mt-1 text-xl font-semibold text-ink">Saas Admin Jpa</h1>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-700 hover:bg-surface hover:text-ink"
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
          <header className="mb-6 flex items-center justify-between border-b border-border pb-4">
            <div>
              <p className="text-sm font-medium text-muted">SaaS Admin</p>
              <h2 className="text-2xl font-semibold text-ink">Workspace</h2>
            </div>
            <div className="rounded-md border border-border bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
              Local demo
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
