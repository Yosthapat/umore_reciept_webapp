import React, { useEffect, useRef, useState } from "react";
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
  if (photoCount === 1) return "200px";
  if (photoCount === 2) return "180px";
  return "160px"; // 3 photos in single row
}

// Photos displayed below the table — always single row, max 3 cols
// object-fit: contain so no detail is cropped; light bg fills letterbox gaps
function PhotoGrid({ photos }) {
  if (photos.length === 0) return null;

  const count = photos.length;
  // Height scales down as more photos are added to keep total height manageable
  const cellHeight = count === 1 ? "300px" : count === 2 ? "220px" : "180px";

  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${count}, 1fr)`,
          gap: "8px",
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{
              height: cellHeight,
              backgroundColor: "#f8f8f8",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={photo.url}
              alt="แนบรูป"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReceiptPreviewPanel({
  previewRef,
  items,
  ownerName,
  ownerPosition,
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
  const displayItems = photos.length > 0 ? items.slice(0, 10) : items;

  // Scale the 794px preview to fit the container width on narrow screens
  const scaleWrapRef = useRef(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [scaledHeight, setScaledHeight] = useState(1123);

  useEffect(() => {
    const wrap = scaleWrapRef.current;
    const preview = previewRef.current;
    if (!wrap || !preview) return;

    function update() {
      const newScale = Math.min(1, wrap.offsetWidth / 794);
      setPreviewScale(newScale);
      setScaledHeight(preview.scrollHeight * newScale);
    }

    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    ro.observe(preview);
    return () => ro.disconnect();
  }, [previewRef]);

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

      <div className="overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--umore-cream)_86%,white)_0%,color-mix(in_oklab,var(--umore-blue-soft)_24%,white)_100%)] p-3 shadow-inner sm:rounded-[2rem] sm:p-4">
        <div className="overflow-hidden rounded-[1.25rem] bg-[color-mix(in_oklab,var(--umore-paper)_82%,white)] p-2 sm:rounded-[1.5rem] sm:p-3">
          {/* Scale wrapper — measures container width and scales the 794px doc to fit */}
          <div ref={scaleWrapRef} style={{ width: "100%", position: "relative", height: `${scaledHeight}px` }}>
            <div style={{ position: "absolute", top: 0, left: 0, transform: `scale(${previewScale})`, transformOrigin: "top left" }}>
          <div
            ref={previewRef}
            className="bg-white px-12 py-10 text-black shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
            style={{ width: "794px", minHeight: "1123px" }}
          >
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="w-[128px]" />
              <div className="flex-1 pt-1 text-center sm:pt-2">
                <div className="text-[24px] font-semibold">ใบรับรองแทนใบเสร็จรับเงิน</div>
                <div className="mt-1 text-[24px] font-bold">บริษัท ยู มอร์ เอสที กรุ๊ป จำกัด</div>
                <div className="mt-1 text-[13px] font-normal leading-5 text-gray-600">
                  สำนักงานใหญ่<br />
                  0135567002865<br />
                  55/411 หมู่ที่ 2 ต.ลำผักกูด อำเภอธัญบุรี จังหวัดปทุมธานี 12110
                </div>
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
                <span className="mx-2 inline-block min-w-[200px] px-2 text-center font-semibold align-bottom">
                  {ownerName || "\u00A0"}
                </span>
                <span>ตำแหน่ง</span>
                <span className="mx-2 inline-block min-w-[100px] px-2 text-center font-semibold align-bottom">
                  {ownerPosition || "\u00A0"}
                </span>
              </div>
              <div className="mt-2 pl-12">
                ขอรับรองว่า รายจ่ายข้างต้นนี้ไม่อาจเรียกใบเสร็จรับเงินเต็มรูปแบบจากผู้รับได้
              </div>
              <div className="mt-1 pl-12">
                และข้าพเจ้าได้จ่ายไปในงานของทางบริษัท ยู มอร์ เอสที กรุ๊ป จำกัด โดยแท้
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
            </div>{/* close absolute scaler */}
          </div>{/* close scaleWrapRef */}
        </div>
      </div>
    </div>
  );
}
