# LEARNINGS.md - Animarr Technical Discoveries

## Problems Encountered

### 1. Complex Branding Distribution
- **Problem:** Sonarr branding is deeply embedded across 100+ files in both frontend and backend
- **Root Cause:** Sonarr uses consistent naming throughout (window.Sonarr, X-Sonarr-Client, Sonarr.* assemblies)
- **Solution:** Phased approach - Phase 1 focuses only on visual/UI changes

### 2. Backend API Contract Dependencies
- **Problem:** `window.Sonarr` global object is injected by backend and used in 40+ frontend files
- **Root Cause:** Backend serves configuration via `window.Sonarr = {...}` in index.ejs
- **Solution:** Defer to Phase 2 - requires coordinated frontend+backend changes

### 3. Localization Key Complexity
- **Problem:** 45 language files contain "Sonarr" in key names (e.g., `RestartSonarr`, `SonarrTags`)
- **Root Cause:** Keys are used by translate() function with `{appName}` token substitution
- **Solution:** Only change `appName` token value, not key names (Phase 1)

### 4. Windows Build ICO Compatibility
- **Problem:** Removing `Sonarr.ico` broke Windows backend build (`src/NzbDrone/Sonarr.csproj` references it)
- **Root Cause:** Windows `.csproj` and `Resources.resx` files hardcode `Sonarr.ico` path for `ApplicationIcon` and embedded resources
- **Solution:** Keep `Animarr.ico` as primary branding, copy to `Sonarr.ico` for legacy build compatibility

### 5. Import Sorting with simple-import-sort
- **Problem:** Adding `Link` import between `Label` and `IconButton` broke alphabetical import order
- **Root Cause:** `simple-import-sort/imports` enforces alphabetical ordering by full import path (`Components/Link/IconButton` < `Components/Link/Link`)
- **Solution:** Always sort imports alphabetically; use `yarn lint-fix` to auto-correct

## Technical Discoveries

### 1. Theme System
- Theme colors defined in `frontend/src/Styles/Themes/dark.js` and `light.js`
- CSS variables generated from these JS files
- `sonarrBlue` (#35c5f4) used in multiple theme properties
- Can be safely renamed to `animarrBlue` without functional impact

### 2. Logo Embedding
- `Logo/64.png` embedded as resource in `Sonarr.Core.csproj`
- Used as runtime icon for system tray and notifications
- Must be replaced in both Logo/ directory AND csproj reference

### 3. Loading Page
- `LoadingPage.tsx` contains base64-encoded SVG logo
- Must be regenerated with Animarr branding
- Only displayed during initial app load

### 4. Build Output
- Frontend builds to `_output/UI/`
- Backend serves static files from this directory
- Logo files must be in correct paths relative to `_output/UI/`

## Asset Pipeline Discoveries

### 1. Sharp for Asset Generation
- **Finding:** Sharp 0.35.2 can render SVGs to PNGs at any size
- **Usage:** `sharp(svgBuffer).resize(size, size).png().toFile(outputPath)`
- **ICO Creation:** Sharp can create ICO from PNG buffers via Pillow fallback
- **Benefit:** Single source (logo.svg) generates all asset sizes

### 2. SVG Source Requirements
- **Finding:** SVGs must use explicit `width` and `height` attributes for Sharp rendering
- **Issue:** Some SVGs use viewBox only, causing rendering issues
- **Solution:** Ensure SVGs have `width="216.7" height="216.9"` attributes

### 3. ICO Multi-size Format
- **Finding:** ICO files support multiple sizes (16, 32, 48, 256)
- **Tool:** Python Pillow creates proper multi-size ICOs
- **Usage:** `img.save('icon.ico', format='ICO', sizes=[(16,16),(32,32),(48,48),(256,256)])`

### 4. Safari Pinned Tab SVG
- **Finding:** Safari requires monochrome silhouette SVG
- **Format:** Single-color path, no gradients
- **Size:** 700×700pt viewBox

### 5. Asset Naming Conventions
- **Finding:** Sonarr uses specific naming patterns:
  - `favicon.ico` (not `favicon-32x32.ico`)
  - `mstile-*.png` (Windows tile icons)
  - `apple-touch-icon.png` (iOS)
  - `android-chrome-*.png` (Android/Chrome)
- **Must preserve** these names for compatibility

### 6. Webpack Asset Emission
- **Finding:** Webpack copies `Content/Images/**/*.*` to `_output/UI/`
- **Verified:** All new assets appear in build output
- **Build time:** ~16s for full rebuild

### 7. Backend Icon Location
- **Finding:** `src/NzbDrone.Host/Sonarr.ico` is Windows app icon
- **Renamed to:** `src/NzbDrone.Host/Animarr.ico`
- **Referenced by:** Windows executable manifest

### 8. Embedded Resource
- **Finding:** `Logo/64.png` embedded in `Sonarr.Core.csproj`
- **Usage:** Runtime icon for system tray
- **Action:** Must update csproj reference in Phase 2

## Distribution Asset Discoveries

### 1. macOS ICNS Generation
- **Finding:** Pillow can create ICNS files directly from PNG
- **Tool:** `img.save('icon.icns', format='ICNS')`
- **Sizes included:** 16, 32, 64, 128, 256, 512, 1024

### 2. Windows Installer BMP
- **Finding:** Inno Setup uses 24-bit BMP images
- **Dimensions:** 164×314 (sidebar), 55×55 (small corner)
- **Tool:** Pillow can generate BMP with `img.save('image.bmp', format='BMP')`

### 3. Info.plist Updates
- **Finding:** macOS app bundle requires CFBundleName, CFBundleIconFile
- **Updated:** "Sonarr" → "Animarr"
- **Note:** CFBundleExecutable remains "Sonarr" (binary name unchanged)

### 4. Debian Service Files
- **Finding:** Systemd service files reference user/group names
- **Updated:** "sonarr" → "animarr" in comments and User/Group
- **Note:** ExecStart path unchanged (binary name not changed)

### 5. Inno Setup Script
- **Finding:** .iss files define AppName, AppPublisher, output filename
- **Updated:** "Sonarr" → "Animarr" for user-visible strings
- **Note:** AppId and internal paths unchanged for compatibility
