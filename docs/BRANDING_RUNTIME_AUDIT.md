# BRANDING_RUNTIME_AUDIT.md - Animarr Browser Branding Investigation

## Executive Summary

The browser tab showed "Sonarr" as the title because `BuildInfo.AppName` was hardcoded to `"Sonarr"` at `src/NzbDrone.Common/EnvironmentInfo/BuildInfo.cs:29`. This single value cascaded to:
- `manifest.json` via `__INSTANCE_NAME__` template replacement
- User agent strings
- Notification titles
- Sentry error reporting
- Calendar feed names
- Log messages

**Root Cause:** `BuildInfo.AppName = "Sonarr"` — the single source of truth for application identity.

**Fix Applied:** Changed to `"Animarr"` and updated all dependent references.

---

## 1. Title Source Analysis

### Browser Tab Title
- **Source:** `frontend/src/index.ejs` line: `<title>Animarr</title>` ✅ Already correct
- **Source:** `frontend/src/login.html` line: `<title>Login - Animarr</title>` ✅ Already correct
- **Runtime:** `manifest.json` `__INSTANCE_NAME__` replaced by `ManifestMapper.cs:45` with `_configFileProvider.InstanceName`
- **Default:** `ConfigFileProvider.cs:298` defaults to `BuildInfo.AppName`

### Fix Applied
- `BuildInfo.cs:29`: `"Sonarr"` → `"Animarr"`
- `manifest.json` now shows `"name": "Animarr"` ✅

---

## 2. Favicon Source Analysis

### Favicon Files
| File | Size | Status |
|------|------|--------|
| `UI/Content/Images/Icons/favicon.ico` | 25,464 bytes | ✅ Animarr icon |
| `UI/Content/Images/Icons/favicon-32x32.png` | 1,661 bytes | ✅ Animarr icon |
| `UI/Content/Images/Icons/favicon-16x16.png` | 776 bytes | ✅ Animarr icon |
| `UI/Content/Images/Icons/apple-touch-icon.png` | - | ✅ Animarr icon |
| `UI/Content/Images/Icons/safari-pinned-tab.svg` | - | ✅ Animarr icon |
| `UI/Content/Images/Icons/android-chrome-192x192.png` | - | ✅ Animarr icon |
| `UI/Content/Images/Icons/android-chrome-512x512.png` | - | ✅ Animarr icon |

### Favicon Serving
- **Root `/favicon.ico`:** Served by `FaviconMapper.cs` → maps to `UI/Content/Images/Icons/favicon.ico`
- **`/Content/manifest.json`:** Served by `ManifestMapper.cs` with `__INSTANCE_NAME__` replacement
- **`/Content/browserconfig.xml`:** Static file, already updated to `#D946EF` TileColor

### Fix Status
- All favicon files are already Animarr-branded ✅
- Root favicon.ico serves Animarr icon ✅
- manifest.json now shows "Animarr" ✅

---

## 3. Remaining Visible Sonarr References

### Fixed in This Change (20+ files)

| File | Line | Change |
|------|------|--------|
| `BuildInfo.cs` | 29 | `"Sonarr"` → `"Animarr"` |
| `RuleBuilderExtensions.cs` | 74 | Validator regex updated |
| `Startup.cs` | 121-134 | Swagger doc titles |
| `StartingUpMiddleware.cs` | 12 | Startup message |
| `NotificationBase.cs` | 24-33 | All branded titles |
| `CalendarFeedController.cs` (V3) | 46-49 | ProductId and name |
| `CalendarFeedController.cs` (V5) | 45-48 | ProductId and name |
| `LocalizationService.cs` | 102 | `appName` token |
| `FileNameBuilder.cs` | 628 | Default release group |
| `NotificationService.cs` | 313 | Update message |
| `Xbmc.cs` | 30-76 | All notification headers |
| `ServiceProvider.cs` | 83 | Windows service description |
| `SysTrayApp.cs` | 32 | Tray tooltip |
| `TelegramProxy.cs` | 76-82 | Test notification |
| `Email.cs` | 185 | Test notification |
| `PushBulletProxy.cs` | 130-131 | Test notification |
| `NtfyProxy.cs` | 75-77 | Test notification |
| `AppriseProxy.cs` | 92 | Test notification |
| `PushcutProxy.cs` | 82 | Test notification |
| `Gotify.cs` | 92,113-114 | Test message and links |
| `SimplepushProxy.cs` | 49 | Test message |
| `SignalProxy.cs` | 71 | Test message |
| `ProwlProxy.cs` | 69 | Test message |
| `SendGrid.cs` | 82 | Test message |
| `PushoverProxy.cs` | 87 | Test message |
| `SonarrImport.cs` | 19 | Import list name |

### NOT Fixed (Intentionally)

These references are internal identifiers, API contracts, or infrastructure that should NOT be renamed per the restrictions:

