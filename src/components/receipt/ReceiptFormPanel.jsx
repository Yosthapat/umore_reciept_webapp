import React from "react";
import { BadgeDollarSign, CalendarDays, Download, FileText, Plus, Trash2, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAmount, formatThaiLongDate } from "@/utils/receipt-formatters";

import { ExpenseItemFields } from "./ExpenseItemFields";

export function ReceiptFormPanel({
  people,
  ownerName,
  signName,
  signDate,
  draftItem,
  draftItemErrors,
  items,
  footerNote,
  autoFooterNote,
  isDownloadingPdf,
  onOwnerChange,
  onSignChange,
  onSignDateChange,
  onAddItem,
  onUpdateItem,
  onAmountBlur,
  onRemoveItem,
  onToggleAutoFooterNote,
  onFooterNoteChange,
  onDownloadPdf,
}) {
  return (
    <Card className="rounded-[1.75rem] border-0 shadow-sm sm:rounded-3xl">
      <CardHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          กรอกข้อมูล
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 p-4 pt-4 sm:p-6 sm:pt-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            ข้าพเจ้าชื่อ
          </Label>
          <select
            value={ownerName}
            onChange={(event) => onOwnerChange(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[var(--umore-border)] bg-[color-mix(in_oklab,var(--umore-paper)_92%,white)] px-3 text-base text-[var(--umore-ink)] outline-none transition-colors focus:border-[var(--umore-blue)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--umore-blue-soft)_70%,white)]"
          >
            <option value="" disabled>
              เลือกชื่อ
            </option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            ลงชื่อ
          </Label>
          <select
            value={signName}
            onChange={(event) => onSignChange(event.target.value)}
            className="h-12 w-full rounded-2xl border border-[var(--umore-border)] bg-[color-mix(in_oklab,var(--umore-paper)_92%,white)] px-3 text-base text-[var(--umore-ink)] outline-none transition-colors focus:border-[var(--umore-blue)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--umore-blue-soft)_70%,white)]"
          >
            <option value="" disabled>
              เลือกชื่อผู้ลงนาม
            </option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            วันที่ลงชื่อ
          </Label>
          <Input
            type="date"
            value={signDate}
            onChange={(event) => onSignDateChange(event.target.value)}
            className="h-12 rounded-2xl"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Label className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              กรอกรายการ
            </Label>
            <Button type="button" onClick={onAddItem} className="h-12 w-full rounded-2xl text-base sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มรายการ
            </Button>
          </div>

          <ExpenseItemFields
            item={draftItem}
            index={items.length}
            title="รายการที่กำลังกรอก"
            errors={draftItemErrors}
            canRemove={false}
            onChange={onUpdateItem}
            onAmountBlur={onAmountBlur}
            onRemove={onRemoveItem}
          />

          {items.length > 0 ? (
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-neutral-700">รายการที่เพิ่มแล้ว</Label>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="rounded-2xl border border-[color-mix(in_oklab,var(--umore-border)_75%,white)] bg-[color-mix(in_oklab,var(--umore-paper)_80%,white)] p-4">
                    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-sm font-semibold text-[var(--umore-ink)]">รายการที่ {index + 1}</div>
                        <div className="text-xs text-[var(--umore-muted)]">{formatThaiLongDate(item.date)}</div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-11 rounded-2xl px-3 text-sm sm:h-10"
                      >
                        <Trash2 className="h-4 w-4" />
                        ลบรายการ
                      </Button>
                    </div>
                    <div className="text-sm text-[var(--umore-ink)] whitespace-pre-wrap">{item.description}</div>
                    <div className="mt-2 text-sm font-semibold text-[var(--umore-blue-deep)]">{formatAmount(item.amount)} บาท</div>
                    {item.note ? <div className="mt-1 text-xs text-[var(--umore-muted)]">หมายเหตุ: {item.note}</div> : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--umore-border)_78%,white)] bg-[color-mix(in_oklab,var(--umore-cream)_76%,white)] px-3 py-3">
            <div className="min-w-0">
              <Label className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4" />
                รวมเป็นตัวอักษรอัตโนมัติ
              </Label>
              <p className="mt-1 text-xs text-[var(--umore-muted)]">
                เปิดไว้เพื่อให้ระบบแปลงยอดรวมเป็นข้อความภาษาไทยให้อัตโนมัติ
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoFooterNote}
              onClick={() => onToggleAutoFooterNote(!autoFooterNote)}
              className={[
                "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                autoFooterNote ? "bg-[var(--umore-blue-deep)]" : "bg-[color-mix(in_oklab,var(--umore-border)_82%,white)]",
              ].join(" ")}
            >
              <span
                className={[
                  "inline-block h-5 w-5 rounded-full bg-white transition-transform",
                  autoFooterNote ? "translate-x-6" : "translate-x-1",
                ].join(" ")}
              />
            </button>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4" />
              ข้อความรวมเป็นตัวอักษร
            </Label>
            <Input
              value={footerNote}
              onChange={(event) => onFooterNoteChange(event.target.value)}
              placeholder="เช่น แปดร้อยยี่สิบแปดบาทถ้วน"
              className="h-11 rounded-2xl"
              disabled={autoFooterNote}
            />
            <p className="text-xs text-[var(--umore-muted)]">
              {autoFooterNote
                ? "ตอนนี้ระบบกรอกจากยอดรวมให้อัตโนมัติอยู่ ปิดสวิตช์ด้านบนเพื่อแก้เอง"
                : "ตอนนี้แก้ข้อความเองได้ตามต้องการ"}
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-[color-mix(in_oklab,var(--umore-cream)_76%,white)] px-4 py-3 text-sm text-[var(--umore-blue-deep)] ring-1 ring-[color-mix(in_oklab,var(--umore-blue)_20%,white)]">
            กรุณากดเพิ่มรายการอย่างน้อย 1 รายการก่อนดาวน์โหลด
          </div>
        ) : null}

        <Button onClick={onDownloadPdf} className="h-12 w-full rounded-2xl text-base font-semibold" disabled={isDownloadingPdf || items.length === 0}>
          <Download className="mr-2 h-5 w-5" />
          {isDownloadingPdf ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
        </Button>
      </CardContent>
    </Card>
  );
}
