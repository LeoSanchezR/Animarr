# ANIDB_AIRING_TRACKER_RESEARCH.md - AniDB Airing Tracker Integration Research

## Overview

This document evaluates AniDB as a data source for upcoming episode / next airing information in Animarr. AniDB has the most comprehensive anime metadata database, including per-episode air dates, making it the ideal source for anime airing tracking.

**Goal:** Display "next episode" and "airing schedule" information for anime series using AniDB data.

**Scope:** Research only — no implementation in this phase.

---

## 1. How AniDB Exposes Episode/Air Dates

### 1.1 HTTP API (Limited, Read-Only)

**Endpoint:** `http://api.anidb.net:9001/httpapi`

**Anime Request:**
```
GET http://api.anidb.net:9001/httpapi?request=anime&client={str}&clientver={int}&protover=1&aid={int}
```

**Response includes:**
- `<startdate>` — Anime start date (YYYY-MM-DD)
- `<enddate>` — Anime end date (YYYY-MM-DD)
- `<episodecount>` — Total episode count (unreliable for ongoing series)
- `<episodes>` — Array of episode objects, each containing:
  - `<id>` — Episode ID
  - `<epno>` — Episode number (e.g., "1", "S1", "1.5")
  - `<airdate>` — Air date (YYYY-MM-DD)
  - `<length>` — Duration in minutes
  - `<rating>` — Episode rating
  - `<title>` — Episode title (multiple languages)

**Limitations:**
- Read-only access to limited subset
- Requires registered client identifier
- Heavy caching required — requesting same data multiple times per day gets you banned
- No more than 1 request every 2 seconds
- Returns full anime XML (can be 30KB+ for large series)

### 1.2 UDP API (Recommended)

**Endpoint:** `udp://api.anidb.net:9001`

#### ANIME Command
Returns anime metadata including air dates:
```
ANIME aid={int}
```
Response fields (with amask):
- `int4 air date` (bit 4 of dateflags)
- `int4 end date` (bit 3 of dateflags)
- `int4 episodes` (bit 7)
- `int4 highest episode number` (bit 6)
- `int4 special ep count` (bit 5)

#### EPISODE Command
Returns episode-specific data:
```
EPISODE eid={int}
```
Response includes:
- Episode number
- Episode title
- Air date (YYYY-MM-DD)
- Duration
- Rating
- Episode type (regular, special, etc.)

#### CALENDAR Command (Most Relevant)
Returns upcoming anime releases:
```
CALENDAR
```
Response:
```
297 CALENDAR
{int aid}|{int startdate}|{int dateflags}/n
```
Returns 25 most recently aired + 25 next upcoming anime, ordered by start date.

**dateflags values:**
- bit0: Startdate, Unknown Day
- bit1: Startdate, Unknown Month, Day
- bit2: Enddate, Unknown Day
- bit3: Enddate, Unknown Month, Day
- bit4: AirDate in the Past / Anime has ended
- bit5: Startdate, Unknown Year
- bit6: Enddate, Unknown Year

### 1.3 Third-Party APIs

**Parse Bot AniDB API (JSON wrapper):**
- `GET /get_anime_details?id={anidb_id}` — Returns episodes array with airdate
- `GET /get_episode_details?id={episode_id}` — Returns single episode with air_date
- `GET /advanced_search_anime?query=&airing_status={int}` — Filter by airing status

**Simkl API (AniDB-backed):**
- Uses AniDB as primary source for episode numbering
- `GET /anime/episodes/{id}` — Full episode list with airdates
- Cloudflare-cached, more reliable than direct AniDB

**AnimeSchedule.net API:**
- Supports `anidb-ids` filter
- Pre-processed schedule data

---

## 2. HTTP API vs UDP API

