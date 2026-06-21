# ANIME_ROADMAP.md - Animarr Anime Specialization Roadmap

## Overview

This roadmap transforms Animarr from a Western TV manager with anime support into a purpose-built anime collection manager. Each phase builds on the previous, with clear milestones and exit criteria.

**Guiding Principles:**
1. Every feature must solve a real anime collector pain point
2. Maintain Sonarr compatibility for non-anime users
3. Prefer incremental improvements over big-bang rewrites
4. Each phase should be shippable independently

---

## Phase A: Quick Wins (2-4 weeks)

**Goal:** Low-effort improvements that immediately help anime users.

### A1. Multi-Title Storage
- **What:** Add `JapaneseTitle`, `RomajiTitle`, `EnglishTitle` to Series model
- **Why:** Anime commonly has 3+ titles; current single-title storage loses data
- **How:**
  - Database migration to add columns
  - Update Series model and API resources
  - Populate from existing AniList/MAL import data
  - Add title preference setting (display vs search)
- **Files:** `Series.cs`, `SeriesResource.cs`, migration file
- **Exit Criteria:** Series stores all three title variants; UI shows title selector
- **Complexity:** Low

### A2. Release Group Preferences
- **What:** Per-series preferred/blocked fansub group lists
- **Why:** Anime collectors strongly prefer specific groups
- **How:**
  - Add `PreferredReleaseGroups` and `BlockedReleaseGroups` to Series model
  - Update `AnimeVersionUpgradeSpecification` to respect preferences
  - Add UI for managing group preferences
  - Integrate with custom formats for group-based scoring
- **Files:** `Series.cs`, `AnimeVersionUpgradeSpecification.cs`, Series UI components
- **Exit Criteria:** Users can set preferred groups per series; grabs respect preferences
- **Complexity:** Low

### A3. Anime Quality Definitions
- **What:** Add anime-specific quality tiers: BD Remux, BD Encode, WEB-DL, WEBRip, DVD, TV, LD
- **Why:** Anime quality priorities differ from Western TV (BD > WEB > DVD)
- **How:**
  - Add new quality definitions for anime sources
  - Track audio configuration (Japanese, English, Dual)
  - Create default anime quality profile
  - Update quality detection parser for anime tags
- **Files:** `Qualities.cs`, `QualityParser.cs`, quality profile UI
- **Exit Criteria:** Anime quality profiles distinguish BD/WEB/DVD with audio info
- **Complexity:** Low

### A4. Anime Folder Structure Options
- **What:** Configurable folder formats for anime: flat, seasonal, OVA subfolder
- **Why:** Anime collectors organize differently than Western TV viewers
- **How:**
  - Add `AnimeSeasonFolderFormat` to NamingConfig
  - Support `{Series Title}/OVA/` and `{Series Title}/Specials/` subfolders
  - Allow per-series folder structure override
- **Files:** `NamingConfig.cs`, `FileNameBuilder.cs`, naming UI
- **Exit Criteria:** Users can configure anime-specific folder structures
- **Complexity:** Low

### A5. Title Priority System
- **What:** Configurable title search priority per indexer
- **Why:** Japanese titles work better on Nyaa; English titles on Western indexers
- **How:**
  - Add title priority settings (user-configurable)
  - Track search success rate per title variant
  - Prioritize titles based on indexer type
- **Files:** `ReleaseSearchService.cs`, indexer settings
- **Exit Criteria:** Searches use optimal title order per indexer
- **Complexity:** Low

**Phase A Total Effort:** 2-4 weeks
**Phase A Exit Criteria:** Anime users see immediate quality-of-life improvements

---

## Phase B: Metadata Improvements (4-8 weeks)

**Goal:** Better anime metadata from existing sources.

### B1. AniList/MAL Metadata Enrichment
- **What:** Fetch additional metadata from AniList/MAL APIs
- **Why:** Current import lists only grab IDs; rich metadata is available
- **How:**
  - Extend AniList API calls to fetch: episode count, status, format, genres, tags
  - Extend MAL API calls to fetch: episode count, status, type, genres
  - Store additional metadata on Series model
  - Use for better episode counting and status tracking
- **Files:** `AniListAPI.cs`, `MyAnimeListResponses.cs`, Series model
- **Exit Criteria:** Series stores enriched metadata from AniList/MAL
- **Complexity:** Medium

### B2. Anime Type Classification
- **What:** Extend SeriesTypes with OVA, ONA, Movie, TVSpecial, MusicVideo
- **Why:** All anime types currently lumped into "Anime"; OVAs lost in specials
- **How:**
  - Extend SeriesTypes enum
  - Add type detection from metadata providers
  - Allow parent-child relationships (OVA → TV series)
  - Update UI to show anime type
