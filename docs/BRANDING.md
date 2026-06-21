# BRANDING.md - Animarr Visual Identity

## Product Name

**Animarr**
- Anime-focused media management
- Fork of Sonarr v5-develop

## Color Palette (Implemented)

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Magenta | #D946EF | Primary brand color, buttons, links, accents |
| Purple | #A855F7 | Secondary accent, headers, hover states |
| Pink | #EC4899 | Tertiary accent, badges, highlights |
| Highlight | #F472B6 | Subtle highlights, decorative elements |
| Dark Background | #18181B | Dark theme background, sidebar |

### Colors Avoided

| Color | Association |
|-------|-------------|
| #35c5f4 (Sonarr Blue) | Sonarr - NOT USED |
| #2193b5 (Sonarr Alt Blue) | Sonarr - NOT USED |
| #5d9cec (Radarr Blue) | Radarr - NOT USED |

## Typography

- **Primary Font:** System default (via normalize.css)
- **Monospace:** For code/logs
- **Headings:** Bold, clean sans-serif

## Asset Inventory

### Logo Files

| Asset Path | Dimensions | File Type | Usage Location | Status |
|------------|------------|-----------|----------------|--------|
| `frontend/src/Content/Images/logo.svg` | Scalable | SVG | Header, Sidebar, Login | **COMPLETE** |
| `Logo/Animarr.svg` | Scalable | SVG | Master source | **COMPLETE** |
| `Logo/animarr-simple.svg` | Scalable | SVG | Simplified variant | **COMPLETE** |
| `Logo/1024.png` | 1024x1024 | PNG | Master source | **COMPLETE** |
| `Logo/800.png` | 800x800 | PNG | Master source | **COMPLETE** |
| `Logo/512.png` | 512x512 | PNG | Master source | **COMPLETE** |
| `Logo/400.png` | 400x400 | PNG | Master source | **COMPLETE** |
| `Logo/256.png` | 256x256 | PNG | README, docs | **COMPLETE** |
| `Logo/128.png` | 128x128 | PNG | Various | **COMPLETE** |
| `Logo/96-Outline-White.png` | 96x96 | PNG | Outline variant | **COMPLETE** |
| `Logo/72.png` | 72x72 | PNG | Various | **COMPLETE** |
| `Logo/64.png` | 64x64 | PNG | Embedded resource | **COMPLETE** |
| `Logo/48.png` | 48x48 | PNG | Various | **COMPLETE** |
| `Logo/32.png` | 32x32 | PNG | Various | **COMPLETE** |
| `Logo/16.png` | 16x16 | PNG | Various | **COMPLETE** |

### Favicon Assets

| Asset Path | Dimensions | File Type | Usage Location | Status |
|------------|------------|-----------|----------------|--------|
| `frontend/src/Content/Images/Icons/favicon.ico` | Multi-size | ICO | Browser tab | **COMPLETE** |
| `frontend/src/Content/Images/Icons/favicon-debug.ico` | Multi-size | ICO | Debug mode | **COMPLETE** |
| `frontend/src/Content/Images/Icons/favicon-32x32.png` | 32x32 | PNG | Browser tab | **COMPLETE** |
| `frontend/src/Content/Images/Icons/favicon-16x16.png` | 16x16 | PNG | Browser tab | **COMPLETE** |
| `frontend/src/Content/Images/Icons/favicon-debug-32x32.png` | 32x32 | PNG | Debug mode | **COMPLETE** |
| `frontend/src/Content/Images/Icons/favicon-debug-16x16.png` | 16x16 | PNG | Debug mode | **COMPLETE** |
| `frontend/src/Content/Images/Icons/apple-touch-icon.png` | 180x180 | PNG | iOS home screen | **COMPLETE** |
| `frontend/src/Content/Images/Icons/android-chrome-192x192.png` | 192x192 | PNG | Android/Chrome | **COMPLETE** |
| `frontend/src/Content/Images/Icons/android-chrome-512x512.png` | 512x512 | PNG | Android/Chrome | **COMPLETE** |
| `frontend/src/Content/Images/Icons/safari-pinned-tab.svg` | Scalable | SVG | Safari pinned tab | **COMPLETE** |
| `frontend/src/Content/Images/Icons/mstile-70x70.png` | 70x70 | PNG | Windows tile | **COMPLETE** |
| `frontend/src/Content/Images/Icons/mstile-144x144.png` | 144x144 | PNG | Windows tile | **COMPLETE** |
| `frontend/src/Content/Images/Icons/mstile-150x150.png` | 150x150 | PNG | Windows tile | **COMPLETE** |
| `frontend/src/Content/Images/Icons/mstile-310x150.png` | 310x150 | PNG | Windows tile (wide) | **COMPLETE** |
| `frontend/src/Content/Images/Icons/mstile-310x310.png` | 310x310 | PNG | Windows tile (large) | **COMPLETE** |

### Other Image Assets

| Asset Path | Dimensions | File Type | Usage Location | Status |
|------------|------------|-----------|----------------|--------|
| `frontend/src/Content/Images/404.png` | - | PNG | 404 error page | Keep (no branding) |
| `frontend/src/Content/Images/error.png` | - | PNG | Error boundary | Keep (no branding) |
| `frontend/src/Content/Images/poster-dark.png` | - | PNG | Dark poster placeholder | Keep (no branding) |
| `frontend/src/Content/Images/thetvdb-dark.png` | - | PNG | TheTVDB logo | Keep (third-party) |
| `frontend/src/Content/Images/thetvdb-light.png` | - | PNG | TheTVDB logo | Keep (third-party) |

