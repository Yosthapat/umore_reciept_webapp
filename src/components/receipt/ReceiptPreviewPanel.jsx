import React from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatAmount, formatThaiLongDate } from "../../utils/receipt-formatters";

function ReceiptLogoMark() {
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-sm text-center leading-tight sm:h-20 sm:w-20"
      style={{
        border: "1.5px solid #1eb7ff",
        backgroundColor: "#f5f0df",
        color: "#00a8ff",
        fontSize: "10px",
        fontWeight: 500,
      }}
    >
      <span>
        umore
        <br />
        made
      </span>
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
  isDownloadingPdf,
  onDownloadPdf,
}) {
  const ownerDisplayName = ownerName || "................................";
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
          <div ref={previewRef} className="mx-auto w-full max-w-[794px] bg-white p-3 text-black shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5 sm:gap-4">
              <div className="w-12 sm:w-20" />
              <div className="flex-1 pt-1 text-center sm:pt-2">
                <div className="text-[12px] font-semibold sm:text-[16px]">ใบรับรองแทนใบเสร็จรับเงิน</div>
                <div className="mt-1 text-[11px] font-bold sm:text-[14px]">U MORE ST GROUP Co.,Ltd.</div>
              </div>
              <ReceiptLogoMark />
            </div>

            <table className="mb-3 w-full border-collapse text-[9px] sm:text-[11px]">
              <thead>
                <tr>
                  <th className="border border-black p-2 text-center font-semibold">วัน / เดือน / ปี</th>
                  <th className="border border-black p-2 text-center font-semibold">รายละเอียดรายการจ่าย</th>
                  <th className="border border-black p-2 text-center font-semibold">จำนวนเงิน</th>
                  <th className="border border-black p-2 text-center font-semibold">หมายเหตุ</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td className="min-w-[74px] border border-black p-1.5 align-top sm:min-w-[110px] sm:p-2">
                        {formatThaiLongDate(item.date) || "-"}
                      </td>
                      <td className="min-w-[120px] whitespace-pre-wrap border border-black p-1.5 align-top sm:min-w-[280px] sm:p-2">
                        {item.description || "-"}
                      </td>
                      <td className="min-w-[70px] border border-black p-1.5 text-right align-top sm:min-w-[110px] sm:p-2">
                        {formatAmount(item.amount) || "-"}
                      </td>
                      <td className="min-w-[70px] border border-black p-1.5 align-top sm:min-w-[100px] sm:p-2">{item.note || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="border border-black p-4 text-center text-neutral-500 sm:p-6">
                      ยังไม่มีรายการที่เพิ่ม
                    </td>
                  </tr>
                )}
                <tr>
                  <td colSpan={2} className="border border-black p-1.5 font-semibold sm:p-2">
                    รวมเป็นทั้งสิ้น ({footerNote || "................................................"})
                  </td>
                  <td className="border border-black p-1.5 text-right font-semibold sm:p-2">{formatAmount(total)}</td>
                  <td className="border border-black p-1.5 sm:p-2" />
                </tr>
              </tbody>
            </table>

            <div className="mt-6 text-center text-[10px] leading-6 sm:mt-8 sm:text-[12px] sm:leading-7">
              ข้าพเจ้า <span className="font-semibold">{ownerDisplayName}</span> ขอรับรองว่า รายจ่ายข้างต้นนี้เป็นค่าใช้จ่ายในการปฏิบัติงานจริง
              และข้าพเจ้าได้จ่ายไปแทนก่อนแล้ว
            </div>

            <div className="mt-8 flex justify-end sm:mt-10">
              <div className="w-[180px] text-center text-[10px] leading-6 sm:w-[270px] sm:text-[12px] sm:leading-7">
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
