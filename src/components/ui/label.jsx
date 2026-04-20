import React from "react";

export const Label = React.forwardRef(function Label({ className = "", ...props }, ref) {
  return <label ref={ref} className={["text-sm font-medium text-[var(--umore-ink)]", className].filter(Boolean).join(" ")} {...props} />;
});
