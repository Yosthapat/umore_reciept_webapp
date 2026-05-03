import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function FieldError({ message }) {
  if (!message) return null;
  return <p className="text-xs text-red-500">{message}</p>;
}

export function ExpenseItemFields({
  item,
  index,
  title,
  errors,
  canRemove,
  onChange,
  onAmountBlur,
  onRemove,
}) {
  return (
    <div className="min-w-0 rounded-3xl border border-[color-mix(in_oklab,var(--umore-border)_72%,white)] bg-[color-mix(in_oklab,var(--umore-paper)_96%,white)] p-4 shadow-[0_1px_6px_rgba(36,50,56,0.05)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--umore-muted)]">
          {title || `รายการที่ ${index + 1}`}
        </p>
        {canRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove()}
            className="h-7 w-7 rounded-xl text-[var(--umore-muted)] hover:text-red-500"
            aria-label={`ลบรายการที่ ${index + 1}`}
          >
            ✕
          </Button>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>วัน/เดือน/ปี</Label>
            <Input
              type="date"
              value={item.date}
              onChange={(e) => onChange("date", e.target.value)}
              className="h-11 rounded-2xl"
            />
            <FieldError message={errors.date} />
          </div>

          <div className="space-y-1.5">
            <Label>จำนวนเงิน</Label>
            <Input
              inputMode="decimal"
              value={item.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              onBlur={onAmountBlur}
              placeholder="0.00"
              className="h-11 rounded-2xl"
            />
            <FieldError message={errors.amount} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>รายละเอียดรายการ</Label>
          <Textarea
            value={item.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="กรุณาใส่รายการ"
            className="min-h-[80px] rounded-2xl"
          />
          <FieldError message={errors.description} />
        </div>

        <div className="space-y-1.5">
          <Label>หมายเหตุ</Label>
          <Input
            value={item.note}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder="ถ้ามี (ไม่บังคับ)"
            className="h-11 rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