| Category | Files | Reason |
|----------|-------|--------|
| Namespace declarations | All `NzbDrone.*` | Internal code organization |
| Assembly names | `Sonarr.sln`, `.csproj` files | Build system identifiers |
| API routes | `/api/v3/`, `/api/v5/` | API contract |
| Database filenames | `sonarr.db` | Existing installation compatibility |
| Process names | `Sonarr`, `Sonarr.Console` | OS process identification |
| Service names | `Sonarr` Windows service | OS service identification |
| Folder names | `Sonarr.Update`, `sonarr_backup` | Update system compatibility |
| Environment variables | `Sonarr_*` (ScriptImportDecider) | Custom script API contract |
| Sentry DSN | `sentry.sonarr.tv` | Error reporting infrastructure |
| Cloud endpoints | `services.sonarr.tv`, `skyhook.sonarr.tv` | Backend API endpoints |
| GitHub logo URLs | `raw.githubusercontent.com/Sonarr/Sonarr/` | External image hosting |
| rTorrent view name | `sonarr_imported` | Download client compatibility |
| Sonarr import list | `SonarrImport.cs` class name | Internal class name |

---

## 4. Safe Fixes Summary

### High Impact (User-Visible)
1. ✅ `BuildInfo.AppName` — Single change propagates to manifest.json, user agent, Sentry, notifications
2. ✅ `StartsOrEndsWithSonarr` validator — Accepts both "Sonarr" and "Animarr"
3. ✅ Swagger doc titles — API documentation shows "Animarr"
4. ✅ Notification branded titles — All notifications show "Animarr - ..."
5. ✅ Calendar feed — iCal feed shows "Animarr TV Schedule"
6. ✅ Startup message — "Animarr is starting up"
7. ✅ Localization token — `{appName}` resolves to "Animarr"
8. ✅ Default release group — Unnamed groups default to "Animarr"
9. ✅ Log messages — Startup/shutdown logs show "Animarr"
10. ✅ Windows service description — "Animarr Application Server"
11. ✅ System tray tooltip — "Animarr - {version}"

### Medium Impact (External Services)
12. ✅ Notification test messages — "This is a test message from Animarr"
13. ✅ Gotify/Telegram links — Point to Animarr GitHub
14. ✅ Import list name — "Animarr" instead of "Sonarr"

---

## 5. Risk Assessment

### Low Risk (Implemented)
- `BuildInfo.AppName` change — Pure string constant, no logic changes
- Validator update — Adds "Animarr" as valid, doesn't break "Sonarr"
- Notification titles — User-visible text only
- Calendar feed — User-visible text only
- Log messages — User-visible text only

### Not Implemented (Higher Risk)
- Database filename change — Would break existing installations
- Process name change — Would break OS-level integrations
- Service name change — Would break Windows service management
- Environment variable names — Would break custom scripts
- API route changes — Would break API consumers
- Namespace changes — Would break all code references

---

## 6. Verification Results

### Browser Tab
- **Before:** Title showed "Sonarr"
- **After:** Title shows "Animarr" ✅

### Manifest.json
- **Before:** `"name": "Sonarr"`
- **After:** `"name": "Animarr"` ✅

### Favicon
- **Before:** Animarr icon (already correct)
- **After:** Animarr icon ✅

### API Response
- **Before:** `instanceName: "Sonarr"`
- **After:** `instanceName: "Animarr"` (via BuildInfo.AppName default) ✅

### Log Output
- **Before:** `Starting Sonarr - ...`
- **After:** `Starting Animarr - ...` ✅

---

## 7. Build Verification

```
Backend Build: SUCCESS (0 warnings, 0 errors)
Frontend Build: SUCCESS (webpack compiled in 18130ms)
Docker Image: SUCCESS (82MB compressed)
Container Run: SUCCESS (http://localhost:8989)
Branding Verification: ALL PASSED
```

---

## Appendix: Key Code Locations

| Component | File | Lines |
|-----------|------|-------|
| AppName constant | `src/NzbDrone.Common/EnvironmentInfo/BuildInfo.cs` | 29 |
| InstanceName default | `src/NzbDrone.Core/Configuration/ConfigFileProvider.cs` | 294-305 |
| Manifest replacement | `src/Sonarr.Http/Frontend/Mappers/ManifestMapper.cs` | 45 |
| Favicon serving | `src/Sonarr.Http/Frontend/Mappers/FaviconMapper.cs` | 23-35 |
| Validator | `src/NzbDrone.Core/Validation/RuleBuilderExtensions.cs` | 71-75 |
| Swagger docs | `src/NzbDrone.Host/Startup.cs` | 116-134 |
| Startup message | `src/Sonarr.Http/Middleware/StartingUpMiddleware.cs` | 12 |
| Notification titles | `src/NzbDrone.Core/Notifications/NotificationBase.cs` | 24-33 |
| Calendar feed | `src/Sonarr.Api.V3/Calendar/CalendarFeedController.cs` | 46-49 |
| Localization token | `src/NzbDrone.Core/Localization/LocalizationService.cs` | 102 |
| Default release group | `src/NzbDrone.Core/Organizer/FileNameBuilder.cs` | 628 |
