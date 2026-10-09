# Carbon ECharts Theme — Site Parity Plan

> **Status: ✅ Structure complete** — all pages exist, all nav items wired. Visual parity work ongoing; see `docs/08-chart-parity-gap-analysis.md` for per-chart status.

---

## Architectural decisions (implemented)

### Nav order — alphabetical ✅

The Chart types nav in `SiteLayout.tsx` follows Carbon Charts' alphabetical order. All planned page splits have been done:

- Donut / Pie → separate pages ✅
- Gauge / Meter → separate pages ✅
- Scatter / Bubble → separate pages ✅

### Stub pages ✅

Bullet, Choropleth, and Circlepack are stub pages (no direct ECharts equivalent).

### StackBlitz links — not implemented

The original plan was to replace the Carbon Charts live-render panel with a "View in Carbon Charts →" button linking to StackBlitz examples. This was not implemented; the comparison panels use a different approach per page.

---

## Page inventory

| Page                     | Route                   | Status  |
| ------------------------ | ----------------------- | ------- |
| Alluvial                 | `/alluvial`             | ✅      |
| Area                     | `/area`                 | ✅      |
| Bar                      | `/bar`                  | ✅      |
| Boxplot                  | `/boxplot`              | ✅      |
| Bubble                   | `/bubble`               | ✅      |
| Bullet                   | `/bullet`               | ✅ stub |
| Choropleth               | `/choropleth`           | ✅ stub |
| Circlepack               | `/circlepack`           | ✅ stub |
| Combo                    | `/combo`                | ✅      |
| Donut                    | `/donut`                | ✅      |
| Gauge                    | `/gauge`                | ✅      |
| Heatmap                  | `/heatmap`              | ✅      |
| Histogram                | `/histogram`            | ✅      |
| Line                     | `/line`                 | ✅      |
| Lollipop                 | `/lollipop`             | ✅      |
| Meter                    | `/meter`                | ✅      |
| Network Diagram          | `/network`              | ✅      |
| Pie                      | `/pie`                  | ✅      |
| Radar                    | `/radar`                | ✅      |
| Scatter                  | `/scatter`              | ✅      |
| Tree                     | `/tree`                 | ✅      |
| Treemap                  | `/treemap`              | ✅      |
| Word Cloud               | `/wordcloud`            | ✅      |
| Candlestick _(extended)_ | `/extended/candlestick` | ✅      |
| Funnel _(extended)_      | `/extended/funnel`      | ✅      |
| Gantt _(extended)_       | `/extended/gantt`       | ✅      |
| Graph _(extended)_       | `/extended/graph`       | ✅      |
| Parallel _(extended)_    | `/extended/parallel`    | ✅      |
| Sunburst _(extended)_    | `/extended/sunburst`    | ✅      |
| Theme River _(extended)_ | `/extended/themeriver`  | ✅      |

---

## Outstanding visual parity gaps

See `docs/08-chart-parity-gap-analysis.md` and `docs/09-visual-audit-report.md` for the full catalogue of known visual deltas, wrong data, and missing features per chart slot.
