# TODO.md - Animarr Task Backlog

## Priority: High

### Phase 1 - Visual Rebranding (COMPLETE)

- [x] **Logo Design**
  - [x] Create Animarr logo (SVG)
  - [x] Generate PNG variants (16px to 1024px)
  - [x] Create favicon.ico variants
  - [x] Create apple-touch-icon.png
  - [x] Create android-chrome icons
  - [x] Create mstile icons
  - [x] Create safari-pinned-tab.svg

- [x] **Color Palette**
  - [x] Define primary magenta color
  - [x] Define secondary purple color
  - [x] Define accent pink color
  - [x] Update dark theme (dark.js)
  - [x] Update light theme (light.js)

- [x] **UI Branding**
  - [x] Update index.ejs title
  - [x] Update login.html title and branding
  - [x] Update PageHeader logo
  - [x] Update PageSidebar logo
  - [x] Update LoadingPage base64 logo
  - [x] Update alt text references

- [x] **Documentation**
  - [x] Update README.md
  - [x] Update CONTRIBUTING.md
  - [x] Update package.json metadata

- [x] **Distribution Assets**
  - [x] Generate macOS animarr.icns
  - [x] Generate Windows installer BMP images
  - [x] Update sonarr.iss
  - [x] Update sonarr.service
  - [x] Update install.sh
  - [x] Update Info.plist

## Priority: Medium

### Phase 2 - Backend Branding (Future)

- [ ] Rename window.Sonarr → window.Animarr
- [ ] Update X-Sonarr-Client header
- [ ] Update appName token
- [ ] Update calendar feed path

### Distribution

- [x] Update Docker configurations
- [x] TrueNAS port planning (Sonarr=30113, Animarr=30114)
- [ ] Test on multiple platforms

### Research Tasks

- [x] JKAnime integration research (non-code) — See `JKANIME_INTEGRATION_RESEARCH.md`
  - [x] Document JKAnime URL structure
  - [x] Map metadata fields to Animarr model
  - [x] Identify cross-reference opportunities with AniList/MAL
  - [x] Design integration API for future implementation

- [x] AniDB airing tracker research — See `ANIDB_AIRING_TRACKER_RESEARCH.md`
  - [x] Evaluate AniDB HTTP and UDP APIs
  - [x] Document rate limits and authentication
  - [x] Design data model and mapping strategy
  - [x] Plan UI location and implementation phases

### Phase 1F - JKAnime Search Helper (Complete)

- [x] Create backend search service
- [x] Create API endpoint `/api/v3/jkanime/search`
- [x] Add JKAnime link to series detail page
- [ ] Persist JKAnime URLs in series metadata (future)
- [ ] Add manual search UI (future)
- [ ] Display match confidence (future)

## Priority: Low

### Nice to Have

- [ ] Custom loading animation
- [ ] Seasonal theme variations
- [ ] Anime-style notifications
- [ ] Sound effects

---

## Completed

- [x] Clone Sonarr repository
- [x] Create documentation structure
- [x] Perform branding audit
- [x] Identify safe vs risky changes
- [x] Document build commands
- [x] Phase 1A: Frontend branding (13 files)
- [x] Phase 1B: Asset replacement (30 files)
- [x] Phase 1C: Distribution assets and cleanup (20+ files)
