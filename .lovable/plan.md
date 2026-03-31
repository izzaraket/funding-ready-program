

# Rebrand App to YAMM (#f50068)

## What We'll Do
Replace all green branding with YAMM's pink `#f50068`, swap favicons, add YAMM logo with link to yammservices.com across all pages.

## Steps

### 1. Replace favicon and add brand assets
- **Delete** `public/favicon.ico`
- **Copy** uploaded files to `public/`: `favicon.ico`, `favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`, `site.webmanifest`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`
- **Copy** `YAMM_LOGO_03.png` to `public/yamm-logo.png`

### 2. Update `index.html`
- Replace favicon link with new references (favicon.ico, favicon.svg, apple-touch-icon, webmanifest)
- Remove old lovable-uploads favicon reference
- Update OG/Twitter images to use YAMM logo

### 3. Update `src/index.css` — Primary color swap
- Change `--primary` from `142 76% 36%` (green) to `338 100% 48%` (pink `#f50068`)
- Update `--ring`, `--hero-bg`, `--success`, `--progress-fill`, `--band-high` to match
- Update `.band-high` from `green-100/800/200` to `pink-100/800/200`
- Update `.bar-high` from `bg-green-500` to pink equivalent
- Same changes in dark mode

### 4. Create `src/components/Header.tsx`
- Shared header with YAMM logo linking to `https://yammservices.com` (opens new tab)
- Clean, minimal design

### 5. Add Header to all pages
- `Index.tsx`, `Checklist.tsx`, `Results.tsx`, `EmailCapture.tsx` — import and render `<Header />` at top

### 6. Fix hardcoded green classes
- `Index.tsx`: `bg-primary/10` etc. already use CSS vars (no change needed)
- `BarMeter.tsx`, `BandChip.tsx`: update any hardcoded `green-*` classes to use brand pink

## Technical Notes
- `#f50068` → HSL `338 100% 48%`
- Since the app uses CSS custom properties for primary color, most components auto-update
- Only hardcoded Tailwind green classes (in band/bar components and index.css) need manual updates

