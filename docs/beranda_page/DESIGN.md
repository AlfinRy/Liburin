---
name: Liburin iOS Design System
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#414753'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#717785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005cbb'
  primary: '#0059b5'
  on-primary: '#ffffff'
  primary-container: '#0071e3'
  on-primary-container: '#fcfbff'
  inverse-primary: '#abc7ff'
  secondary: '#006e28'
  on-secondary: '#ffffff'
  secondary-container: '#6ffb85'
  on-secondary-container: '#00732a'
  tertiary: '#884d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ab6200'
  on-tertiary-container: '#fffaf9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#00458f'
  secondary-fixed: '#72fe88'
  secondary-fixed-dim: '#53e16f'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#ffdcbf'
  tertiary-fixed-dim: '#ffb874'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3b00'
  background: '#fcf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-hero:
    fontFamily: Inter
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-1:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: '600'
    lineHeight: 41px
    letterSpacing: -0.02em
  headline-1-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-2:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-3:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-large:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-default:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  callout:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0em
  footnote:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  caption-1:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  caption-2:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 13px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-mobile: 0.75rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers a native Apple Human Interface Guidelines (HIG) aesthetic engineered specifically for Indonesian corporate leave, public holiday (*Tanggal Merah*), and collective leave (*Cuti Bersama*) optimization. 

The visual style is characterized by deep deference, structural clarity, and tactile digital restraint:
- **Deference to Content:** Chrome and ornamental elements are minimized. The UI steps back to foreground calendar heatmaps, leave quotas, and long-weekend bridge strategies.
- **Precision & Clarity:** Crisp typographic hierarchy, translucent systemic materials, and strict adherence to iOS spatial mechanics.
- **Local Nuance with Global Polish:** Native Indonesian calendar conventions (e.g., *Hari Kejepit*, *Cuti Bersama*, *Tanggal Merah*) are communicated through standardized HIG semantic signifiers rather than noisy celebratory decorations.

## Colors

The palette directly models iOS system color semantics, balancing clarity, functional signaling, and high legibility across dynamic light and dark operating modes.

### Structural Palettes
- **Light Mode Canvas:**
  - `systemBackground`: `#FFFFFF` (Primary window base)
  - `secondarySystemBackground`: `#F5F5F7` (Grouped table backgrounds, inset canvas)
  - `tertiarySystemBackground`: `#FFFFFF` (Elevated grouped cards and overlays)
  - `label`: `#1D1D1F` (Primary text and high-contrast iconography)
  - `secondaryLabel`: `#6E6E73` (Secondary metadata, hints, and subtitles)
  - `separator`: `#E5E5EA` (Hairline rules, structural cell borders)
  - `tintBlueSurface`: `#EBF5FF` (Subtle selection highlights, proactive recommendation fills)

- **Dark Mode Canvas:**
  - `systemBackground`: `#000000` (Pure OLED ground)
  - `secondarySystemBackground`: `#1C1C1E` (Grouped canvas, sheet base)
  - `tertiarySystemBackground`: `#2C2C2E` (Elevated cards and modal surfaces)
  - `label`: `#F5F5F7` (High-contrast text)
  - `secondaryLabel`: `#A1A1A6` (Secondary metadata and status tracks)
  - `separator`: `#38383A` (Dark hairlines and cell dividers)
  - `tintBlueSurface`: `#1A2E44` (Selection pills and container fills)

### Semantic & Domain Indicators
- **Accent Blue (`#0071E3` / Dark: `#0A84FF`):** Action items, primary interactive buttons, leave recommendations, and system selections.
- **Success / Cuti Bersama (`#34C759`):** Approved PTO, government-mandated shared leaves, positive bridge days (*rekomendasi cuti*).
- **Warning / Tanggal Merah (`#FF9500`):** National statutory holidays, critical quota alerts, high-demand travel thresholds.

## Typography

Typography prioritizes high density, legibility, and tabular metric scanning. The system relies on `Inter` with system-fallback chains to `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text"`.

### Rules & Formatting
- **Tight Display Tracking:** Display and large headlines must apply negative tracking (`-0.015em` to `-0.03em`) to replicate native iOS title rendering.
- **Tabular Numeric Figures (`tnum`):** All leave counters, date badges, balance quotas (e.g., `12 / 12 Hari`), and calendar cells must strictly enable `font-variant-numeric: tabular-nums` to eliminate layout jitter during date shifts.
- **Label Formatting:** Small metadata caps (e.g., month subheadings, badge categories) use `caption-2` with `letterSpacing: 0.02em` in uppercase styling.

## Layout & Spacing

The layout is built upon an 8-point base grid (subdivided to 4-point for micro-alignments) conforming to iOS standard inset-grouped specifications.

### Viewport Structures
- **Mobile (< 768px):** Single-column layout. Margin default is `1rem` (16px) with dynamic viewport edge insets safe-guarded by iOS `env(safe-area-inset-*)`. Grouped lists and cards leverage edge-to-edge card bounds with 16px lateral padding.
- **Tablet / Desktop (≥ 768px):** Multi-column split views (Navigation Master-Detail / Side-by-side calendar and leave pipeline). Margins expand to `1.5rem` (24px) or `2rem` (32px), with a max-width content container set to `1024px` for planner views.