### Backend Icons

| Asset Path | Dimensions | File Type | Usage Location | Status |
|------------|------------|-----------|----------------|--------|
| `src/NzbDrone.Host/Animarr.ico` | Multi-size | ICO | Windows app icon | **COMPLETE** |
| `src/ServiceHelpers/ServiceInstall/green_puzzle.ico` | - | ICO | Service installer | Keep (generic) |
| `src/ServiceHelpers/ServiceUninstall/red_puzzle.ico` | - | ICO | Service uninstaller | Keep (generic) |

### Distribution Assets

| Asset Path | Dimensions | File Type | Usage Location | Status |
|------------|------------|-----------|----------------|--------|
| `distribution/macOS/Sonarr.app/Contents/Resources/animarr.icns` | Multi-size | ICNS | macOS app icon | **COMPLETE** |
| `distribution/windows/setup/inno/WizModernImage.bmp` | 164x314 | BMP | Installer wizard | **COMPLETE** |
| `distribution/windows/setup/inno/WizModernSmallImage.bmp` | 55x55 | BMP | Installer wizard small | **COMPLETE** |

## Config Files Updated

| File | Change | Status |
|------|--------|--------|
| `frontend/src/Content/manifest.json` | theme_color, background_color | **UPDATED** |
| `frontend/src/Content/browserconfig.xml` | TileColor | **UPDATED** |
| `frontend/src/index.ejs` | theme-color, msapplication-navbutton-color | **UPDATED** |
| `frontend/src/login.html` | theme-color, msapplication-navbutton-color | **UPDATED** |

## Icon Concept

### Design Elements
- **Shape:** Sonarr-derived circular design with crosshair
- **Colors:** Magenta→Purple→Pink gradient
- **Crosshair:** Pink accent (#EC4899)
- **Inner circle:** Dark background (#18181B)
- **Style:** Modern, clean, anime-inspired

### Variants
1. **Full Color** - Gradient version for standard use
2. **White Outline** - For dark backgrounds (96-Outline-White.png)
3. **Monochrome** - Black silhouette for Safari pinned tab
4. **Simplified** - Single-color for small sizes

## Visual Style

### Design Principles

1. **Modern** - Clean lines, flat design with subtle shadows
2. **Clean** - Minimalist, lots of whitespace
3. **Slightly Kawaii** - Subtle anime-inspired touches
4. **Professional** - Not childish, suitable for media management
5. **Accessible** - Good contrast, readable fonts

### UI Elements

- **Headers:** Purple (#A855F7) background
- **Sidebars:** Dark (#18181B) background
- **Buttons:** Magenta (#D946EF) primary, Purple (#A855F7) hover
- **Links:** Magenta (#D946EF)
- **Cards:** Zinc gray tones (#3F3F46, #27272A)
- **Icons:** FontAwesome (existing)

## Naming Decisions

| Context | Old | New |
|---------|-----|-----|
| Product Name | Sonarr | Animarr |
| Theme Variable | sonarrBlue | animarrMagenta |
| CSS Variable | --sonarrBlue | --animarrMagenta |
| Global Object | window.Sonarr | window.Animarr (Phase 2) |

## Files Modified in Phase 1A

| File | Changes |
|------|---------|
| `frontend/src/index.ejs` | Title, meta description, theme-color, pageBackground |
| `frontend/src/login.html` | Title, meta description, theme-color, copyright, theme colors |
| `frontend/src/Components/Page/Header/PageHeader.tsx` | Logo alt text |
| `frontend/src/Components/Page/Sidebar/PageSidebar.tsx` | Logo alt text |
| `frontend/src/Components/Page/LoadingPage.tsx` | Base64 logo, variable name |
| `frontend/src/Components/Loading/LoadingMessage.tsx` | Easter egg text |
| `frontend/src/Styles/Themes/dark.js` | Complete color palette rewrite |
| `frontend/src/Styles/Themes/light.js` | Complete color palette rewrite |
| `frontend/src/Components/Page/Sidebar/PageSidebar.css` | CSS variable name |
| `frontend/src/Series/Index/Select/SeriesIndexPosterSelect.css` | CSS variable name |
| `frontend/src/Content/Images/logo.svg` | New Animarr logo |
| `frontend/src/Content/manifest.json` | Theme colors |
| `frontend/src/Content/browserconfig.xml` | Tile color |

## Files Modified in Phase 1B

### Generated Assets (29 files)
- 12 Logo PNGs in `Logo/`
- 2 Logo SVGs in `Logo/`
- 15 Favicon files in `frontend/src/Content/Images/Icons/`
- 1 Backend ICO in `src/NzbDrone.Host/`

### Removed Files (3 files)
- `Logo/Sonarr.svg`
- `Logo/sonarr-simple.svg`
- `src/NzbDrone.Host/Sonarr.ico`

### Generated By
- `scripts/generate-assets.js` (Sharp 0.35.2)
- `scripts/fix-assets.js` (cleanup)
