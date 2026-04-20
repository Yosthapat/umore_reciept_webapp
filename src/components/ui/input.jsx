import React from "react";

export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={[
        "w-full border border-[var(--umore-border)] bg-[color-mix(in_oklab,var(--umore-paper)_92%,white)] px-3 py-2 text-sm text-[var(--umore-ink)] outline-none transition-colors",
        "placeholder:text-[var(--umore-muted)] focus:border-[var(--umore-blue)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--umore-blue-soft)_70%,white)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
});