| Feature | HTTP API | UDP API |
|---------|----------|---------|
| Protocol | HTTP (port 9001) | UDP (port 9001) |
| Data format | XML | Pipe-delimited text |
| Authentication | Client ID + version | Username + password + client |
| Rate limit | 1 request/2 seconds | 0.5 packets/2 seconds |
| Data richness | Full anime data (30KB+) | Limited (with amask) |
| File operations | Limited | Full (MyList, file hash) |
| Recommended for | Anime metadata lookup | File operations + calendar |
| Registration | Required | Required |

### Recommendation: UDP API

For airing tracker purposes, UDP API is recommended because:
1. **CALENDAR command** provides direct access to upcoming releases
2. **EPISODE command** can fetch specific episode air dates
3. **Lower bandwidth** — pipe-delimited text vs XML
4. **Better rate limit handling** — built-in exponential backoff support
5. **Session management** — connection stays alive for 35 minutes

---

## 3. Authentication Requirements

### HTTP API
- Register client at: https://anidb.net/animedb/clientadd
- Provide `client={str}` and `clientver={int}` on every request
- No username/password required for read-only anime data

### UDP API
- Register client at: https://anidb.net/animedb/clientadd
- **AUTH command required:**
  ```
  AUTH user={username}&pass={password}&protover={int}&client={str}&clientver={int}
  ```
- Returns session key (valid for 35 minutes)
- Re-authenticate if session expires
- **Rate limit:** 0.5 packets/second (1 packet every 2 seconds)
- Exponential backoff on failed login attempts

### Registration Process
1. Create AniDB account at https://anidb.net
2. Register client at https://anidb.net/animedb/clientadd
3. Choose unique client name (e.g., "animarr")
4. Provide version number and description
5. Wait for approval (usually instant for open-source projects)

---

## 4. Rate Limits

### HTTP API
- **1 request every 2 seconds** minimum
- Requesting same data multiple times per day = ban
- "Do not use to download AniDB" — will get banned
- Heavy local caching required

### UDP API
- **0.5 packets per second** (1 packet every 2 seconds)
- Server enforces after first 5 packets
- Exceeding rate = all packets dropped without feedback
- Session timeout: 35 minutes of inactivity
- Keep connection alive with UPTIME command every 30 minutes

### Banning
- API not answering = either down or banned
- Bans typically last 30 minutes
- Multiple concurrent connections from different ports = ban
- Too many auth failures = ban

### Rate Limit Strategy for Animarr
```
1. Cache CALENDAR results for 6 hours (updates daily)
2. Cache ANIME data for 24 hours
3. Cache EPISODE data for 24 hours
4. Maximum 1 UDP packet per 2.5 seconds (safety margin)
5. Exponential backoff on errors: 30s → 2m → 5m → 10m → 30m
6. Never query same data twice in same session
```

---

## 5. Mapping Requirements

### 5.1 AniDB ID to Animarr Series

AniDB uses numeric IDs (e.g., `aid=117` for Little Busters). Need mapping:

**Option A: Direct AniDB ID Storage**
- Add `AnidbId` property to `Series` model
- Store mapping when user adds series from AniDB search
- Use for direct lookup

**Option B: Title-Based Search**
- Search AniDB by title when AniDB ID unknown
- Match against existing series
- Confidence scoring for fuzzy matches

**Option C: Cross-Reference IDs**
- AniDB provides cross-references to MAL, AniList, TVDB
- Use existing MAL/AniList IDs to find AniDB equivalent
- Maintain mapping table

### 5.2 Existing Animarr Series Model

```csharp
// From src/NzbDrone.Core/Tv/Series.cs
public class Series
{
    public int TvdbId { get; set; }
    public HashSet<int> MalIds { get; set; }  // Already exists
    public HashSet<int> AniListIds { get; set; }  // Already exists
    public int TmdbId { get; set; }
    public int ImdbId { get; set; }
    // Missing: AnidbId
}
```

### 5.3 Recommended Mapping Strategy

