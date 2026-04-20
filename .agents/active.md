# Active Context

## Current Task
- Ready to continue UI tweaks or finish deployment from the dashboard.

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

## Next Steps
- Complete the Cloudflare Pages setup form and trigger the first production deploy.
- Push the latest UI tweaks if these changes should go live immediately.

## Blockers
- none

## Last Updated
- Codex — 2026-04-21
