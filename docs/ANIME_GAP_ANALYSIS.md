# ANIME_GAP_ANALYSIS.md - Sonarr Anime Limitations

## Executive Summary

Animarr inherits Sonarr's anime support, which was designed for Western TV shows with anime as an afterthought. While Sonarr includes basic anime handling (absolute numbering, XEM scene mapping, Nyaa indexer), it fundamentally treats anime as "TV shows with different numbering." This analysis identifies where this approach fails and where Animarr can differentiate.

**Key Finding:** Sonarr's anime support is a patchwork of workarounds built on a Western TV architecture. Dedicated anime tools (Shoko, Medusa) and collector workflows reveal systemic limitations in metadata, search, classification, and workflow automation.

---

## 1. Metadata & Identification

### 1.1 No AniDB Metadata Provider

**Current Behavior:**
- TVDB is the sole metadata source for all series (`SkyHookProxy.cs:43`)
- MAL and AniList IDs are stored as secondary cross-references (`Series.cs:29-30`)
- AniDB is completely absent from the codebase (zero references)

**Limitation:**
- TVDB has poor anime coverage: inconsistent specials, missing OVAs, split-cour confusion
- TVDB uses S01E01 numbering that conflicts with anime absolute numbering
- No access to AniDB's anime-specific metadata: episode types, character data, relations

**Root Cause:**
- Sonarr was built for Western TV; anime support was added later via XEM/TVDB mapping
- AniDB API is rate-limited and lacks high-res images
- No community consensus on a "SuperAniDB" provider design

**Difficulty:** High
**Potential Solution:**
- Build AniDB metadata provider using UDP API for metadata + TMDB for images
- Cache AniDB data locally to minimize API calls
- Store AniDB ID as primary anime identifier alongside TVDB ID

### 1.2 Single Title Storage

**Current Behavior:**
- `Series.Title` is a single string field (`Series.cs:31`)
- AniList import list fetches `userPreferred` and `romaji` titles (`AniListAPI.cs:85-90`)
- Only one title is stored; alternate titles come from scene mappings, not metadata

**Limitation:**
- Japanese, Romaji, and English titles are not all stored
- Users cannot switch between title variants
- Release matching relies on scene mapping aliases, not authoritative title data

**Root Cause:**
- Western TV shows typically have one title per region
- Anime commonly has 3+ titles per series (Japanese, Romaji, English, regional variants)

**Difficulty:** Medium
**Potential Solution:**
- Add `JapaneseTitle`, `RomajiTitle`, `EnglishTitle` fields to Series model
- Populate from AniDB/AniList/MAL metadata providers
- Allow user preference for display title vs. search title

### 1.3 No Anime Type Classification

**Current Behavior:**
- `SeriesTypes` enum has only 3 values: Standard, Daily, Anime (`SeriesTypes.cs:3-8`)
- OVA, ONA, Movie, TV Special, Music Video are all lumped into "Anime"
- Parser detects OVA/NCOP/NCED via regex but only marks as `Special = true` (`Parser.cs:449-451`)

**Limitation:**
- OVA series treated as specials (season 0) instead of separate entries
- ONA releases confused with TV episodes
- Anime movies not distinguishable from TV series
- No way to link OVA to its parent TV series

**Root Cause:**
- TVDB doesn't distinguish anime types; everything is "TV Series"
- AniDB has proper type classification (TV, OVA, ONA, Movie, Special, MV) but isn't used

**Difficulty:** High
**Potential Solution:**
- Extend `SeriesTypes` with: `OVA`, `ONA`, `Movie`, `TVSpecial`, `MusicVideo`
- Map AniDB type classification to local types
- Allow parent-child relationships (OVA → TV series)

---

## 2. Episode Numbering & Structure

### 2.1 Absolute Numbering Fragility

**Current Behavior:**
- `AbsoluteEpisodeNumber` on Episode model (`Episode.cs:28`)
- `MapAbsoluteEpisodeNumbers()` deduplicates by absolute number (`RefreshEpisodeService.cs:228-236`)
- XEM provides scene-to-TVDB mapping via `SceneAbsoluteEpisodeNumber`

**Limitation:**
- Absolute numbers are nullable; episodes without them break anime search
- Deduplication keeps "highest season" version, losing information
- XEM mapping is incomplete for many series
- No fallback when XEM data is stale or missing