1. **Add `AnidbId` property** to `Series` model
2. **Auto-map** when importing from AniList/MAL (cross-reference available)
3. **Manual map** via AniDB search in UI
4. **Cache mapping** in database to avoid repeated lookups

---

## 6. Data We Need

### 6.1 For Airing Tracker

| Field | Source | Description |
|-------|--------|-------------|
| `anidbId` | ANIME command | AniDB anime ID |
| `title` | ANIME command | Anime title (main) |
| `episodeCount` | ANIME command | Total episodes (may be unknown) |
| `startDate` | ANIME command | First air date |
| `endDate` | ANIME command | Last air date |
| `type` | ANIME command | TV Series, OVA, Movie, etc. |
| `nextEpisodeNumber` | EPISODE command | Next episode to air |
| `nextAirDate` | EPISODE command | When next episode airs |
| `episodeType` | EPISODE command | Regular, Special, OVA, etc. |

### 6.2 For Episode-Level Tracking

| Field | Source | Description |
|-------|--------|-------------|
| `episodeId` | EPISODE command | AniDB episode ID |
| `episodeNumber` | EPISODE command | Episode number |
| `airDate` | EPISODE command | Air date (YYYY-MM-DD) |
| `duration` | EPISODE command | Duration in minutes |
| `rating` | EPISODE command | Episode rating |
| `title` | EPISODE command | Episode title |

### 6.3 For Calendar Integration

| Field | Source | Description |
|-------|--------|-------------|
| `aid` | CALENDAR command | Anime ID |
| `startdate` | CALENDAR command | Start date (YYYYMMDD as int) |
| `dateflags` | CALENDAR command | Date precision flags |

---

## 7. Recommended Integration Approach

### 7.1 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Animarr Backend                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────┐    ┌──────────────────────┐   │
│  │  AniDB UDP Client    │    │  Local Cache Layer   │   │
│  │  (port 9001)         │───▶│  (SQLite)            │   │
│  └──────────────────────┘    └──────────────────────┘   │
│           │                              │               │
│           ▼                              ▼               │
│  ┌──────────────────────┐    ┌──────────────────────┐   │
│  │  AniDB Airing Service│    │  Episode Service     │   │
│  │  - GetCalendar()     │    │  - NextAiring()      │   │
│  │  - GetAnimeEpisodes()│    │  - AiringSchedule()  │   │
│  └──────────────────────┘    └──────────────────────┘   │
│           │                              │               │
│           ▼                              ▼               │
│  ┌──────────────────────┐    ┌──────────────────────┐   │
│  │  API Controller      │    │  UI Components       │   │
│  │  /api/v3/anidb/      │    │  - Next Episode Card │   │
│  │  - calendar          │    │  - Airing Schedule   │   │
│  │  - airing            │    │  - Calendar Enhance  │   │
│  └──────────────────────┘    └──────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Implementation Phases

#### Phase 1: Basic Airing Tracker (2-3 weeks)
1. Implement AniDB UDP client with rate limiting
2. Add `AnidbId` to Series model
3. Create `AniDBAiringService` with:
   - `GetCalendar()` — Fetch upcoming releases
   - `GetAnimeEpisodes(anidbId)` — Get episode list with air dates
   - `GetNextAiringEpisode(anidbId)` — Get next episode to air
4. Create API endpoint: `GET /api/v3/anidb/airing`
5. Add "Next Episode" card to series detail page

#### Phase 2: Calendar Enhancement (2-3 weeks)
1. Integrate AniDB calendar with existing Sonarr calendar
2. Show Japanese broadcast times alongside local times
3. Add anime-specific calendar view
4. Track broadcast delays and schedule changes

#### Phase 3: Advanced Features (3-4 weeks)
1. Episode-type awareness (OVA, Special, etc.)
2. Relationship graph for sequels/prequels
3. MyList sync for watch status
4. File hash matching for import verification

### 7.3 Caching Strategy

