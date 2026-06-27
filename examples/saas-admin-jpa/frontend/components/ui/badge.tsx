export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-md border border-border bg-surface px-2 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}
