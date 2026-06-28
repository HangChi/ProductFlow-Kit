import type { HTMLAttributes } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "info" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-border bg-surfaceStrong text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  info: "border-blue-200 bg-blue-50 text-blue-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
};

export function Badge({ children, className = "", tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={"inline-flex min-h-6 items-center rounded-md border px-2 py-0.5 text-xs font-medium " + toneClasses[tone] + " " + className}
      {...props}
    >
      {children}
    </span>
  );
}
