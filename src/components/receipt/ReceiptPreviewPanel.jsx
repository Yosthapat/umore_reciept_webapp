import React from "react";
import { Download } from "lucide-react";

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

export function ReceiptPreviewPanel({
  previewRef,
  items,
  ownerName,
  signName,
  signDate,
  footerNote,
  total,
  isDownloadingPdf,
  onDownloadPdf,
}) {
  const signDisplayName = signName || "................................";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Preview PDF</h2>
          <p className="text-sm text-[var(--umore-muted)]">Display the full-page document in print-ready format.</p>
        </div>
        <Button onClick={onDownloadPdf} className="h-12 w-full rounded-2xl text-base font-semibold sm:w-auto" disabled={isDownloadingPdf}>
          <Download className="mr-2 h-5 w-5" />
          {isDownloadingPdf ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>

      <div className="overflow-auto rounded-[1.75rem] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--umore-cream)_86%,white)_0%,color-mix(in_oklab,var(--umore-blue-soft)_24%,white)_100%)] p-3 shadow-inner sm:rounded-[2rem] sm:p-4">
        <div className="max-h-[75vh] overflow-auto rounded-[1.25rem] bg-[color-mix(in_oklab,var(--umore-paper)_82%,white)] p-2 sm:rounded-[1.5rem] sm:p-3 md:p-6">
          <div
            ref={previewRef}
            className="mx-auto h-[1123px] w-[794px] bg-white px-12 py-10 text-black shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="w-[128px]" />
              <div className="flex-1 pt-1 text-center sm:pt-2">
                <div className="text-[24px] font-semibold sm:text-[24px]">ใบรับรองแทนใบเสร็จรับเงิน</div>
                <div className="mt-1 text-[24px] font-bold sm:text-[24px]">U MORE ST GROUP Co.,Ltd.</div>
              </div>
              <ReceiptLogoMark />
            </div>

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
                    <div className="flex min-h-[438px] flex-col gap-3 whitespace-nowrap">
                      {items.length > 0 ? (
                        items.map((item) => <div key={item.id}>{formatThaiLongDate(item.date) || "-"}</div>)
                      ) : (
                        <div className="text-neutral-500">ยังไม่มีรายการที่เพิ่ม</div>
                      )}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="flex min-h-[438px] flex-col gap-3 whitespace-pre-wrap">
                      {items.length > 0 ? (
                        items.map((item) => <div key={item.id}>{item.description || "-"}</div>)
                      ) : (
                        <div className="text-neutral-500">กรอกรายการแล้วกดเพิ่มรายการ</div>
                      )}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top text-right">
                    <div className="flex min-h-[438px] flex-col gap-3">
                      {items.length > 0 ? (
                        items.map((item) => <div key={item.id}>{formatAmount(item.amount) || "-"}</div>)
                      ) : (
                        <div className="text-left text-neutral-500">-</div>
                      )}
                    </div>
                  </td>
                  <td className="border border-black p-2 align-top">
                    <div className="flex min-h-[438px] flex-col gap-3">
                      {items.length > 0 ? (
                        items.map((item) => <div key={item.id}>{item.note || "-"}</div>)
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
                  <td className="border border-black px-2 py-1.5 text-right font-semibold">{formatAmount(total)}</td>
                  <td className="border border-black px-2 py-1.5" />
                </tr>
              </tbody>
            </table>

            <div className="mt-8 text-[19px] leading-7 text-left">
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
                และข้าพเจ้าได้จ่ายไปในงานโดยแท้
              </div>
            </div>

            <div className="mt-8 flex justify-end sm:mt-10">
              <div className="w-[320px] text-center text-[19px] leading-9 sm:w-[320px] sm:text-[19px] sm:leading-9">
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
