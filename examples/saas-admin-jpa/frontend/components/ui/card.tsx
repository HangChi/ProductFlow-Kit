import type { HTMLAttributes } from "react";

type DivProps = HTMLAttributes<HTMLDivElement>;
type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

export function Card({ children, className = "", ...props }: DivProps) {
  return (
    <div className={"rounded-md border border-border bg-panel shadow-soft " + className} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: DivProps) {
  return (
    <div className={"border-b border-border px-5 py-4 " + className} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "", ...props }: HeadingProps) {
  return (
    <h3 className={"text-base font-semibold text-ink " + className} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "px-5 py-4", ...props }: DivProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