**Root Cause:**
- TVDB doesn't natively support absolute numbering
- XEM is a third-party service with no SLA
- Absolute numbering is bolted onto a season/episode system

**Difficulty:** Medium
**Potential Solution:**
- Maintain local absolute number mapping as fallback
- Allow user-corrected absolute numbers
- Source absolute numbers from AniDB metadata

### 2.2 Season Pack Handling

**Current Behavior:**
- `AnimeSeasonSearchCriteria` searches by season number (`AnimeSeasonSearchCriteria.cs`)
- Season pack regex matches `S##` pattern (`Parser.cs:96-98`)
- `SingleEpisodeSearchMatchSpecification` rejects season packs for non-season searches

**Limitation:**
- Anime season packs use absolute ranges (e.g., "01-24"), not S01E01-S01E24
- Nyaa/AnimeBytes torrents rarely use S01E01 format for season packs
- Season pack detection fails for absolute-numbered batches

**Root Cause:**
- Season pack detection was designed for Western TV naming conventions
- Anime collectors expect absolute range batches, not season/episode format

**Difficulty:** Medium
**Potential Solution:**
- Add absolute range season pack detection (e.g., "01-24")
- Recognize batch releases as season packs when absolute numbers cover full season
- Update Nyaa request generator to search for batch releases

### 2.3 Specials Classification

**Current Behavior:**
- Season 0 = Specials (TVDB convention)
- OVA, NCOP, NCED detected via regex and marked `Special = true`
- Specials searched by episode title (`ReleaseSearchService.cs:368-396`)

**Limitation:**
- All specials lumped into season 0 regardless of type
- OVA episodes that are part of main storyline lost in specials
- NCOP/NCED treated as specials instead of extras
- No distinction between "important" specials and "optional" extras

**Root Cause:**
- TVDB uses season 0 for all non-episode content
- AniDB has proper episode type codes (R=regular, S=special, O=other, C=credits, T=trailers)

**Difficulty:** Medium
**Potential Solution:**
- Add episode type field (Regular, Special, Recap, OVA, Credits, Trailer)
- Allow user to mark specials as "essential" vs "optional"
- Separate OVA from specials when OVA has its own storyline

---

## 3. Search & Discovery

### 3.1 Per-Episode Search Explosion

**Current Behavior:**
- Each episode searched individually against all scene titles
- `SearchAnime()` creates one `AnimeEpisodeSearchCriteria` per episode (`ReleaseSearchService.cs:353-366`)
- 24-episode season × multiple aliases = hundreds of API calls

**Limitation:**
- Nyaa/AnimeBytes have API rate limits
- Search takes 10+ minutes for full season
- Many redundant queries for same series with different titles

**Root Cause:**
- Search architecture designed for Western TV with few aliases per show
- Anime has 5-10+ title variants per series (Japanese, Romaji, English, abbreviations)

**Difficulty:** Medium
**Potential Solution:**
- Batch episode searches where possible
- Use AniDB ID + absolute episode number for direct indexer queries
- Implement search result caching
- Add "search by AniDB ID" for indexers that support it

### 3.2 Alternate Title Search Inefficiency

**Current Behavior:**
- Scene mapping provides alternate titles (`SceneMappingService.cs:53-70`)
- Each title variant generates separate search queries
- `GetSceneNames()` returns all aliases for a TVDB ID

**Limitation:**
- No way to prioritize which titles to search first
- Japanese titles often produce better results on Nyaa but aren't prioritized
- Search multiplies exponentially with title variants

**Root Cause:**
- No understanding of which title variant is most effective per indexer
- No user-configurable title preferences for searching

**Difficulty:** Low
**Potential Solution:**
- Add title priority system (user-configurable per indexer)
- Track search success rate per title variant
- Prioritize Japanese titles for Nyaa, English for Western indexers

### 3.3 No AniDB ID Search Support

**Current Behavior:**
- Search criteria use series title + episode number
- Nyaa supports `?term=title+episode` but not AniDB ID search
- Newznab-based indexers support TVDB ID search

**Limitation:**
- No way to search by AniDB ID even when indexers support it
- AniDB ID is the most reliable identifier for anime
- Missing support for extended Torznab `anidbid=` parameter

**Root Cause:**
- Torznab/Newznab spec doesn't include AniDB ID parameters
- Indexer request generators don't know about AniDB ID searching