```csharp
public class AniDBCache
{
    // Calendar data: refresh daily
    private const int CALENDAR_TTL_HOURS = 6;
    
    // Anime metadata: refresh weekly
    private const int ANIME_TTL_HOURS = 24 * 7;
    
    // Episode data: refresh daily
    private const int EPISODE_TTL_HOURS = 24;
    
    // Mapping data: refresh monthly
    private const int MAPPING_TTL_HOURS = 24 * 30;
}
```

---

## 8. Limitations

### 8.1 Data Limitations
- **Episode count unreliable** — AniDB may have placeholder values for ongoing series
- **Air dates may be missing** — Especially for older anime or specials
- **Date precision varies** — Some dates only have year/month
- **No high-res images** — Must use TMDB for images

### 8.2 Technical Limitations
- **UDP protocol** — More complex than HTTP (connection management, session keys)
- **Rate limits** — Must implement strict throttling (0.5 packets/2 seconds)
- **Banning risk** — Aggressive caching required
- **No real-time push** — Must poll for updates
- **Session management** — Re-authenticate every 35 minutes

### 8.3 Legal/Ethical Limitations
- **Read-only** — No writing to AniDB without MyList integration
- **Non-commercial** — AniDB CC BY-NC-SA 4.0 license
- **Attribution required** — Must credit AniDB
- **No scraping** — Must use official API

---

## 9. Rate Limit Concerns

### 9.1 Worst-Case Scenario
- 100 monitored anime series
- Each needs episode data refresh daily
- 100 ANIME requests × 1 EPISODE request = 200 requests/day
- At 1 request/2 seconds = 400 seconds (6.7 minutes)
- **Manageable** with proper caching

### 9.2 Recommended Throttling
```csharp
public class AniDBRateLimiter
{
    private const int MIN_DELAY_MS = 2500; // 2.5 seconds (safety margin)
    private DateTime _lastRequest = DateTime.MinValue;
    
    public async Task ThrottleAsync()
    {
        var elapsed = DateTime.UtcNow - _lastRequest;
        if (elapsed.TotalMilliseconds < MIN_DELAY_MS)
        {
            await Task.Delay(MIN_DELAY_MS - (int)elapsed.TotalMilliseconds);
        }
        _lastRequest = DateTime.UtcNow;
    }
}
```

### 9.3 Cache-First Strategy
1. Check local cache before any API call
2. Serve from cache if data exists and not expired
3. Only fetch from API on cache miss or expiry
4. Log cache hit/miss rate for monitoring

---

## 10. Mapping Strategy

### 10.1 ID Mapping Table

```sql
CREATE TABLE AniDBMapping (
    Id INTEGER PRIMARY KEY,
    SeriesId INTEGER NOT NULL,
    AniDBId INTEGER NOT NULL,
    MALId INTEGER,
    AniListId INTEGER,
    LastUpdated DATETIME NOT NULL,
    FOREIGN KEY (SeriesId) REFERENCES Series(Id)
);

CREATE INDEX IX_AniDBMapping_AniDBId ON AniDBMapping(AniDBId);
CREATE INDEX IX_AniDBMapping_SeriesId ON AniDBMapping(SeriesId);
```

### 10.2 Auto-Mapping Sources

| Source | Reliability | Notes |
|--------|-------------|-------|
| AniList ID → AniDB ID | High | AniDB provides cross-reference |
| MAL ID → AniDB ID | Medium | Multiple MAL entries possible |
| TVDB ID → AniDB ID | Low | Poor anime coverage |
| Title search | Low | Fuzzy matching needed |

### 10.3 Mapping Flow

```
1. User adds series from AniList import
   └─> Auto-map AniList ID → AniDB ID (via AniDB cross-reference)

2. User adds series from MAL import
   └─> Auto-map MAL ID → AniDB ID (via AniDB cross-reference)

3. User adds series manually
   └─> Search AniDB by title
   └─> Show confidence scores
   └─> User confirms mapping

4. Existing series without AniDB ID
   └─> Batch auto-map using AniList/MAL cross-references
   └─> Prompt user for unresolvable series
```

