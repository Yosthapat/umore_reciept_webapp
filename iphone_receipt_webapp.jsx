import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { ReceiptFormPanel } from "./src/components/receipt/ReceiptFormPanel";
import { ReceiptPreviewPanel } from "./src/components/receipt/ReceiptPreviewPanel";
import { PEOPLE } from "./src/constants/receipt-data";
import {
  createEmptyItem,
  numberToThaiText,
  normalizeAmountForDisplay,
  parseAmount,
  sanitizeAmountInput,
  validateReceiptItem,
} from "./src/utils/receipt-formatters";
import { downloadReceiptPdf } from "./src/utils/receipt-pdf";

const DEFAULT_PERSON = PEOPLE[4];
const INITIAL_ITEMS = [
  {
    id: crypto.randomUUID(),
    date: "2026-04-03",
    description: "ค่าเดินทาง รถบัส สถานบิน",
    amount: "828.31",
    note: "",
  },
];

export default function IphoneReceiptWebApp() {
  const previewRef = useRef(null);
  const [ownerName, setOwnerName] = useState(DEFAULT_PERSON);
  const [signName, setSignName] = useState(DEFAULT_PERSON);
  const [footerNote, setFooterNote] = useState("");
  const [autoFooterNote, setAutoFooterNote] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [items, setItems] = useState(INITIAL_ITEMS);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + parseAmount(item.amount), 0);
  }, [items]);

  const itemErrors = useMemo(() => {
    return items.reduce((errorsByItemId, item) => {
      errorsByItemId[item.id] = validateReceiptItem(item);
      return errorsByItemId;
    }, {});
  }, [items]);

  const hasValidationErrors = useMemo(() => {
    return Object.values(itemErrors).some((errors) => Object.keys(errors).length > 0);
  }, [itemErrors]);

  useEffect(() => {
    if (autoFooterNote) {
      setFooterNote(numberToThaiText(total));
    }
  }, [autoFooterNote, total]);

  function updateItem(itemId, fieldName, value) {
    const normalizedValue = fieldName === "amount" ? sanitizeAmountInput(value) : value;

    setItems((previousItems) =>
      previousItems.map((item) => (item.id === itemId ? { ...item, [fieldName]: normalizedValue } : item)),
    );
  }

  function formatItemAmount(itemId) {
    setItems((previousItems) =>
      previousItems.map((item) =>
        item.id === itemId ? { ...item, amount: normalizeAmountForDisplay(item.amount) } : item,
      ),
    );
  }

  function addItem() {
    setItems((previousItems) => [...previousItems, createEmptyItem()]);
  }

  function removeItem(itemId) {
    setItems((previousItems) => previousItems.filter((item) => item.id !== itemId));
  }

  async function handleDownloadPdf() {
    if (hasValidationErrors) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await downloadReceiptPdf(previewRef.current);
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-5"
        >
          <h1 className="text-2xl font-bold tracking-tight">ฟอร์มใบรับรองแทนใบเสร็จรับเงิน</h1>
          <p className="mt-1 text-sm text-neutral-600">
            กรอกข้อมูลและ มีตัวอย่างผลลัพธ์ด้านขวา และกดดาวน์โหลด PDF ได้ทันที
          </p>
        </motion.div>

        <div className="grid gap-5 xl:grid-cols-[420px_minmax(0,1fr)]">
          <ReceiptFormPanel
            people={PEOPLE}
            ownerName={ownerName}
            signName={signName}
            items={items}
            itemErrors={itemErrors}
            hasValidationErrors={hasValidationErrors}
            footerNote={footerNote}
            autoFooterNote={autoFooterNote}
            isDownloadingPdf={isDownloadingPdf}
            onOwnerChange={setOwnerName}
            onSignChange={setSignName}
            onAddItem={addItem}
            onUpdateItem={updateItem}
            onAmountBlur={formatItemAmount}
            onRemoveItem={removeItem}
            onToggleAutoFooterNote={setAutoFooterNote}
            onFooterNoteChange={setFooterNote}
            onDownloadPdf={handleDownloadPdf}
          />

          <ReceiptPreviewPanel
            previewRef={previewRef}
            items={items}
            ownerName={ownerName}
            signName={signName}
            footerNote={footerNote}
            total={total}
          />
        </div>
      </div>
    </div>
  );
}