- **Files:** `SeriesTypes.cs`, `Series.cs`, metadata providers, UI
- **Exit Criteria:** Anime types properly classified and displayed
- **Complexity:** Medium

### B3. Episode Type Codes
- **What:** Add episode type field: Regular, Special, Recap, OVA, Credits, Trailer
- **Why:** AniDB distinguishes episode types; Sonarr lumps everything into season/episode
- **How:**
  - Add `EpisodeType` field to Episode model
  - Populate from metadata providers
  - Update search to handle different types appropriately
  - Allow filtering by episode type in UI
- **Files:** `Episode.cs`, metadata providers, search service, UI
- **Exit Criteria:** Episodes tagged with proper types; search respects types
- **Complexity:** Medium

### B4. Batch Release Detection
- **What:** Detect and handle absolute-range season packs (e.g., "01-24")
- **Why:** Anime season packs use absolute ranges, not S01E01 format
- **How:**
  - Enhance parser to detect absolute range batches
  - Compare range to known episode count
  - Flag incomplete batches
  - Treat complete batches as season packs
- **Files:** `Parser.cs`, `ParsedEpisodeInfo.cs`, decision engine
- **Exit Criteria:** Absolute range batches recognized as season packs
- **Complexity:** Medium

### B5. Specials Classification
- **What:** Distinguish essential specials from optional extras
- **Why:** All specials currently lumped into season 0; OVA episodes lost
- **How:**
  - Add `IsEssential` flag to specials
  - Allow user to mark specials as essential/optional
  - Separate OVA from specials when OVA has main storyline
  - Update monitoring to skip optional extras by default
- **Files:** `Episode.cs`, monitoring service, UI
- **Exit Criteria:** Users can mark specials as essential/optional
- **Complexity:** Medium

**Phase B Total Effort:** 4-8 weeks
**Phase B Exit Criteria:** Anime metadata is richer and more accurate

---

## Phase C: Anime-Specific Search Improvements (4-8 weeks)

**Goal:** Faster, more accurate anime searching.

### C1. AniDB ID Search Support
- **What:** Search by AniDB ID + absolute episode number
- **Why:** AniDB ID is the most reliable anime identifier; direct search is faster
- **How:**
  - Extend search criteria to include AniDB ID
  - Add `anidbid=` parameter to Nyaa/Newznab request generators
  - Support `absep=` (absolute episode) in search queries
  - Update indexer settings to enable AniDB ID search
- **Files:** `AnimeEpisodeSearchCriteria.cs`, `NyaaRequestGenerator.cs`, `NewznabRequestGenerator.cs`
- **Exit Criteria:** Indexers support AniDB ID-based search
- **Complexity:** Medium

### C2. Batch Episode Search
- **What:** Search for multiple episodes in single query
- **Why:** Per-episode search causes API explosion (24 episodes × multiple titles)
- **How:**
  - Add batch search criteria for anime season packs
  - Generate efficient queries for batch releases
  - Reduce API calls by combining related searches
  - Cache search results
- **Files:** `ReleaseSearchService.cs`, search criteria classes
- **Exit Criteria:** Season searches use batch queries when possible
- **Complexity:** Medium

### C3. Search Result Caching
- **What:** Cache search results to avoid redundant API calls
- **Why:** Same series searched repeatedly with same titles
- **How:**
  - Implement search result cache with TTL
  - Cache by (series ID, episode number, title variant)
  - Invalidate cache on new releases
  - Show cache hit rate in UI
- **Files:** `ReleaseSearchService.cs`, new cache service
- **Exit Criteria:** Search performance improved by 50%+ for repeat queries
- **Complexity:** Medium

### C4. Smart Title Selection
- **What:** Automatically select best title variant for each indexer
- **Why:** Manual title selection is tedious; success rate varies by title
- **How:**
  - Track search success rate per title variant per indexer
  - Use machine learning or heuristic to predict best title
  - Fall back to user preference if no data
  - Show title effectiveness stats in UI
- **Files:** `ReleaseSearchService.cs`, analytics service
- **Exit Criteria:** Searches automatically use optimal titles
- **Complexity:** High

### C5. Indexer-Specific Search Optimization
- **What:** Tailor search queries per indexer type
- **Why:** Nyaa, AnimeBytes, and Newznab indexers have different capabilities
- **How:**
  - Add indexer capability detection
  - Generate optimal queries per indexer type
  - Support indexer-specific search parameters
  - Show indexer capabilities in settings
- **Files:** Indexer request generators, indexer settings
- **Exit Criteria:** Searches optimized per indexer type
- **Complexity:** Medium

**Phase C Total Effort:** 4-8 weeks
**Phase C Exit Criteria:** Anime searching is 2-3x faster and more accurate

---

## Phase D: AniDB Integration Concepts (8-16 weeks)

**Goal:** Deep AniDB integration for maximum anime metadata quality.

