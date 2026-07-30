import type { CarbonChartTokens } from '../tokens'
import type { CarbonPalettes } from '../palettes'
import { alertColors } from '../palettes'

/**
 * IBM Plex Sans font stack — identical to Carbon Charts' $font-family token
 * resolved from @carbon/type font-family('sans').
 * Load the font via @ibm/plex or a CDN <link> in your app shell; this package
 * does not bundle the font files.
 */
export const IBM_PLEX_FONT_FAMILY = '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif' as const

/**
 * IBM Plex Sans Condensed — matches Carbon Charts' $font-family-condensed token.
 * Used for axis tick labels when horizontal space is constrained.
 */
export const IBM_PLEX_FONT_FAMILY_CONDENSED =
  '"IBM Plex Sans Condensed", "Helvetica Neue", Arial, sans-serif' as const

/**
 * Builds an ECharts theme object from Carbon tokens and palettes.
 * All four Carbon themes (white, g10, g90, g100) are generated through
 * this factory — only the token values and palette variant differ.
 */
export function buildTheme(t: CarbonChartTokens, palettes: CarbonPalettes) {
  return {
    // ── Palette ──────────────────────────────────────────────────────
    color: [...palettes.categorical],
    backgroundColor: t.background,

    // ── Global text ──────────────────────────────────────────────────
    textStyle: {
      fontFamily: IBM_PLEX_FONT_FAMILY,
      fontSize: 12,
      fontWeight: 'normal' as const,
      color: t.textPrimary,
    },

    // ── Title ────────────────────────────────────────────────────────
    title: {
      textStyle: {
        fontSize: 14,
        fontWeight: '600' as const,
        color: t.textPrimary,
      },
      subtextStyle: {
        fontSize: 12,
        color: t.textSecondary,
      },
    },

    // ── Legend ───────────────────────────────────────────────────────
    legend: {
      textStyle: {
        fontSize: 12,
        color: t.textSecondary,
      },
      pageTextStyle: {
        color: t.textSecondary,
      },
      inactiveColor: t.textDisabled,
    },

    // ── Tooltip ──────────────────────────────────────────────────────
    tooltip: {
      backgroundColor: t.layer01,
      borderColor: t.borderSubtle01,
      borderWidth: 1,
      textStyle: {
        fontSize: 12,
        color: t.textPrimary,
      },
      extraCssText: 'box-shadow: 0 2px 6px rgba(0,0,0,.20);',
    },

    // ── Axes ─────────────────────────────────────────────────────────
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: { color: t.borderSubtle01, width: 1 },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
        color: t.textSecondary,
        margin: 8,
      },
      splitLine: {
        show: false,
      },
      splitArea: { show: false },
    },

    valueAxis: {
      axisLine: {
        show: false,
      },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 12,
        color: t.textSecondary,
        margin: 8,
      },
      splitLine: {
        show: true,
        lineStyle: { color: t.borderSubtle00, type: 'solid' as const, width: 1 },
      },
      splitArea: { show: false },
    },

    timeAxis: {
      axisLine: { show: true, lineStyle: { color: t.borderSubtle01, width: 1 } },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: t.textSecondary, margin: 8 },
      splitLine: { show: false },
      splitArea: { show: false },
    },

    logAxis: {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: t.textSecondary, margin: 8 },
      splitLine: { show: true, lineStyle: { color: t.borderSubtle00 } },
      splitArea: { show: false },
    },

    // ── Series defaults ──────────────────────────────────────────────
    line: {
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { width: 2 },
      emphasis: { lineStyle: { width: 3 } },
    },

    bar: {
      barMaxWidth: 48,
      itemStyle: { borderRadius: [0, 0, 0, 0] },
      emphasis: { itemStyle: { opacity: 0.7 } },
    },

    boxplot: {
      // barMaxWidth constrains the box body width (same API as bar series)
      barMaxWidth: 40,
      // itemStyle.color fills the box body; append '33' (20 % alpha) to the
      // first categorical token so the fill is semi-transparent, matching the
      // lightly shaded boxes rendered by Carbon Charts
      itemStyle: { color: `${palettes.categorical[0]}33` },
    },

    scatter: {
      symbol: 'circle',
      symbolSize: 8,
    },

    pie: {
      itemStyle: {
        borderWidth: 2,
        borderColor: t.background, // gap between slices = bg color
      },
      label: {
        fontSize: 12,
        color: t.textPrimary,
      },
    },

    // ── Data zoom ────────────────────────────────────────────────────
    dataZoom: {
      backgroundColor: t.layer01,
      fillerColor: t.layer02,
      handleStyle: { color: t.interactive, borderColor: t.interactive },
      moveHandleStyle: { color: t.interactive },
      textStyle: { color: t.textSecondary, fontSize: 11 },
      borderColor: t.borderSubtle01,
      dataBackground: {
        lineStyle: { color: t.borderStrong01 },
        areaStyle: { color: t.layer02, opacity: 0.4 },
      },
      selectedDataBackground: {
        lineStyle: { color: t.interactive },
        areaStyle: { color: t.interactive, opacity: 0.2 },
      },
    },

    // ── Visual map (heatmap / sequential) ────────────────────────────
    visualMap: {
      textStyle: { color: t.textSecondary, fontSize: 12 },
      inRange: {
        // Default to purple sequential; consumers override per chart
        color: palettes.sequential.purple,
      },
      outOfRange: { color: [t.borderSubtle01] },
      handleStyle: { color: t.interactive },
    },

    // ── Toolbox ──────────────────────────────────────────────────────
    toolbox: {
      iconStyle: {
        borderColor: t.textSecondary,
      },
      emphasis: {
        iconStyle: { borderColor: t.interactive },
      },
    },

    // ── Animation ────────────────────────────────────────────────────
    animation: true,
    animationDuration: 300,
    animationEasing: 'cubicOut' as const,
    animationDurationUpdate: 300,

    // ── Track B — ECharts-extended series (no Carbon Charts equivalent) ───────
    // These keys apply Carbon tokens automatically when users bring their own
    // data for chart types that exist in ECharts but not in Carbon Charts.

    sankey: {
      nodeStyle: { borderWidth: 0 },
      lineStyle: { color: 'gradient', opacity: 0.3 },
      label: { color: t.textPrimary, fontSize: 12 },
      emphasis: { lineStyle: { opacity: 0.6 } },
    },

    sunburst: {
      label: { color: t.textPrimary, fontSize: 12 },
      itemStyle: { borderWidth: 1, borderColor: t.background },
    },

    graph: {
      label: { color: t.textPrimary, fontSize: 12 },
      edgeLabel: { color: t.textSecondary, fontSize: 11 },
      lineStyle: { color: t.borderSubtle01, opacity: 0.6 },
      itemStyle: { borderColor: t.background, borderWidth: 1 },
    },

    funnel: {
      label: { color: t.textPrimary, fontSize: 12 },
      itemStyle: { borderColor: t.background, borderWidth: 2 },
    },

    parallel: {
      lineStyle: { opacity: 0.4, width: 1 },
    },

    themeRiver: {
      label: { color: t.textSecondary, fontSize: 11 },
    },

    candlestick: {
      itemStyle: {
        color: alertColors[3], // green60 — $support-success
        color0: alertColors[0], // red60  — $support-error
        borderColor: alertColors[3],
        borderColor0: alertColors[0],
        borderWidth: 1,
      },
    },

    // pictorialBar inherits 'bar' keys automatically — no override needed.
  } as const
}
