import React from "react";
import { Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import umoreMadeLogo from "@/assets/umore-made-logo.png";
import { formatAmount, formatThaiLongDate } from "../../utils/receipt-formatters";

function ReceiptLogoMark() {
  return (
    <img
      src={umoreMadeLogo}
      alt="umore made logo"
      className="h-[92px] w-[92px] rounded-sm object-contain sm:h-[128px] sm:w-[128px]"
      loading="eager"
      decoding="sync"
    />
  );
}

// Determine table body min-height based on how many photos are attached
function getTableBodyMinHeight(photoCount) {
  if (photoCount === 0) return "438px";
  if (photoCount <= 2) return "260px";
  return "160px";
}

// Photos displayed below the table — 1-2: single row, 3-4: 2x2 grid
function PhotoGrid({ photos }) {
  if (photos.length === 0) return null;

  const is2Col = photos.length >= 3;
  const imageHeight = is2Col ? "180px" : "240px";

  return (
    <div style={{ marginTop: "16px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: is2Col ? "1fr 1fr" : `repeat(${photos.length}, 1fr)`,
          gap: "10px",
        }}
      >
        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.url}
            alt="แนบรูป"
            style={{
              width: "100%",
              height: imageHeight,
              objectFit: "cover",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              display: "block",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ReceiptPreviewPanel({
  previewRef,
  items,
  ownerName,
  signName,
  signDate,
  footerNote,
  total,
  photos,
  isDownloadingPdf,
  onDownloadPdf,
}) {
  const signDisplayName = signName || "................................";
  const tableBodyMinHeight = getTableBodyMinHeight(photos.length);

  // When photos are present, only show the first 10 items in the PDF
  const displayItems = photos.length > 0 ? items.slice(0, 10) : items;

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_oklab,var(--umore-blue-soft)_72%,white)]">
            <FileText style={{ height: "18px", width: "18px" }} className="text-[var(--umore-blue-deep)]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--umore-ink)]">ตัวอย่างเอกสาร</h2>
            <p className="text-xs text-[var(--umore-muted)]">
              A4 · พร้อมพิมพ์และดาวน์โหลด
              {photos.length > 0 ? ` · รูปแนบ ${photos.length} รูป` : ""}
            </p>
          </div>
        </div>
        <Button
          onClick={onDownloadPdf}
          className="h-11 w-full rounded-2xl text-sm font-semibold sm:w-auto"
          disabled={isDownloadingPdf}
        >
          <Download className="mr-2 h-4 w-4" />
          {isDownloadingPdf ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF"}
        </Button>
      </div>

      <div className="max-w-full overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--umore-cream)_86%,white)_0%,color-mix(in_oklab,var(--umore-blue-soft)_24%,white)_100%)] p-3 shadow-inner sm:rounded-[2rem] sm:p-4">
        <div className="max-h-[75vh] max-w-full overflow-auto rounded-[1.25rem] bg-[color-mix(in_oklab,var(--umore-paper)_82%,white)] p-2 sm:rounded-[1.5rem] sm:p-3 md:p-6">
          <div
            ref={previewRef}
            className="mx-auto w-[794px] bg-white px-12 py-10 text-black shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
            // Height is auto when photos present so content can grow; fixed when no photos
            style={{ minHeight: "1123px" }}
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="w-[128px]" />
              <div className="flex-1 pt-1 text-center sm:pt-2">
                <div className="text-[24px] font-semibold">ใบรับรองแทนใบเสร็จรับเงิน</div>
                <div className="mt-1 text-[24px] font-bold">U MORE ST GROUP Co.,Ltd.</div>
              </div>
              <ReceiptLogoMark />
            </div>

            {/* Table */}
            <table className="mb-3 w-full table-fixed border-collapse text-[16px]">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[40%]" />
                <col className="w-[19%]" />
                <col className="w-[19%]" />
              </colgroup>
              <thead>
                <tr>
                  <th className="border border-black px-2 py-1.5 text-center font-semibold">วัน / เดือน / ปี</th>
                  <th className="border border-black px-2 py-1.5 text-center font-semibold">รายละเอียดรายการจ่าย</th>
                  <th className="border border-black px-2 py-1.5 text-center font-semibold">จำนวนเงิน</th>
                  <th className="border border-black px-2 py-1.5 text-center font-semibold">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 align-top">
                    <div className="flex flex-col gap-3 whitespace-nowrap" style={{ minHeight: tableBodyMinHeight }}>
                      {displayItems.length > 0 ? (
                        displayItems.map((item) => (
                          <div key={item.id}>{formatThaiLongDate(item.date) || "-"}</div>
                        ))
                      ) : (
                        <div className="text-neutral-500">ยังไม่มีรายการที่เพิ่ม</div>
                      )}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="flex flex-col gap-3 whitespace-pre-wrap" style={{ minHeight: tableBodyMinHeight }}>
                      {displayItems.length > 0 ? (
                        displayItems.map((item) => (
                          <div key={item.id}>{item.description || "-"}</div>
                        ))
                      ) : (
                        <div className="text-neutral-500">กรอกรายการแล้วกดเพิ่มรายการ</div>
                      )}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top text-right">
                    <div className="flex flex-col gap-3" style={{ minHeight: tableBodyMinHeight }}>
                      {displayItems.length > 0 ? (
                        displayItems.map((item) => (
                          <div key={item.id}>{formatAmount(item.amount) || "-"}</div>
                        ))
                      ) : (
                        <div className="text-left text-neutral-500">-</div>
                      )}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="flex flex-col gap-3" style={{ minHeight: tableBodyMinHeight }}>
                      {displayItems.length > 0 ? (
                        displayItems.map((item) => (
                          <div key={item.id}>{item.note || "-"}</div>
                        ))
                      ) : (
                        <div className="text-neutral-500">-</div>
                      )}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-black px-2 py-1.5 font-semibold">
                    รวมเป็นทั้งสิ้น ({footerNote || "................................................"})
                  </td>
                  <td className="border border-black px-2 py-1.5 text-right font-semibold">
                    {formatAmount(total)}
                  </td>
                  <td className="border border-black px-2 py-1.5" />
                </tr>
              </tbody>
            </table>

            {/* Photo grid — only shown when photos are attached */}
            <PhotoGrid photos={photos} />

            {/* Certification block */}
            <div className="mt-8 text-left text-[19px] leading-7">
              <div className="pl-12">
                <span>ข้าพเจ้า</span>
                <span className="mx-2 inline-block min-w-[280px] px-2 text-center font-semibold align-bottom">
                  {ownerName || "\u00A0"}
                </span>
              </div>
              <div className="mt-2 pl-12">
                ขอรับรองว่า รายจ่ายข้างต้นนี้ไม่อาจเรียกใบเสร็จรับเงินเต็มรูปแบบจากผู้รับได้
              </div>
              <div className="mt-1 pl-12">
                และข้าพเจ้าได้จ่ายไปในงานของทาง บริษัท ยู มอร์ เอสที กรุ๊ป จำกัด โดยแท้
              </div>
            </div>

            {/* Signature block */}
            <div className="mt-8 flex justify-end sm:mt-10">
              <div className="w-[320px] text-center text-[19px] leading-9">
                <div>(ลงชื่อ) ...............................................</div>
                <div>({signDisplayName})</div>
                <div>
                  วันที่ {signDate ? formatThaiLongDate(signDate) : "........../........../.........."}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
