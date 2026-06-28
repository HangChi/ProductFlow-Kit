import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white shadow-sm hover:bg-blue-700",
  secondary: "border border-border bg-white text-ink shadow-sm hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-slate-700 hover:bg-surfaceStrong hover:text-ink",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-60 " +
        variantClasses[variant] +
        " " +
        className
      }
      {...props}
    />
  );
}