### Rhythmic Principles
- Stacked related controls use `space-xs` (4px) or `space-sm` (8px).
- Internal card padding is uniformly `space-md` (16px).
- Vertical stack spacing between distinct functional groupings (e.g., Upcoming Holidays vs. Recommended Hacks) adheres strictly to `space-lg` (24px) or `space-xl` (32px).

## Elevation & Depth

Visual hierarchy is maintained through subtle, diffused ambient occlusion rather than heavy drop shadows, paired with translucent frosted glass materials (`UIVisualEffectView`).

### Surface Hierarchy
1. **Canvas (Base Level):** `secondarySystemBackground`. Receded, un-elevated surface for grouped sections.
2. **Elevated Card Surface:** `tertiarySystemBackground` with soft ambient illumination:
   - Primary: `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 20px rgba(0, 0, 0, 0.04);`
   - Dark Mode: Surface color difference (`#2C2C2E`) over (`#1C1C1E`) plus a 1px border (`rgba(255, 255, 255, 0.08)`) with zero shadow.
3. **Floating Navigation & Tab Bars:** Translucent material backing (`backdrop-filter: blur(20px) saturate(180%)`) with `rgba(255, 255, 255, 0.75)` in light mode and `rgba(28, 28, 30, 0.75)` in dark mode, accompanied by a `0.5px` border line aligned to the device pixel grid.
4. **Modals & Action Sheets:** Layered sheet cards using high-radius contours elevated by `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12)`.

## Shapes

The interface embraces Apple's classic squircle / continuous curvature profile across all containers and interactives.

- **Primary Cards & Modals:** `16px` corner radius (`rounded-lg` equivalent) using continuous smoothing (`corner-smoothing: 60%`).
- **Interactive Controls (Inputs, Segmented Controls, Steppers):** `12px` corner radius (`0.75rem`).
- **Pills, Action Buttons, and Badges:** `9999px` fully rounded pill geometry.
- **Calendar Day Matrix Cells:** `10px` roundedness to provide soft, readable focus states without turning into complete circles.

## Components

### Buttons
- **Primary Pill:** Background `primary_color_hex` (`#0071E3`), text `#FFFFFF`, height 48px (large) or 36px (compact), corner radius `9999px`. Bold typography (`callout`). Active state reduces opacity to `0.8` with micro-scale transform (`0.98`).
- **Secondary / Tinted Button:** Background `tintBlueSurface` (`#EBF5FF` / `#1A2E44`), text `#0071E3` (`#0A84FF`), corner radius `9999px`.
- **Destructive:** Background `#FF3B30` or soft `#FF3B301A` fill with `#FF3B30` label.

### Chips & Status Badges
- Fully rounded pills (`9999px`), height 24px, horizontal padding 10px.
- **Tanggal Merah Badge:** Background `rgba(255, 149, 0, 0.12)`, text `#FF9500`, typography `caption-2`.
- **Cuti Bersama Badge:** Background `rgba(52, 199, 89, 0.12)`, text `#34C759`, typography `caption-2`.
- **Rekomendasi Bridge Badge:** Background `rgba(0, 113, 227, 0.12)`, text `#0071E3`, typography `caption-2`.

### Cards & Grouped Containers
- Inset card pattern with `16px` border-radius, `space-md` (16px) internal padding, and surface fill matching `tertiarySystemBackground`.
- Hairline top/bottom separators (`0.5px solid separator`) when stacked in grouped list modes without shadows.

### Lists & Inset Table Views
- Cells height 44px (standard) or 60px (subtitle/detailed).
- 0.5px inset divider positioned matching the title leading inset (typically 16px left indentation).
- Disclosure chevron (`chevron.right`) styled in `secondaryLabel`.

### Checkboxes, Switches & Radio Controls
- **Switches:** Classic iOS layout (51x31px), track tint `#34C759` when active, `#E5E5EA` (`#38383A` dark) when inactive.
- **Radio / Selection Rings:** Smooth 20px circle with 2px stroke and primary blue inner fill when selected.

### Input Fields
- Height 44px, corner radius 12px. Background `secondarySystemBackground`. Text color `label`, placeholder color `secondaryLabel`. Focused state introduces a crisp 1.5px `#0071E3` outer rim.

### Domain-Specific Components
- **Leave Bridge Recommendation Card (*Kartu Rekomendasi Libur*):** Displays calculated bridge strategy (e.g., "Ambil 1 Hari Cuti, Dapat 4 Hari Libur"). Contains an integrated visual mini-timeline showing Friday (Cuti), Saturday (Weekend), Sunday (Weekend), and Monday (Tanggal Merah), with days connected by a subtle 2px bridge line.
- **Calendar Day Grid Cell:** Standard 36x36px bounding box. Inactive days render `secondaryLabel`; holiday dates display a distinct amber or green bottom pip (4px diameter); selected user leave displays a solid `#0071E3` circular backdrop with white tabular numeral.