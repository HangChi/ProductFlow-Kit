import type { InputHTMLAttributes } from "react";
import { I18nText, type LocalizedText } from "@/components/i18n";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: LocalizedText;
  containerClassName?: string;
};

export function Input({ label, className = "", containerClassName = "", ...props }: InputProps) {
  return (
    <label className={"grid gap-2 text-sm font-medium text-slate-700 " + containerClassName}>
      <I18nText value={label} />
      <input
        className={
          "h-10 rounded-md border border-border bg-white px-3 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-accent focus:shadow-focus " +
          className
        }
        {...props}
      />
    </label>
  );
}
