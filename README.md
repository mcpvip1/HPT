# Temperature Test Report · Pro

A quadrilingual (EN / 中文 / ไทย / မြန်မာ) dashboard for analysing
temperature-sensor Excel exports — with Light / Dark appearance.

## Appearance (Dark Mode)

- Click the ☀️ / 🌙 button in the toolbar to toggle
- The choice persists in `localStorage` under the key `appearance`
- On first visit, the OS dark-mode preference is used automatically
- The **printed A4 report is always light** regardless of the app theme
- Type `debugAppearance()` in the browser console to inspect the current state

## GitHub Pages Deployment Notes

To make sure dark mode works after publishing:

1. **Cache-busting is enabled** — `style.css` and all `.js` files are loaded with
   a `?v=YYYYMMDD` query string. Bump the version when you push an update.
2. **Hard-refresh after deploy** — `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   the first time you open the new version.
3. **Verify with `debugAppearance()`** — opens DevTools console and shows the
   current theme, html attribute, html class, body class, and localStorage value.

## Features

- 🌗 Light / Dark appearance
- 📊 Auto-detect Excel columns (multi-sheet, multi-format)
- 🎨 Color and B&W chart modes
- ⏱️ X-axis guaranteed start + end from Excel
- ⏳ Total Duration in the chart summary
- 📈 4-column summary: Criteria · Max · Min · Duration
- 🎯 Modern quick actions (Full Result / Last 24H)
- 🖨️ Print → A4 landscape one page (always light)
- 🖼️ Export PNG — 1123×794 @ 3× chart DPR
- 📄 Export PDF — direct A4 landscape
- 🔁 Repeat exports stay identical