**Research Status:** See [ANIDB_AIRING_TRACKER_RESEARCH.md](ANIDB_AIRING_TRACKER_RESEARCH.md) for detailed analysis.

### D1. AniDB Airing Tracker (Research Complete)
- **What:** Display next episode and airing schedule using AniDB data
- **Why:** Anime users need to know when episodes air; TVDB has poor anime coverage
- **How:**
  - Implement AniDB UDP client with rate limiting
  - Add `AnidbId` to Series model
  - Create `AniDBAiringService` with calendar and episode lookup
  - Add "Next Episode" card to series detail page
- **Files:** New `AniDB/` service, `Series.cs`, calendar service, UI components
- **Exit Criteria:** Users can view next airing episode for any AniDB-mapped series
- **Complexity:** Medium
- **Research:** [ANIDB_AIRING_TRACKER_RESEARCH.md](ANIDB_AIRING_TRACKER_RESEARCH.md)

### D2. AniDB Metadata Provider
- **What:** Full AniDB metadata provider using UDP API
- **Why:** AniDB has the best anime metadata; TVDB is inadequate
- **How:**
  - Implement AniDB UDP API client
  - Cache AniDB data locally to minimize API calls
  - Map AniDB data to local models
  - Use TMDB for images (AniDB lacks high-res)
  - Store AniDB ID as primary anime identifier
- **Files:** New `AniDB/` provider directory, metadata services
- **Exit Criteria:** AniDB provides primary metadata for anime series
- **Complexity:** High

### D2. File Hash Matching
- **What:** Hash-based file identification using AniDB file database
- **Why:** Name parsing is unreliable; hash matching is definitive
- **How:**
  - Implement AniDB file hash lookup
  - Match imported files against AniDB database
  - Use hash for episode identification
  - Fall back to name parsing if hash unavailable
- **Files:** New hash matching service, import service
- **Exit Criteria:** Files identified by hash when possible
- **Complexity:** High

### D3. AniDB MyList Sync
- **What:** Two-way sync of watch status with AniDB
- **Why:** Track watch progress across devices; contribute to AniDB community
- **How:**
  - Implement AniDB MyList API
  - Sync watched status bidirectionally
  - Handle conflicts (local vs remote)
  - Show sync status in UI
- **Files:** New MyList sync service, UI components
- **Exit Criteria:** Watch status synced with AniDB
- **Complexity:** High

### D4. Anime Relationship Graph
- **What:** Track sequels, prequels, side stories, summaries
- **Why:** Anime often has complex relationships; users want to watch in order
- **How:**
  - Fetch relationship data from AniDB
  - Store relationships in database
  - Show relationship graph in UI
  - Allow navigation between related series
- **Files:** New relationship service, Series model, UI
- **Exit Criteria:** Users can see and navigate anime relationships
- **Complexity:** High

### D5. Character/Creator Metadata
- **What:** Fetch character and staff information from AniDB
- **Why:** Rich metadata enhances user experience
- **How:**
  - Fetch character data from AniDB
  - Fetch staff/creator data from AniDB
  - Store in database
  - Display in UI (character pages, staff pages)
- **Files:** New character service, Series model, UI
- **Exit Criteria:** Character and staff info displayed in UI
- **Complexity:** High

**Phase D Total Effort:** 8-16 weeks
**Phase D Exit Criteria:** AniDB is primary metadata source for anime

---

## Phase E: Long-Term Animarr Differentiation (16+ weeks)

**Goal:** Features that make Animarr the definitive anime collection manager.

### E1. Smart Anime Monitoring
- **What:** Intelligent monitoring based on anime type and user preferences
- **Why:** Different anime types need different monitoring strategies
- **How:**
  - Monitor TV series by episode
  - Monitor OVAs by release
  - Monitor movies by release
  - Skip optional extras by default
  - Allow per-type monitoring rules
- **Files:** Monitoring service, Series model, UI
- **Exit Criteria:** Monitoring adapted to anime type
- **Complexity:** High

### E2. Anime Release Scoring
- **What:** Score releases based on anime-specific criteria
- **Why:** Not all releases are equal; anime collectors have specific preferences
- **How:**
  - Score based on: source (BD > WEB), audio (FLAC > AAC), video (10-bit > 8-bit)
  - Score based on: release group preference, dual audio, subtitle type
  - Show scores in manual search
  - Auto-grab highest scoring release
- **Files:** New scoring service, decision engine, UI
- **Exit Criteria:** Releases scored and ranked by anime criteria
- **Complexity:** High

### E3. Anime Calendar Integration
- **What:** Anime-specific calendar with Japanese broadcast times
- **Why:** Anime airs at different times than Western TV; Japanese schedule matters
- **How:**
  - Fetch Japanese broadcast schedule from AniDB
  - Show both Japanese and local air times
  - Track broadcast delays and schedule changes
  - Integrate with notification system
