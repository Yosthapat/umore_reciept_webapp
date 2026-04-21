# Active Context

## Current Task
- Continue small receipt data and PDF layout refinements.

## Done Last Session
- Initialized `.agents/` context files for this repository.
- Added `.impeccable.md` with inferred frontend design context for this internal tool.
- Split `iphone_receipt_webapp.jsx` into entry component, receipt components, constants, and utility modules.
- Added a runnable Vite + React + Tailwind setup with local UI primitives and alias config.
- Installed dependencies and verified production build passes.
- Moved PDF/export dependencies to lazy loading and added a download loading state.
- Added inline form validation and amount sanitization/formatting for receipt rows.
- Added free deployment scripts and a Cloudflare Pages deployment guide.
- Committed and pushed the project to `origin/main`.
- Updated the name selectors to default to `เลือกชื่อ` with preview fallbacks.
- Updated receipt dates to default to the current day for the initial row and new rows.
- Updated the initial description/amount fields to start empty with the requested placeholders.
- Removed the floating total badge above the preview card.
- Shortened the amount field label from `จำนวนเงินแต่ละรายการ` to `จำนวนเงิน`.
- Added a dedicated signing-date input defaulting to today and wired the preview signature date to it.
- Changed the item-entry flow to use a resettable draft form: add item to preview only after pressing `เพิ่มรายการ`.
- Replaced the iPhone-style preview shell with a full-page PDF document preview.
- Moved the document logo to the right side of the PDF header.
- Adapted the form and PDF preview layout for easier phone use with tighter spacing and touch-friendly controls.
- Updated the UI theme to match the logo direction with warm cream surfaces and soft `umore` blue accents.
- Fixed the download flow so a valid draft item can be exported immediately without forcing the user to press `เพิ่มรายการ` first.
- Moved the `Download PDF` button from the form panel to the top-right area of the PDF preview.
- Fixed the PDF export error from `html2canvas` by cloning the preview and inlining computed styles before rendering.
- Hardened the PDF export fix by stripping classes from the export clone and normalizing `oklch` / `color-mix` values before capture.
- Isolated PDF export into a blank offscreen `iframe` so `html2canvas` no longer sees the app stylesheet during capture.
- Stopped copying custom CSS variables and unresolved modern color values into the export clone to avoid `html2canvas` parsing `oklch(...)`.
- Expanded `jsconfig.json` with Vite-friendly module resolution and explicit includes to reduce IDE false-positive red errors.
- Replaced the preview logo block with explicit inline brand colors and changed PDF filenames to numeric timestamps.
- Added the provided `umore made` PNG as a real asset and wired the PDF preview to render it directly.
- Reworked the PDF table into a fixed-height reserved area with vertically stacked entries, enlarged the logo, and changed the certification line to a document-style name pattern.
- Set the PDF preview canvas to A4 dimensions, reduced table typography to 12pt, constrained column widths with `table-fixed`, and split the certification text into the requested pattern.
- Added a first-line indent to the certification text and changed the owner-name underline to a dotted line.
- Changed the certification copy to an inline pattern matching the sample: `ข้าพเจ้า ... ขอรับรองว่า ...` followed by a second line.
- Added an extra first-line indent before `ข้าพเจ้า` in the certification block.
- Adjusted the certification block to left-align with a fixed dotted name field and separate second line.
- Refined the certification block to keep the first line together with `whitespace-nowrap` and a fixed dotted owner-name field.
- Updated the certification block to a smaller 12pt-style size and separated it into name, certification statement, and payment-confirmation lines.
- Increased the certification block text back to 19px for better PDF readability.
- Widened the date column, reduced the amount column, and prevented Thai date text from wrapping in the PDF table.
- Removed the dotted underline from the owner-name field in the certification block because it overlapped the text.
- Expanded all `น.ส.` person prefixes to `นางสาว` in the dropdown data.

## Next Steps
- If needed, commit and push the latest dropdown name prefix cleanup.
- Validate the exported PDF against the live preview after the next deploy finishes.

## Blockers
- none

## Last Updated
- Codex — 2026-04-21
