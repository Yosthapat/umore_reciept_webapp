import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { ReceiptFormPanel } from "./src/components/receipt/ReceiptFormPanel";
import { ReceiptPreviewPanel } from "./src/components/receipt/ReceiptPreviewPanel";
import { PEOPLE } from "./src/constants/receipt-data";
import {
  createEmptyItem,
  getTodayDateString,
  numberToThaiText,
  normalizeAmountForDisplay,
  parseAmount,
  sanitizeAmountInput,
  validateReceiptItem,
} from "./src/utils/receipt-formatters";
import { downloadReceiptPdf } from "./src/utils/receipt-pdf";

const INITIAL_ITEMS = [
  {
    id: crypto.randomUUID(),
    date: getTodayDateString(),
    description: "",
    amount: "",
    note: "",
  },
];

export default function IphoneReceiptWebApp() {
  const previewRef = useRef(null);
  const [ownerName, setOwnerName] = useState("");
  const [signName, setSignName] = useState("");
  const [signDate, setSignDate] = useState(getTodayDateString());
  const [footerNote, setFooterNote] = useState("");
  const [autoFooterNote, setAutoFooterNote] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [items, setItems] = useState([]);
  const [draftItem, setDraftItem] = useState(INITIAL_ITEMS[0]);
  const [showDraftErrors, setShowDraftErrors] = useState(false);

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + parseAmount(item.amount), 0);
  }, [items]);

  const draftItemErrors = useMemo(() => validateReceiptItem(draftItem), [draftItem]);
  const hasDraftValidationErrors = Object.keys(draftItemErrors).length > 0;

  useEffect(() => {
    if (autoFooterNote) {
      setFooterNote(numberToThaiText(total));
    }
  }, [autoFooterNote, total]);

  function updateDraftItem(fieldName, value) {
    const normalizedValue = fieldName === "amount" ? sanitizeAmountInput(value) : value;

    setDraftItem((previousItem) => ({ ...previousItem, [fieldName]: normalizedValue }));
  }

  function formatDraftAmount() {
    setDraftItem((previousItem) => ({
      ...previousItem,
      amount: normalizeAmountForDisplay(previousItem.amount),
    }));
  }

  function addItem() {
    if (hasDraftValidationErrors) {
      setShowDraftErrors(true);
      return;
    }

    setItems((previousItems) => [...previousItems, draftItem]);
    setDraftItem(createEmptyItem());
    setShowDraftErrors(false);
  }

  function removeItem(itemId) {
    setItems((previousItems) => previousItems.filter((item) => item.id !== itemId));
  }

  async function handleDownloadPdf() {
    const hasCommittedItems = items.length > 0;
    const canUseDraftForDownload = !hasCommittedItems && !hasDraftValidationErrors;

    if (!hasCommittedItems && !canUseDraftForDownload) {
      setShowDraftErrors(true);
      return;
    }

    setIsDownloadingPdf(true);

    try {
      if (canUseDraftForDownload) {
        setItems([draftItem]);
        setDraftItem(createEmptyItem());
        setShowDraftErrors(false);

        await new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
          });
        });
      }

      await downloadReceiptPdf(previewRef.current);
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(248,243,227,0.86)_0%,rgba(241,235,220,0.92)_100%)] text-[var(--umore-ink)]">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-4 sm:mb-5"
        >
          <div className="inline-flex items-center rounded-full border border-[color-mix(in_oklab,var(--umore-blue)_30%,white)] bg-[color-mix(in_oklab,var(--umore-blue-soft)_68%,white)] px-3 py-1 text-xs font-medium tracking-[0.18em] text-[var(--umore-blue-deep)] uppercase">
            umore receipt
          </div>
          <h1 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">ฟอร์มใบรับรองแทนใบเสร็จรับเงิน</h1>
        </motion.div>

        <div className="grid gap-4 lg:items-start lg:gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
          <ReceiptFormPanel
            people={PEOPLE}
            ownerName={ownerName}
            signName={signName}
            signDate={signDate}
            draftItem={draftItem}
            draftItemErrors={showDraftErrors ? draftItemErrors : {}}
            items={items}
            footerNote={footerNote}
            autoFooterNote={autoFooterNote}
            onOwnerChange={setOwnerName}
            onSignChange={setSignName}
            onSignDateChange={setSignDate}
            onAddItem={addItem}
            onUpdateItem={updateDraftItem}
            onAmountBlur={formatDraftAmount}
            onRemoveItem={removeItem}
            onToggleAutoFooterNote={setAutoFooterNote}
            onFooterNoteChange={setFooterNote}
          />

          <ReceiptPreviewPanel
            previewRef={previewRef}
            items={items}
            ownerName={ownerName}
            signName={signName}
            signDate={signDate}
            footerNote={footerNote}
            total={total}
            isDownloadingPdf={isDownloadingPdf}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>
      </div>
    </div>
  );
}