**Difficulty:** Medium
**Potential Solution:**
- Extend search criteria to include AniDB ID
- Add `anidbid=` parameter to Nyaa/Newznab request generators
- Support `absep=` (absolute episode) in search queries

---

## 4. Release Handling

### 4.1 Fansub Group Handling

**Current Behavior:**
- `[SubGroup]` bracket pattern extracted first (`ReleaseGroupParser.cs:14`)
- `AnimeVersionUpgradeSpecification` requires matching release groups for upgrades
- Hardcoded exception groups for edge cases

**Limitation:**
- Fansub group names change frequently (groups merge, split, rename)
- No way to track group equivalency (e.g., "FFF" = "FFFansubs")
- Cross-group upgrades blocked even when content is identical
- No way to prefer specific groups per series

**Root Cause:**
- Release group matching designed for Western scene groups with stable names
- Anime fansub ecosystem is chaotic with frequent group changes

**Difficulty:** Low
**Potential Solution:**
- Add release group alias/equivalency system
- Allow user to specify preferred groups per series
- Track group history for upgrade decisions

### 4.2 Batch Release Parsing

**Current Behavior:**
- Batch ranges detected via regex (`Parser.cs:81,109,213-214`)
- Generates full episode range from start-end numbers
- Multi-episode releases handled as `ReleaseType.MultiEpisode`

**Limitation:**
- Batch detection fails for non-standard formats
- Incomplete batches (e.g., "01-12" when season has 24 episodes) not flagged
- No distinction between "complete batch" and "partial batch"

**Root Cause:**
- Batch parsing assumes complete ranges
- No awareness of total episode count during parsing

**Difficulty:** Low
**Potential Solution:**
- Compare batch range to known episode count
- Flag incomplete batches for user review
- Allow manual batch completion

### 4.3 CRC32 Checksum Handling

**Current Behavior:**
- CRC32 in release titles detected by parser regex
- Used for file integrity verification
- Not actively used for matching or validation

**Limitation:**
- CRC32 not validated against AniDB file database
- No way to verify file matches expected release
- Missing opportunity for hash-based file identification

**Root Cause:**
- Sonarr doesn't integrate with AniDB's file hash database
- CRC32 is metadata, not used for identification

**Difficulty:** Medium
**Potential Solution:**
- Integrate AniDB file hash lookup
- Validate CRC32 against AniDB database
- Use hash matching for file identification (like Shoko)

---

## 5. Workflow & Organization

### 5.1 No Anime-Specific Folder Structure

**Current Behavior:**
- `SeasonFolderFormat = "Season {season}"` (`NamingConfig.cs:18`)
- `SpecialsFolderFormat = "Specials"` (`NamingConfig.cs:19`)
- Anime uses same folder structure as Western TV

**Limitation:**
- Anime collectors prefer different structures:
  - `Series Name/` (flat, all episodes)
  - `Series Name/Season 1/` (by season)
  - `Series Name/OVA/` (separate OVA folder)
  - `Series Name/Specials/` (separate specials)
- No way to configure per-series folder structure

**Root Cause:**
- Folder structure designed for Western TV conventions
- Anime has diverse organizational preferences

**Difficulty:** Low
**Potential Solution:**
- Add anime-specific folder format options
- Allow per-series folder structure configuration
- Support OVA/ONA/Specials subfolders

### 5.2 No Quality Profile for Anime

**Current Behavior:**
- Quality profiles shared between Standard/Daily/Anime series types
- No anime-specific quality tiers (BD vs WEB vs DVD vs LD)
- No distinction between Japanese audio and English dub quality

**Limitation:**
- Anime collectors prioritize BD > WEB > DVD > TV rip
- Dual audio (Japanese + English) is important but not tracked
- Encoding quality (10-bit, HEVC, FLAC) not in quality profiles

**Root Cause:**
- Quality system designed for Western TV (HDTV > WEBRip > BluRay)
- Anime quality considerations are different

**Difficulty:** Medium
**Potential Solution:**
- Add anime-specific quality definitions (BD, WEB, DVD, TV, LD)
- Track audio configuration (Japanese, English, Dual)
- Create anime-specific quality profiles

### 5.3 No Release Group Preferences

**Current Behavior:**
- `ReleaseGroup` stored on episode files
- No user-configurable release group preferences
- `AnimeVersionUpgradeSpecification` blocks cross-group upgrades

**Limitation:**
- Cannot specify preferred fansub groups per series
- Cannot auto-grab from preferred groups
- No way to exclude specific groups

