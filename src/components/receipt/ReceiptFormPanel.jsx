import React from "react";
import { BadgeDollarSign, CalendarDays, Download, FileText, Plus, User } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ExpenseItemFields } from "./ExpenseItemFields";

export function ReceiptFormPanel({
  people,
  ownerName,
  signName,
  items,
  itemErrors,
  hasValidationErrors,
  footerNote,
  autoFooterNote,
  isDownloadingPdf,
  onOwnerChange,
  onSignChange,
  onAddItem,
  onUpdateItem,
  onAmountBlur,
  onRemoveItem,
  onToggleAutoFooterNote,
  onFooterNoteChange,
  onDownloadPdf,
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="h-5 w-5" />
          กรอกข้อมูล
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            ข้าพเจ้าชื่อ
          </Label>
          <select
            value={ownerName}
            onChange={(event) => onOwnerChange(event.target.value)}
            className="h-11 w-full rounded-2xl border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
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
            className="h-11 w-full rounded-2xl border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
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

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              รายการค่าใช้จ่าย
            </Label>
            <Button type="button" onClick={onAddItem} className="rounded-2xl">
              <Plus className="mr-2 h-4 w-4" />
              เพิ่มรายการ
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <ExpenseItemFields
                key={item.id}
                item={item}
                index={index}
                errors={itemErrors[item.id] || {}}
                canRemove={items.length > 1}
                onChange={onUpdateItem}
                onAmountBlur={onAmountBlur}
                onRemove={onRemoveItem}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 px-3 py-3">
            <div>
              <Label className="flex items-center gap-2">
                <BadgeDollarSign className="h-4 w-4" />
                รวมเป็นตัวอักษรอัตโนมัติ
              </Label>
              <p className="mt-1 text-xs text-neutral-500">
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
                autoFooterNote ? "bg-neutral-900" : "bg-neutral-300",
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
            <p className="text-xs text-neutral-500">
              {autoFooterNote
                ? "ตอนนี้ระบบกรอกจากยอดรวมให้อัตโนมัติอยู่ ปิดสวิตช์ด้านบนเพื่อแก้เอง"
                : "ตอนนี้แก้ข้อความเองได้ตามต้องการ"}
            </p>
          </div>
        </div>

        {hasValidationErrors ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            ยังมีข้อมูลบางรายการไม่ครบ กรุณาตรวจสอบวันที่ รายละเอียด และจำนวนเงินก่อนดาวน์โหลด
          </div>
        ) : null}

        <Button
          onClick={onDownloadPdf}
          className="h-12 w-full rounded-2xl text-base font-semibold"
          disabled={isDownloadingPdf || hasValidationErrors}
        >
          <Download className="mr-2 h-5 w-5" />
          {isDownloadingPdf ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
        </Button>
      </CardContent>
    </Card>
  );
}
