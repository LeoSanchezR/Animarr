# CHANGES.md - Animarr Development Log

## Chronological Development Log

### 2026-06-20 - Phase 1C: Distribution Assets and Cleanup

**Status:** Complete

#### Distribution Assets Generated
- Created `scripts/generate-distribution-assets.py` using Pillow 12.1.1
- Generated macOS ICNS file from Logo/1024.png
- Generated Windows installer BMP images

#### macOS Icon
- Created `distribution/macOS/Sonarr.app/Contents/Resources/animarr.icns` (274KB)
- Removed old `sonarr.icns`
- Updated `Info.plist`:
  - CFBundleName: "Animarr"
  - CFBundleIconFile: "animarr.icns"
  - CFBundleIdentifier: "com.osx.animarr.tv"

#### Windows Installer Images
- Created `WizModernImage.bmp` (164×314) - wizard sidebar
- Created `WizModernSmallImage.bmp` (55×55) - small corner
- Updated `sonarr.iss`:
  - AppName: "Animarr"
  - AppPublisher: "Team Animarr"
  - OutputBaseFilename: "Animarr..."
  - Description: "Open Animarr Web UI"

#### User-Facing Files Updated
- `package.json`: name, description, repository, author
- `distribution/debian/sonarr.service`: Description, User, Group
- `distribution/debian/install.sh`: app name, download URL
- `CLA.md`: title
- `SECURITY.md`: email
- `FUNDING.yml`: open_collective
- `.devcontainer/devcontainer.json`: name
- `.vscode/launch.json`: name
- `.editorconfig`: description
- `.gitattributes`: path
- `.gitignore`: patterns
- `CONTRIBUTING.md`: references
- `.github/PULL_REQUEST_TEMPLATE.md`: link
- `.github/ISSUE_TEMPLATE/config.yml`: Reddit link
- `.github/ISSUE_TEMPLATE/bug_report.yml`: version label
- `frontend/src/FirstRun/AuthenticationRequiredModalContent.tsx`: helpLink
- `frontend/src/AddSeries/AddNewSeries/AddNewSeries.tsx`: helpLink
- `frontend/src/login.html`: helpLink

#### Build Verification
- Frontend build: **SUCCESS** (webpack 5.105.2 compiled in 16.6s)
- Output: `_output/UI/`
- No errors or warnings

---

### 2026-06-20 - Phase 1B: Logo and Icon Replacement

**Status:** Complete

#### Asset Generation
- Created `scripts/generate-assets.js` using Sharp 0.35.2
- Generated all assets from `frontend/src/Content/Images/logo.svg`
- Used cairosvg (Python) for SVG rendering where needed

#### Logo PNGs Generated (12 files in `Logo/`)
| File | Dimensions | Size |
|------|------------|------|
| `1024.png` | 1024×1024 | 89KB |
| `800.png` | 800×800 | 62KB |
| `512.png` | 512×512 | 34KB |
| `400.png` | 400×400 | 24KB |
| `256.png` | 256×256 | 14KB |
| `128.png` | 128×128 | 7KB |
| `96-Outline-White.png` | 96×96 | 4KB |
| `72.png` | 72×72 | 4KB |
| `64.png` | 64×64 | 3KB |
| `48.png` | 48×48 | 2KB |
| `32.png` | 32×32 | 2KB |
| `16.png` | 16×16 | 1KB |

#### Logo SVGs Generated (2 files in `Logo/`)
- `Animarr.svg` - Full gradient version (2.7KB)
- `animarr-simple.svg` - Simplified variant (2.4KB)

#### Favicon Files Generated (15 files in `frontend/src/Content/Images/Icons/`)
| File | Dimensions | Size |
|------|------------|------|
| `favicon.ico` | Multi-size | 25KB |
| `favicon-debug.ico` | Multi-size | 25KB |
| `favicon-32x32.png` | 32×32 | 2KB |
| `favicon-16x16.png` | 16×16 | 1KB |
| `favicon-debug-32x32.png` | 32×32 | 2KB |
| `favicon-debug-16x16.png` | 16×16 | 1KB |
| `apple-touch-icon.png` | 180×180 | 9KB |
| `android-chrome-192x192.png` | 192×192 | 10KB |
| `android-chrome-512x512.png` | 512×512 | 34KB |
| `safari-pinned-tab.svg` | Scalable | 2KB |
| `mstile-70x70.png` | 70×70 | 4KB |
| `mstile-144x144.png` | 144×144 | 8KB |
| `mstile-150x150.png` | 150×150 | 8KB |
| `mstile-310x150.png` | 310×150 | 8KB |
| `mstile-310x310.png` | 310×310 | 18KB |

#### Backend Icon
- Created `src/NzbDrone.Host/Animarr.ico` (25KB, multi-size)
- Removed old `Sonarr.ico`

#### Old Files Removed
- `Logo/Sonarr.svg`
- `Logo/sonarr-simple.svg`
- `src/NzbDrone.Host/Sonarr.ico`