---

## 11. Proposed UI Location

### 11.1 Series Detail Page — "Next Episode" Card

```
┌─────────────────────────────────────────────────────────┐
│  Series Title                                           │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Next Episode                                    │   │
│  │  ─────────────────────────────────────────────  │   │
│  │  Episode 14: "The Final Battle"                 │   │
│  │  Airs: 2026-06-28 (Saturday)                    │   │
│  │  In: 7 days                                      │   │
│  │                                                  │   │
│  │  [View on JKAnime]  [View on AniDB]             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Airing Schedule                                 │   │
│  │  ─────────────────────────────────────────────  │   │
│  │  Ep 14: 2026-06-28  ✓ Aired                     │   │
│  │  Ep 15: 2026-07-05  ○ Upcoming                  │   │
│  │  Ep 16: 2026-07-12  ○ Upcoming                  │   │
│  │  Ep 17: 2026-07-19  ○ Upcoming                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 11.2 Calendar Page — Anime Airing Overlay

```
┌─────────────────────────────────────────────────────────┐
│  Calendar — June 2026                                   │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐          │
│  │ Sun │ Mon │ Tue │ Wed │ Thu │ Fri │ Sat │          │
│  ├─────┼─────┼─────┼─────┼─────┼─────┼─────┤          │
│  │     │     │     │     │     │     │  28 │          │
│  │     │     │     │     │     │     │  ▼  │          │
│  │     │     │     │     │     │     │ Ep14│          │
│  └─────┴─────┴─────┴─────┴─────┴─────┴─────┘          │
│                                                         │
│  Legend:                                                 │
│  ▼ = Anime episode airing                               │
│  ● = Western TV episode                                  │
│  ◆ = Movie/Special                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 12. Proposed Data Model

### 12.1 Series Model Extensions

```csharp
// Add to Series.cs
public class Series
{
    // Existing
    public int TvdbId { get; set; }
    public HashSet<int> MalIds { get; set; }
    public HashSet<int> AniListIds { get; set; }
    
    // New
    public int? AnidbId { get; set; }
    public string AnidbUrl => AnidbId.HasValue 
        ? $"https://anidb.net/anime/{AnidbId}" 
        : null;
}
```

### 12.2 New AniDB Models

```csharp
// src/NzbDrone.Core/AniDB/AniDBAnime.cs
public class AniDBAnime
{
    public int AniDBId { get; set; }
    public string Title { get; set; }
    public string JapaneseTitle { get; set; }
    public string EnglishTitle { get; set; }
    public string Type { get; set; } // TV Series, OVA, Movie, etc.
    public int? EpisodeCount { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Description { get; set; }
    public double Rating { get; set; }
    public DateTime LastUpdated { get; set; }
}

// src/NzbDrone.Core/AniDB/AniDBEpisode.cs
public class AniDBEpisode
{
    public int AniDBEpisodeId { get; set; }
    public int AniDBAnimeId { get; set; }
    public string EpisodeNumber { get; set; } // "1", "S1", "1.5"
    public string Title { get; set; }
    public DateTime? AirDate { get; set; }
    public int? DurationMinutes { get; set; }
    public string EpisodeType { get; set; } // Regular, Special, OVA
    public double Rating { get; set; }
    public DateTime LastUpdated { get; set; }
}

// src/NzbDrone.Core/AniDB/AniDBMapping.cs
public class AniDBMapping
{
    public int Id { get; set; }
    public int SeriesId { get; set; }
    public int AniDBId { get; set; }
    public int? MALId { get; set; }
    public int? AniListId { get; set; }
    public DateTime LastUpdated { get; set; }
}
```

### 12.3 API Response Models

