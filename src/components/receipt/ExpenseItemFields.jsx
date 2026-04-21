import React from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function renderError(errorMessage) {
  if (!errorMessage) {
    return null;
  }

  return <p className="text-xs text-red-600">{errorMessage}</p>;
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
    <div className="min-w-0 rounded-3xl border border-neutral-200 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-neutral-700">{title || `รายการที่ ${index + 1}`}</div>
        {canRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove()}
            className="rounded-2xl"
            aria-label={`ลบรายการที่ ${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      <div className="grid min-w-0 gap-3">
        <div className="space-y-2">
          <Label>วัน/เดือน/ปี</Label>
          <Input
            type="date"
            value={item.date}
            onChange={(event) => onChange("date", event.target.value)}
            className="h-11 rounded-2xl"
          />
          {renderError(errors.date)}
        </div>

        <div className="space-y-2">
          <Label>รายละเอียดรายการ</Label>
          <Textarea
            value={item.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="กรุณาใส่รายการ"
            className="min-h-[90px] rounded-2xl"
          />
          {renderError(errors.description)}
        </div>

        <div className="space-y-2">
          <Label>จำนวนเงิน</Label>
          <Input
            inputMode="decimal"
            value={item.amount}
            onChange={(event) => onChange("amount", event.target.value)}
            onBlur={onAmountBlur}
            placeholder="กรุณาใส่จำนวนเงิน"
            className="h-11 rounded-2xl"
          />
          {renderError(errors.amount)}
        </div>

        <div className="space-y-2">
          <Label>หมายเหตุ</Label>
          <Input
            value={item.note}
            onChange={(event) => onChange("note", event.target.value)}
            placeholder="ถ้ามี"
            className="h-11 rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