- **Files:** Calendar service, notification service, UI
- **Exit Criteria:** Calendar shows Japanese broadcast schedule
- **Complexity:** High

### E4. Subtitle Integration
- **What:** Native subtitle support for anime
- **Why:** Anime often needs subtitles; Bazarr integration is indirect
- **How:**
  - Integrate with anime subtitle providers (AnimeTosho, etc.)
  - Match subtitles by hash when possible
  - Support multiple subtitle tracks (Japanese, English, sign)
  - Track subtitle quality
- **Files:** New subtitle service, import service
- **Exit Criteria:** Subtitles integrated natively
- **Complexity:** High

### E5. Anime Collection Management
- **What:** Collection-level management for anime franchises
- **Why:** Anime often has complex franchises; users want collection views
- **How:**
  - Group related series into collections
  - Show collection progress
  - Allow collection-wide monitoring
  - Track collection completion
- **Files:** New collection service, UI
- **Exit Criteria:** Franchise-level collection management
- **Complexity:** High

### E6. Community Features
- **What:** Community-driven metadata and recommendations
- **Why:** Anime community is active; leverage collective knowledge
- **How:**
  - Import community recommendations
  - Share custom formats and quality profiles
  - Show popular releases and groups
  - Integrate with anime social platforms
- **Files:** New community service, UI
- **Exit Criteria:** Community features enhance discovery
- **Complexity:** High

**Phase E Total Effort:** 16+ weeks
**Phase E Exit Criteria:** Animarr is the definitive anime collection manager

---

## Implementation Priorities

### Recommended Order

1. **Phase A** (Quick Wins) - Immediate value, low risk
2. **Phase B** (Metadata) - Foundation for advanced features
3. **Phase C** (Search) - Core anime workflow improvement
4. **Phase D** (AniDB) - Maximum metadata quality
5. **Phase E** (Differentiation) - Long-term vision

### Dependencies

- Phase B depends on Phase A (multi-title storage needed for metadata)
- Phase C depends on Phase B (better metadata improves search)
- Phase D depends on Phase B (anime type classification needed)
- Phase E depends on all previous phases

### Risk Mitigation

- Each phase is independently shippable
- Features can be deferred if complexity is too high
- Community feedback should guide priorities
- Maintain backward compatibility with Sonarr

---

## Success Metrics

### Phase A
- Anime users report improved title handling
- Release group preferences used by 50%+ of anime users
- Search time reduced by 20%+

### Phase B
- Anime type classification accurate for 90%+ of series
- Batch release detection working for common formats
- Specials properly classified

### Phase C
- Search time reduced by 50%+
- Search accuracy improved by 30%+
- API calls reduced by 40%+

### Phase D
- AniDB metadata available for 80%+ of anime series
- File hash matching working for known releases
- Watch status synced with AniDB

### Phase E
- Animarr recognized as top anime collection manager
- Community adoption growing
- Feature requests shifting from "basic" to "advanced"

---

## Appendix: Technical Notes

### Database Migrations Required

- Phase A: Series model extensions (multi-title, preferences)
- Phase B: Episode type codes, anime type classification
- Phase C: Search cache, analytics
- Phase D: AniDB data storage, hash matching
- Phase E: Collection management, community features

### API Changes

- Phase A: Series API extensions
- Phase B: Episode API extensions
- Phase C: Search API extensions
- Phase D: AniDB provider API
- Phase E: Collection API, community API

### UI Components

- Phase A: Title selector, group preferences, quality profiles
- Phase B: Anime type display, episode type filtering
- Phase C: Search optimization settings, title effectiveness stats
- Phase D: AniDB sync status, relationship graph
- Phase E: Collection views, community features

---

## Appendix: Comparison with Other Tools

| Feature | Animarr Goal | Shoko | Medusa | Current Sonarr |
|---------|-------------|-------|--------|----------------|
| AniDB metadata | Phase D | Yes | Partial | No |
| Hash matching | Phase D | Yes | No | No |
| Multi-title | Phase A | Yes | Manual | No |
| Anime types | Phase B | Yes | Partial | No |
| Release groups | Phase A | N/A | Basic | Basic |
| Quality profiles | Phase A | N/A | Per-show | Western-focused |
| Season packs | Phase B | Native | Better | Workaround |
| Community | Phase E | No | No | No |

---

## Appendix: References

- [Shoko Documentation](https://docs.shokoanime.com/)
- [AniDB API Documentation](http://wiki.anidb.net/wiki/API)
- [Sonarr GitHub Issues (Anime)](https://github.com/Sonarr/Sonarr/issues?q=is%3Aissue+anime)
- [Nyaa Search Syntax](https://nyaa.si/help)
- [AnimeBytes Wiki](https://animebytes.tv/wiki)