```csharp
// src/Sonarr.Api.V3/AniDB/AniDBAiringResource.cs
public class AniDBAiringResource : RestResource
{
    public int AniDBId { get; set; }
    public string Title { get; set; }
    public string Type { get; set; }
    public int? TotalEpisodes { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    
    // Next episode info
    public int? NextEpisodeNumber { get; set; }
    public string NextEpisodeTitle { get; set; }
    public DateTime? NextAirDate { get; set; }
    public int? DaysUntilAiring { get; set; }
    
    // Episode list (limited)
    public List<AniDBEpisodeResource> UpcomingEpisodes { get; set; }
}

// src/Sonarr.Api.V3/AniDB/AniDBEpisodeResource.cs
public class AniDBEpisodeResource : RestResource
{
    public int AniDBEpisodeId { get; set; }
    public string EpisodeNumber { get; set; }
    public string Title { get; set; }
    public DateTime? AirDate { get; set; }
    public int? DurationMinutes { get; set; }
    public string EpisodeType { get; set; }
    public bool HasAired { get; set; }
}
```

---

## 13. First Implementation Milestone

### Milestone 1: Basic Airing Tracker (2-3 weeks)

**Deliverables:**
1. AniDB UDP client with rate limiting and caching
2. `AniDBAiringService` with calendar and episode lookup
3. API endpoint: `GET /api/v3/anidb/airing?anidbId={int}`
4. Series model extended with `AniDBId` property
5. Database migration for AniDB mapping table
6. "Next Episode" card on series detail page
7. AniDB link in external links (similar to JKAnime)

**Exit Criteria:**
- User can view next airing episode for any AniDB-mapped series
- Calendar shows anime airing schedule
- Rate limits respected (no bans)
- Cache hit rate > 80% after warmup

**Out of Scope (Future Milestones):**
- MyList sync
- File hash matching
- Relationship graph
- Character metadata

---

## 14. Comparison with Existing Tools

| Feature | Animarr Goal | Shoko | Medusa | Current Sonarr |
|---------|-------------|-------|--------|----------------|
| AniDB airing dates | Yes | Yes | Partial | No |
| Next episode display | Yes | Yes | No | No |
| Calendar integration | Yes | Partial | No | No |
| Rate limit handling | Yes | Yes | N/A | N/A |
| Local caching | Yes | Yes | N/A | N/A |
| ID mapping | Yes | Yes | Manual | TVDB only |

---

## 15. References

- [AniDB HTTP API Definition](https://wiki.anidb.net/HTTP_API_Definition)
- [AniDB UDP API Definition](https://wiki.anidb.net/UDP_API_Definition)
- [AniDB API Overview](https://wiki.anidb.net/API)
- [AniDB Client Registration](https://anidb.net/animedb/clientadd)
- [AniDB TV Schedule](http://wiki.anidb.net/TV_schedule)
- [AniDB Forum: UDP API Documentation](https://anidb.net/forum/thread/796290)
- [AniDB Forum: Season Chart via API](https://anidb.net/forum/thread/102740)
- [go-anidb HTTP Client](https://github.com/Jessidhia/go-anidb)
- [anidb-udp-client (npm)](https://www.npmjs.com/package/anidb-udp-client)

---

## 16. Open Questions

1. **Should we use UDP or HTTP API?** — Recommendation: UDP for calendar/episode data, HTTP as fallback
2. **How to handle AniDB account requirement?** — Option: Allow optional AniDB credentials, graceful degradation without
3. **What about non-registered users?** — AniDB requires registration; consider alternative data source for basic airing info
4. **Cache invalidation strategy?** — Time-based (6h for calendar, 24h for anime data)
5. **Fallback when AniDB unavailable?** — Use TVDB air dates as fallback (less accurate for anime)

---

*Document created: 2026-06-21*
*Status: Research Only — No Implementation*
*Next Review: Before Phase D implementation*
