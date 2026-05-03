import React from "react";
import { CalendarDays } from "lucide-react";

const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

function formatThaiShort(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split("-").map(Number);
  return `${day} ${THAI_MONTHS[month - 1]} ${year + 543}`;
}

// Renders a styled display div; the native date input sits invisibly on top
// so iOS still opens the native date picker on tap — we get full size control.
export function DateInput({ value, onChange, className = "" }) {
  const display = formatThaiShort(value);

  return (
    <div
      className={[
        "relative h-9 overflow-hidden rounded-2xl border border-[var(--umore-border)]",
        "bg-[color-mix(in_oklab,var(--umore-paper)_92%,white)]",
        className,
      ].join(" ")}
    >
      {/* Visible display — pointer-events:none so taps fall through to the input */}
      <div className="pointer-events-none flex h-full items-center gap-2 px-3">
        <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[var(--umore-muted)]" />
        <span className={`text-sm ${display ? "text-[var(--umore-ink)]" : "text-[var(--umore-muted)]"}`}>
          {display ?? "เลือกวันที่"}
        </span>
      </div>

      {/* Native input: invisible overlay — still receives taps and opens date picker */}
      <input
        type="date"
        value={value}
        onChange={onChange}
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0,
          width: "100%",
          height: "100%",
          cursor: "pointer",
          fontSize: "16px", // prevents iOS auto-zoom on focus
        }}
      />
    </div>
  );
}
