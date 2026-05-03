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

const MAX_PHOTOS = 4;
const MAX_ITEMS_WITH_PHOTOS = 10;

export default function IphoneReceiptWebApp() {
  const previewRef = useRef(null);
  const [ownerName, setOwnerName] = useState("");
  const [signName, setSignName] = useState("");
  const [signDate, setSignDate] = useState(getTodayDateString());
  const [footerNote, setFooterNote] = useState("");
  const [autoFooterNote, setAutoFooterNote] = useState(true);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [items, setItems] = useState([]);
  const [draftItem, setDraftItem] = useState(() => ({
    id: crypto.randomUUID(),
    date: getTodayDateString(),
    description: "",
    amount: "",
    note: "",
  }));
  const [showDraftErrors, setShowDraftErrors] = useState(false);
  const [photos, setPhotos] = useState([]); // { id, url }[]

  const hasPhotos = photos.length > 0;

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

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function updateDraftItem(fieldName, value) {
    const normalizedValue = fieldName === "amount" ? sanitizeAmountInput(value) : value;
    setDraftItem((prev) => ({ ...prev, [fieldName]: normalizedValue }));
  }

  function formatDraftAmount() {
    setDraftItem((prev) => ({
      ...prev,
      amount: normalizeAmountForDisplay(prev.amount),
    }));
  }

  function addItem() {
    if (hasDraftValidationErrors) {
      setShowDraftErrors(true);
      return;
    }
    if (hasPhotos && items.length >= MAX_ITEMS_WITH_PHOTOS) {
      return;
    }
    setItems((prev) => [...prev, draftItem]);
    setDraftItem(createEmptyItem());
    setShowDraftErrors(false);
  }

  function removeItem(itemId) {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function addPhotos(files) {
    const remaining = MAX_PHOTOS - photos.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const newPhotos = toAdd.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  }

  function removePhoto(id) {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      return prev.filter((p) => p.id !== id);
    });
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
          requestAnimationFrame(() => requestAnimationFrame(resolve));
        });
      }

      await downloadReceiptPdf(previewRef.current);
    } finally {
      setIsDownloadingPdf(false);
    }
  }

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-[linear-gradient(180deg,rgba(248,243,227,0.86)_0%,rgba(241,235,220,0.92)_100%)] text-[var(--umore-ink)]">
      <div className="mx-auto min-w-0 max-w-6xl px-3 py-4 sm:px-4 sm:py-6 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_oklab,var(--umore-blue)_32%,white)] bg-[color-mix(in_oklab,var(--umore-blue-soft)_72%,white)] px-3.5 py-1.5 text-xs font-semibold tracking-[0.16em] text-[var(--umore-blue-deep)] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--umore-blue)]" />
            umore receipt
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-[var(--umore-ink)] sm:text-3xl">
            ฟอร์มใบรับรองแทนใบเสร็จรับเงิน
          </h1>
          <p className="mt-1.5 text-sm text-[var(--umore-muted)]">กรอกข้อมูลเพื่อสร้างเอกสารและดาวน์โหลด PDF</p>
        </motion.div>

        <div className="grid min-w-0 gap-4 lg:items-start lg:gap-5 xl:grid-cols-[400px_minmax(0,1fr)]">
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
            photos={photos}
            maxPhotos={MAX_PHOTOS}
            maxItemsWithPhotos={MAX_ITEMS_WITH_PHOTOS}
            onOwnerChange={setOwnerName}
            onSignChange={setSignName}
            onSignDateChange={setSignDate}
            onAddItem={addItem}
            onUpdateItem={updateDraftItem}
            onAmountBlur={formatDraftAmount}
            onRemoveItem={removeItem}
            onToggleAutoFooterNote={setAutoFooterNote}
            onFooterNoteChange={setFooterNote}
            onAddPhotos={addPhotos}
            onRemovePhoto={removePhoto}
          />

          <ReceiptPreviewPanel
            previewRef={previewRef}
            items={items}
            ownerName={ownerName}
            signName={signName}
            signDate={signDate}
            footerNote={footerNote}
            total={total}
            photos={photos}
            isDownloadingPdf={isDownloadingPdf}
            onDownloadPdf={handleDownloadPdf}
          />
        </div>
      </div>
    </div>
  );
}
