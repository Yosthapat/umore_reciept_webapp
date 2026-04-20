import React from "react";

export const Card = React.forwardRef(function Card({ className = "", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={["bg-[var(--umore-paper)] ring-1 ring-[color-mix(in_oklab,var(--umore-border)_75%,white)]", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export const CardHeader = React.forwardRef(function CardHeader({ className = "", ...props }, ref) {
  return <div ref={ref} className={["flex flex-col space-y-1.5 p-6", className].filter(Boolean).join(" ")} {...props} />;
});

export const CardTitle = React.forwardRef(function CardTitle({ className = "", ...props }, ref) {
  return <h3 ref={ref} className={["font-semibold leading-none tracking-tight", className].filter(Boolean).join(" ")} {...props} />;
});

export const CardContent = React.forwardRef(function CardContent({ className = "", ...props }, ref) {
  return <div ref={ref} className={["p-6 pt-0", className].filter(Boolean).join(" ")} {...props} />;
});