**Root Cause:**
- Western TV doesn't have fansub group preferences
- Release group handling designed for scene compliance, not fansub selection

**Difficulty:** Low
**Potential Solution:**
- Add release group preference system per series
- Allow preferred/allowed/blocked group lists
- Integrate with custom formats for group-based scoring

---

## 6. Comparison with Dedicated Tools

| Feature | Sonarr/Animarr | Shoko | Medusa |
|---------|---------------|-------|--------|
| Primary DB | TVDB | AniDB | TVDB/AniDB |
| File matching | Name parsing | Hash-based | Name parsing |
| Anime types | Basic (3 types) | Full (8+ types) | Basic AniDB |
| Season packs | Workaround | Native | Better |
| Specials/OVAs | S00EXX only | First-class | AniDB-aware |
| Alt titles | Limited | Multi-language | Manual custom |
| Release groups | Basic | N/A | Per-show prefs |
| Quality profiles | Western-focused | N/A | Per-show quality |
| Subtitle support | Via Bazarr | Plugin-based | Built-in |

---

## 7. Opportunities for Animarr Differentiation

### High Impact, Feasible
1. **AniDB metadata provider** - The single biggest improvement
2. **Multi-title storage** (Japanese/Romaji/English) - Essential for anime
3. **Anime type classification** (OVA/ONA/Movie/Special) - Proper organization
4. **Release group preferences** - Fansub-aware automation
5. **Anime-specific quality profiles** - BD/WEB/DVD/dual-audio tracking

### Medium Impact, Feasible
6. **Batch release detection** - Absolute range season packs
7. **AniDB ID search support** - Direct indexer queries
8. **Title priority system** - Search optimization
9. **Anime folder structure options** - Collector-friendly organization
10. **Specials classification** - Essential vs optional extras

### High Impact, Complex
11. **Hash-based file matching** (like Shoko) - File identification
12. **AniDB MyList sync** - Watch status tracking
13. **Anime relationship graph** - Sequels/prequels tracking
14. **Character/creator metadata** - Richer information

### Low Priority
15. **Episode type codes** (R/S/O/C/T) - Granular classification
16. **CRC32 validation** - File integrity
17. **Group equivalency system** - Fansub group tracking

---

## 8. Recommended First Feature

**AniDB Metadata Provider** - This unlocks:
- Accurate anime type classification
- Proper episode numbering from AniDB
- Multi-language title storage
- Character/creator metadata
- Relationship graph (sequels/prequels)
- File hash matching capability

Without AniDB, all other anime improvements are workarounds on top of TVDB's limitations.

---

## Appendix: Key Code Locations

| Area | File | Lines |
|------|------|-------|
| Series types | `src/NzbDrone.Core/Tv/SeriesTypes.cs` | 3-8 |
| Anime episode resolution | `src/NzbDrone.Core/Parser/ParsingService.cs` | 575-646 |
| Anime search dispatch | `src/NzbDrone.Core/IndexerSearch/ReleaseSearchService.cs` | 74-84 |
| Nyaa search queries | `src/NzbDrone.Core/Indexers/Nyaa/NyaaRequestGenerator.cs` | 61-99 |
| Absolute number mapping | `src/NzbDrone.Core/Tv/RefreshEpisodeService.cs` | 228-253 |
| Scene mapping | `src/NzbDrone.Core/DataAugmentation/Scene/SceneMappingService.cs` | 53-130 |
| XEM service | `src/NzbDrone.Core/DataAugmentation/Xem/XemService.cs` | 34-98 |
| OVA detection regex | `src/NzbDrone.Core/Parser/Parser.cs` | 449-451 |
| Chinese anime parsing | `src/NzbDrone.Core/Parser/ParserCommon.cs` | 9-52 |
| Release group parsing | `src/NzbDrone.Core/Parser/ReleaseGroupParser.cs` | 7-87 |
| Anime naming format | `src/NzbDrone.Core/Organizer/NamingConfig.cs` | 16,29 |
| AniList import | `src/NzbDrone.Core/ImportLists/AniList/AniListAPI.cs` | 25-52 |
| MAL import | `src/NzbDrone.Core/ImportLists/MyAnimeList/MyAnimeListParser.cs` | 1-38 |
| Version upgrade spec | `src/NzbDrone.Core/DecisionEngine/Specifications/AnimeVersionUpgradeSpecification.cs` | 11-76 |