#### Asset Design
- **Primary:** Magenta gradient (#D946EF → #A855F7 → #EC4899)
- **Crosshair:** Pink (#EC4899) accent
- **Inner circle:** Dark (#18181B) background
- **Safari pinned tab:** Monochrome black silhouette
- **White outline variant:** For dark backgrounds

#### Build Verification
- Frontend build: **SUCCESS** (webpack 5.105.2 compiled in 16.3s)
- Output: `_output/UI/`
- All 29 assets emitted correctly
- No errors or warnings

---

### 2026-06-20 - Phase 1A: Branding Implementation

**Status:** Complete

#### Browser Branding
- Changed `<title>` from "Sonarr" to "Animarr" in `index.ejs`
- Changed `<title>` from "Login - Sonarr" to "Login - Animarr" in `login.html`
- Updated `<meta name="description">` to "Animarr"
- Updated `theme-color` and `msapplication-navbutton-color` to `#18181B`
- Updated safari mask-icon color to `#D946EF`

#### Login Screen
- Replaced copyright text "Sonarr" with "Animarr"
- Updated login theme colors to Animarr palette
- Primary buttons: Magenta (#D946EF)
- Hover states: Purple (#A855F7)
- Dark background: #18181B

#### Header & Sidebar Branding
- Updated logo alt text from "Sonarr Logo" to "Animarr Logo"
- Created new Animarr logo SVG with gradient (Magenta → Purple → Pink)
- Updated `logo.svg` in `Content/Images/`

#### Theme Customization
- **Dark Theme (`dark.js`):**
  - Replaced `sonarrBlue` (#35c5f4) with `animarrMagenta` (#D946EF)
  - Added `animarrPurple` (#A855F7), `animarrPink` (#EC4899)
  - Updated all theme colors to Zinc-based dark palette
  - Header/sidebar backgrounds: #27272A
  - Page background: #18181B

- **Light Theme (`light.js`):**
  - Same color variable replacements
  - Header: Purple (#A855F7)
  - Sidebar: Dark (#18181B)
  - Primary actions: Magenta (#D946EF)

#### CSS Variable Updates
- Updated `--sonarrBlue` to `--animarrMagenta` in:
  - `PageSidebar.css`
  - `SeriesIndexPosterSelect.css`

#### Loading Page
- Updated base64 logo to new Animarr design
- Renamed variable `sonarrLogo` → `animarrLogo`
- Updated easter egg: "Previously on Sonarr..." → "Previously on Animarr..."

#### Config Files
- `manifest.json`: theme_color, background_color → #18181B
- `browserconfig.xml`: TileColor → #D946EF

#### Asset Discovery
- Documented all 35+ logo/favicon assets in `BRANDING.md`
- Identified assets needing replacement (Phase 1B)

#### Build Verification
- Frontend build: **SUCCESS** (webpack 5.105.2 compiled in 17.8s)
- Output: `_output/UI/`
- No errors or warnings related to branding changes

---

### 2026-06-20 - Project Initialization

- Cloned Sonarr v5-develop branch as base for Animarr
- Created documentation structure under `/docs/`
- Performed complete branding audit
- Identified all Sonarr references across codebase

#### Branding Audit Findings

**Total files with branding references:** 100+

**Categories identified:**
1. Frontend UI/Visual (SAFE) - ~30 files
2. Frontend API contract (RISKY) - ~15 files
3. Backend C# source (RISKY) - 200+ files
4. Project/solution files (RISKY) - 30+ files
5. Distribution/packaging (RISKY) - 20+ files
6. Documentation (SAFE) - 10+ files
7. Logo/icon assets (SAFE - replace) - 35+ files

See [BRANDING.md](BRANDING.md) for complete details.

---

## Modified Files (Phase 1A)

| File | Changes |
|------|---------|
| `frontend/src/index.ejs` | Title, meta, theme-color, pageBackground |
| `frontend/src/login.html` | Title, meta, theme-color, copyright, theme colors |
| `frontend/src/Components/Page/Header/PageHeader.tsx` | Logo alt text |
| `frontend/src/Components/Page/Sidebar/PageSidebar.tsx` | Logo alt text |
| `frontend/src/Components/Page/LoadingPage.tsx` | Base64 logo, variable name |
| `frontend/src/Components/Loading/LoadingMessage.tsx` | Easter egg text |
| `frontend/src/Styles/Themes/dark.js` | Complete color palette |
| `frontend/src/Styles/Themes/light.js` | Complete color palette |
| `frontend/src/Components/Page/Sidebar/PageSidebar.css` | CSS variable |
| `frontend/src/Series/Index/Select/SeriesIndexPosterSelect.css` | CSS variable |
| `frontend/src/Content/Images/logo.svg` | New Animarr logo |
| `frontend/src/Content/manifest.json` | Theme colors |
| `frontend/src/Content/browserconfig.xml` | Tile color |

---

## Pending Changes

### Phase 1C: Distribution Assets and Cleanup (Complete)
- [x] Generate macOS animarr.icns
- [x] Generate Windows installer BMP images
- [x] Update README.md branding
- [x] Update package.json metadata
- [x] Update distribution scripts
- [x] Update user-facing config files
- [x] Update documentation

### Phase 2: Backend Branding (Future)
- [ ] Rename window.Sonarr → window.Animarr
- [ ] Update X-Sonarr-Client header
- [ ] Update appName token
- [ ] Rename assemblies/namespaces

### Phase 2: Backend Branding (Future)
- [ ] Rename window.Sonarr → window.Animarr
- [ ] Update X-Sonarr-Client header
- [ ] Update appName token
- [ ] Rename assemblies/namespaces
