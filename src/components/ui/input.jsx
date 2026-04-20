import React from "react";

export const Input = React.forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={[
        "w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors",
        "placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
});
