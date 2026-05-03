import React, { useRef } from "react";
import { BadgeDollarSign, CalendarDays, FileText, ImagePlus, Plus, Trash2, User, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAmount, formatThaiLongDate } from "@/utils/receipt-formatters";

import { ExpenseItemFields } from "./ExpenseItemFields";

function SectionHeader({ icon, title }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-4 w-0.5 rounded-full bg-[var(--umore-blue)]" />
      <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--umore-ink)]">
        {icon}
        {title}
      </span>
    </div>
  );
}

function SectionDivider() {
  return <div className="border-t border-[color-mix(in_oklab,var(--umore-border)_45%,transparent)]" />;
}

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
  photos,
  maxPhotos,
  maxItemsWithPhotos,
  onOwnerChange,
  onSignChange,
  onSignDateChange,
  onAddItem,
  onUpdateItem,
  onAmountBlur,
  onRemoveItem,
  onToggleAutoFooterNote,
  onFooterNoteChange,
  onAddPhotos,
  onRemovePhoto,
}) {
  const fileInputRef = useRef(null);
  const hasPhotos = photos.length > 0;
  const itemsAtLimit = hasPhotos && items.length >= maxItemsWithPhotos;

  const selectClass =
    "h-11 w-full rounded-2xl border border-[var(--umore-border)] bg-[color-mix(in_oklab,var(--umore-paper)_92%,white)] px-3 text-sm text-[var(--umore-ink)] outline-none transition-colors focus:border-[var(--umore-blue)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--umore-blue-soft)_70%,white)]";

  function handleFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      onAddPhotos(e.target.files);
    }
    // Reset input so the same file can be re-selected if removed
    e.target.value = "";
  }

  return (
    <Card className="min-w-0 overflow-hidden rounded-[1.75rem] border-0 shadow-[0_2px_20px_rgba(36,50,56,0.07),0_1px_4px_rgba(36,50,56,0.05)] sm:rounded-3xl">
      <CardContent className="space-y-5 p-4 sm:p-6">

        {/* Section: ข้อมูลผู้รับรอง */}
        <div className="space-y-3">
          <SectionHeader icon={<User className="h-3.5 w-3.5" />} title="ข้อมูลผู้รับรอง" />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>ข้าพเจ้าชื่อ</Label>
              <select
                value={ownerName}
                onChange={(e) => onOwnerChange(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>เลือกชื่อ</option>
                {people.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label>ลงชื่อ</Label>
              <select
                value={signName}
                onChange={(e) => onSignChange(e.target.value)}
                className={selectClass}
              >
                <option value="" disabled>เลือกชื่อผู้ลงนาม</option>
                {people.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              วันที่ลงชื่อ
            </Label>
            <Input
              type="date"
              value={signDate}
              onChange={(e) => onSignDateChange(e.target.value)}
              className="h-11 rounded-2xl"
            />
          </div>
        </div>

        <SectionDivider />

        {/* Section: รายการค่าใช้จ่าย */}
        <div className="space-y-3">
          <SectionHeader icon={<FileText className="h-3.5 w-3.5" />} title="รายการค่าใช้จ่าย" />

          {hasPhotos && (
            <div className="rounded-2xl bg-amber-50 px-4 py-2.5 text-xs text-amber-700 ring-1 ring-amber-200">
              มีรูปแนบ — รายการสูงสุด {maxItemsWithPhotos} รายการ ({items.length}/{maxItemsWithPhotos})
            </div>
          )}

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

          <Button
            type="button"
            onClick={onAddItem}
            disabled={itemsAtLimit}
            className="h-11 w-full rounded-2xl text-sm font-semibold disabled:opacity-50"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            เพิ่มรายการ
            {itemsAtLimit ? ` (ครบ ${maxItemsWithPhotos} รายการแล้ว)` : ""}
          </Button>

          {items.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--umore-muted)]">
                รายการที่เพิ่มแล้ว ({items.length})
              </p>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--umore-border)_65%,white)] bg-gradient-to-br from-[var(--umore-paper)] to-[color-mix(in_oklab,var(--umore-cream)_80%,white)] p-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--umore-blue-soft)] text-[10px] font-bold text-[var(--umore-blue-deep)]">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-snug text-[var(--umore-ink)]">{item.description || "—"}</p>
                      <p className="mt-0.5 text-xs text-[var(--umore-muted)]">{formatThaiLongDate(item.date)}</p>
                      {item.note ? (
                        <p className="mt-0.5 text-xs text-[var(--umore-muted)]">หมายเหตุ: {item.note}</p>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 items-start gap-1.5">
                      <span className="whitespace-nowrap rounded-xl bg-[color-mix(in_oklab,var(--umore-blue-soft)_80%,white)] px-2 py-0.5 text-xs font-bold text-[var(--umore-blue-deep)]">
                        {formatAmount(item.amount)} ฿
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="h-6 w-6 rounded-xl text-[var(--umore-muted)] hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {items.length === 0 ? (
            <div className="rounded-2xl bg-[color-mix(in_oklab,var(--umore-blue-soft)_40%,white)] px-4 py-3 text-xs text-[var(--umore-blue-deep)] ring-1 ring-[color-mix(in_oklab,var(--umore-blue)_16%,white)]">
              กรอกรายการแล้วกด <strong>เพิ่มรายการ</strong> — หรือดาวน์โหลด PDF ได้เลยถ้ามีรายการเดียว
            </div>
          ) : null}
        </div>

        <SectionDivider />

        {/* Section: แนบรูปภาพ */}
        <div className="space-y-3">
          <SectionHeader icon={<ImagePlus className="h-3.5 w-3.5" />} title="แนบรูปภาพ (ไม่บังคับ)" />

          <p className="text-xs text-[var(--umore-muted)]">
            แนบได้สูงสุด {maxPhotos} รูป — รูปจะแสดงใต้ตารางใน PDF และจำกัดรายการเหลือ {maxItemsWithPhotos} รายการ
          </p>

          {/* Thumbnails grid */}
          {photos.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--umore-border)] bg-[var(--umore-paper)]">
                  <img
                    src={photo.url}
                    alt="แนบรูป"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => onRemovePhoto(photo.id)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                    aria-label="ลบรูป"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Empty slot placeholders */}
              {Array.from({ length: maxPhotos - photos.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-2xl border border-dashed border-[var(--umore-border)] bg-[color-mix(in_oklab,var(--umore-paper)_80%,white)]"
                />
              ))}
            </div>
          ) : null}

          {/* Upload button */}
          {photos.length < maxPhotos ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[color-mix(in_oklab,var(--umore-blue)_40%,white)] bg-[color-mix(in_oklab,var(--umore-blue-soft)_35%,white)] text-sm font-medium text-[var(--umore-blue-deep)] transition-colors hover:bg-[color-mix(in_oklab,var(--umore-blue-soft)_55%,white)]"
              >
                <ImagePlus className="h-4 w-4" />
                เลือกรูปภาพ ({photos.length}/{maxPhotos})
              </button>
            </>
          ) : (
            <div className="rounded-2xl bg-[color-mix(in_oklab,var(--umore-cream)_70%,white)] px-4 py-2.5 text-center text-xs text-[var(--umore-muted)] ring-1 ring-[color-mix(in_oklab,var(--umore-border)_55%,white)]">
              ครบ {maxPhotos} รูปแล้ว — กด ✕ บนรูปเพื่อลบออก
            </div>
          )}
        </div>

        <SectionDivider />

        {/* Section: ยอดรวมเป็นตัวอักษร */}
        <div className="space-y-3">
          <SectionHeader icon={<BadgeDollarSign className="h-3.5 w-3.5" />} title="ยอดรวมเป็นตัวอักษร" />

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-[color-mix(in_oklab,var(--umore-border)_60%,white)] bg-[color-mix(in_oklab,var(--umore-cream)_70%,white)] px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--umore-ink)]">แปลงยอดรวมอัตโนมัติ</p>
              <p className="mt-0.5 text-xs text-[var(--umore-muted)]">ระบบจะแปลงตัวเลขเป็นภาษาไทยให้</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={autoFooterNote}
              onClick={() => onToggleAutoFooterNote(!autoFooterNote)}
              className={[
                "relative inline-flex shrink-0 items-center rounded-full transition-colors",
                autoFooterNote
                  ? "bg-[var(--umore-blue-deep)]"
                  : "bg-[color-mix(in_oklab,var(--umore-border)_90%,white)]",
              ].join(" ")}
              style={{ height: "24px", width: "44px" }}
            >
              <span
                className="inline-block rounded-full bg-white shadow-sm transition-transform"
                style={{
                  height: "18px",
                  width: "18px",
                  transform: autoFooterNote ? "translateX(22px)" : "translateX(3px)",
                }}
              />
            </button>
          </div>

          <div className="space-y-1.5">
            <Input
              value={footerNote}
              onChange={(e) => onFooterNoteChange(e.target.value)}
              placeholder="เช่น แปดร้อยยี่สิบแปดบาทถ้วน"
              className="h-11 rounded-2xl"
              disabled={autoFooterNote}
            />
            <p className="text-xs text-[var(--umore-muted)]">
              {autoFooterNote
                ? "ปิดสวิตช์ด้านบนเพื่อแก้ข้อความเอง"
                : "แก้ข้อความได้ตามต้องการ"}
            </p>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
