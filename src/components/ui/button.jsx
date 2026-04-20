import React from "react";

function getButtonClasses({ variant, size, className }) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50";
  const variantClasses = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800",
    ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
  };
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
  };

  return [baseClasses, variantClasses[variant] || variantClasses.default, sizeClasses[size] || sizeClasses.default, className]
    .filter(Boolean)
    .join(" ");
}

export const Button = React.forwardRef(function Button(
  { className = "", variant = "default", size = "default", type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={getButtonClasses({ variant, size, className })} {...props} />;
});
