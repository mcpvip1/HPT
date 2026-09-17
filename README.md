HPT
# Temperature Test Report · Pro

A quadrilingual (EN / 中文 / ไทย / မြန်မာ) dashboard for analysing
temperature-sensor Excel exports.

## Latest Fix

**X-axis start and end labels now match the exact timestamps from the Excel file.**
- The leftmost label always shows the first timestamp from the data.
- The rightmost label always shows the last timestamp from the data.
- Intermediates are evenly spaced and never collide.

## Features

- 📊 **Auto-detect Excel columns** — multi-sheet, multi-format
- 🎨 **Dual chart modes** — Color and B&W
- ⏱️ **X-axis guaranteed start + end** from Excel
- ⏳ **总时长 Total Duration** in the chart summary
- 📈 **4-column summary** — Criteria · Max · Min · Duration
- 🎯 **Modern quick actions** — Full Result / Last 24H with icons
- 🖨️ **Print** — native browser print → A4 landscape one page
- 🖼️ **Export PNG** — high-res 1123×794 with 3× chart DPR
- 📄 **Export PDF** — direct A4 landscape PDF
- 🔁 **Repeat exports stay identical** — canvas replaced every time
