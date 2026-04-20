import React from "react";

import { formatAmount, formatThaiLongDate } from "../../utils/receipt-formatters";

export function ReceiptPreviewPanel({ previewRef, items, ownerName, signName, footerNote, total }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">ตัวอย่างผลลัพธ์</h2>
          <p className="text-sm text-neutral-600">ออกแบบให้ดูง่ายบน iPhone และพร้อมแคปหรือดาวน์โหลดเป็น PDF</p>
        </div>
        <div className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-sm">
          ยอดรวม {formatAmount(total)} บาท
        </div>
      </div>

      <div className="overflow-auto rounded-[2rem] bg-neutral-200 p-3 shadow-inner">
        <div className="mx-auto max-w-[430px] rounded-[2.5rem] bg-black p-3 shadow-2xl">
          <div className="overflow-hidden rounded-[2rem] bg-white">
            <div className="flex items-center justify-center border-b bg-neutral-50 px-4 py-3 text-sm font-medium">
              Preview บน iPhone
            </div>

            <div className="max-h-[860px] overflow-auto bg-neutral-100 p-3 md:p-4">
              <div ref={previewRef} className="mx-auto w-full max-w-[794px] bg-white p-5 text-black">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-sm border bg-[#f5f0df] text-center text-[10px] leading-tight text-sky-400">
                    umore
                    <br />
                    made
                  </div>
                  <div className="flex-1 pt-2 text-center">
                    <div className="text-[16px] font-semibold">ใบรับรองแทนใบเสร็จรับเงิน</div>
                    <div className="mt-1 text-[14px] font-bold">U MORE ST GROUP Co.,Ltd.</div>
                  </div>
                  <div className="w-20" />
                </div>

                <table className="mb-3 w-full border-collapse text-[11px]">
                  <thead>
                    <tr>
                      <th className="border border-black p-2 text-center font-semibold">วัน / เดือน / ปี</th>
                      <th className="border border-black p-2 text-center font-semibold">รายละเอียดรายการจ่าย</th>
                      <th className="border border-black p-2 text-center font-semibold">จำนวนเงิน</th>
                      <th className="border border-black p-2 text-center font-semibold">หมายเหตุ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="min-w-[110px] border border-black p-2 align-top">
                          {formatThaiLongDate(item.date) || "-"}
                        </td>
                        <td className="min-w-[280px] whitespace-pre-wrap border border-black p-2 align-top">
                          {item.description || "-"}
                        </td>
                        <td className="min-w-[110px] border border-black p-2 text-right align-top">
                          {formatAmount(item.amount) || "-"}
                        </td>
                        <td className="min-w-[100px] border border-black p-2 align-top">{item.note || "-"}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={2} className="border border-black p-2 font-semibold">
                        รวมเป็นทั้งสิ้น ({footerNote || "................................................"})
                      </td>
                      <td className="border border-black p-2 text-right font-semibold">{formatAmount(total)}</td>
                      <td className="border border-black p-2" />
                    </tr>
                  </tbody>
                </table>

                <div className="mt-8 text-center text-[12px] leading-7">
                  ข้าพเจ้า <span className="font-semibold">{ownerName}</span> ขอรับรองว่า รายจ่ายข้างต้นนี้เป็นค่าใช้จ่ายในการปฏิบัติงานจริง
                  และข้าพเจ้าได้จ่ายไปแทนก่อนแล้ว
                </div>

                <div className="mt-10 flex justify-end">
                  <div className="w-[270px] text-center text-[12px] leading-7">
                    <div>(ลงชื่อ) ...............................................</div>
                    <div>({signName})</div>
                    <div>
                      วันที่ {items[0]?.date ? formatThaiLongDate(items[0].date) : "........../........../.........."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
