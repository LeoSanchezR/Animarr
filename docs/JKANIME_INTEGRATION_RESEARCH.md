# JKANIME_INTEGRATION_RESEARCH.md - JKAnime Search/Discovery Integration Research

## Executive Summary

JKAnime (jkanime.net) is a Spanish-language anime streaming site that could serve as a **search/discovery helper** for Animarr, specifically for:
- Finding anime by Spanish titles
- Matching anime across databases using alternative titles
- Detecting season information
- Providing Spanish-language metadata

**Scope:** Search and discovery only. No media downloading, streaming extraction, or DRM bypass.

---

## 1. JKAnime Site Structure

### Current Domain
- **Primary:** `jkanime.net`
- **Known mirrors:** `jkanime.lol`, `jkanime.fun`, `jkanime.cam`, `jkanime.bz`, `jkanime.city`, `jkanime.rest`, `jkanime.stream`
- **Note:** Domain rotates frequently; integration should use configurable base URL

### URL Structure

| Page Type | URL Pattern | Example |
|-----------|-------------|---------|
| Search results | `/buscar/{query}` | `/buscar/one+piece` |
| Anime detail | `/{anime-slug}/` | `/one-piece/` |
| Episode playback | `/{anime-slug}/{episode}` | `/one-piece/1166` |
| Directory (A-Z) | `/directorio?p={page}` | `/directorio?p=32` |
| Genre filter | `/genero/{genre}` | `/genero/accion` |
| Airing schedule | `/emision/` | — |
| Weekly schedule | `/horario` | — |
| Random anime | `/aleatorio` | — |

### Directory Filters

The `/directorio` page supports filtering by:
- **Genre:** Accion, Aventura, Comedia, Fantasia, Shounen, etc.
- **Letter:** A-Z
- **Demographic:** Shounen, Seinen, Josei, Shojo
- **Category:** Donghua, Latino
- **Type:** Anime, Pelicula, Especial, OVA, ONA
- **Status:** En emision, Concluido
- **Year:** Any year
- **Season:** Invierno, Primavera, Verano, Otoño
- **Sort order:** Various

---

## 2. Available Metadata

Each anime detail page provides:

| Field | Description | Example |
|-------|-------------|---------|
| **Title** | Japanese original title | `ONE PIECE` |
| **Alternative titles** | Sinonimos, English, Japanese | `ワンピース`, `One Piece` |
| **Type** | Serie, Pelicula, OVA, Especial, ONA | `Serie` |
| **Genres** | Genre tags | `Accion, Aventura, Comedia, Shounen` |
| **Studios** | Animation studios | `Toei Animation` |
| **Season/Air date** | Season and year | `Otoño 1999` |
| **Demographic** | Target audience | `Shounen` |
| **Episode count** | Total episodes | `1100+` |
| **Episode duration** | Runtime per episode | `24 min. por episodio` |
| **Air date** | First air date | `Miercoles, 20 de Octubre de 1999` |
| **Status** | Airing status | `En emision` / `Concluido` |
| **Quality** | Video quality | `720p` |
| **Synopsis** | Description (Spanish) | Full Spanish synopsis |
| **User ratings** | Vote count | `11963 Votar anime` |
| **Characters** | Character list | Character names |
| **Related anime** | OVAs, movies, specials | Linked entries |
| **Trailer** | Community-contributed | YouTube link |

### Key Metadata for Animarr Integration

**Most valuable fields:**
1. **Alternative titles** — Spanish, English, Japanese, Romaji
2. **Type** — Distinguishes Serie/Pelicula/OVA/Especial/ONA
3. **Season** — Invierno/Primavera/Verano/Otoño + Year
4. **Status** — En emision/Concluido
5. **Episode count** — Total episodes
6. **Genres** — Spanish genre tags

---

## 3. What JKAnime Could Provide

### Search/Discovery Use Cases

1. **Spanish title matching**
   - JKAnime has Spanish titles that don't exist in TVDB/AniDB
   - Could map Spanish titles → TVDB IDs via AniList/MAL cross-reference

2. **Alternative title discovery**
   - Each anime page lists multiple alternative titles
   - Could enrich Animarr's alternate title database

3. **Season detection**
   - JKAnime categorizes by season (Invierno/Primavera/Verano/Otoño)
   - Could improve season mapping for anime

4. **Type classification**
   - JKAnime distinguishes Serie/Pelicula/OVA/Especial/ONA
   - Could inform Animarr's anime type system

5. **Genre/tag enrichment**
   - Spanish genre tags could be translated and added to Animarr

### Example Flow

```
User searches "ワンピース" or "One Piece" or "One Piece TV"
    ↓
Animarr queries JKAnime search endpoint
    ↓
JKAnime returns: { slug: "one-piece", title: "ONE PIECE", alt_titles: [...], type: "Serie" }
    ↓
Animarr cross-references slug/title with AniList/MAL to find TVDB ID
    ↓
User confirms mapping (or auto-matches if confidence is high)
    ↓
Animarr stores Spanish title as additional alternate title
```

---

## 4. What Should NOT Be Implemented

| Prohibition | Reason |
|-------------|--------|
| Media downloading | Copyright infringement |
| Streaming extraction | DRM/copyright bypass |
| Captcha bypass | Access control circumvention |
| Authentication bypass | Unauthorized access |
| Rate limit circumvention | Service abuse |
| Content scraping for redistribution | Copyright infringement |
| Automated batch downloading | Terms of service violation |

---

## 5. Legal/Operational Risks

### Legal Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Copyright infringement (downloading) | **Critical** | Never download media |
| Terms of service violation | **High** | Read-only metadata access |
| DMCA/copyright claims | **High** | No content storage/redistribution |
| Domain instability | **Medium** | Configurable base URL |

### Operational Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Domain rotation | **High** | Configurable URL, fallback domains |
| Rate limiting | **Medium** | Respect robots.txt, rate limit requests |
| HTML structure changes | **Medium** | Robust parsing, graceful degradation |
| No official API | **Medium** | Use public pages only, maintain parsers |
| Site downtime | **Low** | Cached results, graceful fallback |

---

## 6. Technical Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| HTML parsing fragility | **Medium** | CSS selectors, fallback patterns |
| Anti-bot measures | **Medium** | Respect rate limits, user-agent rotation |
| JavaScript-rendered content | **Medium** | Use public HTML pages only |
| CAPTCHA challenges | **High** | Do not bypass; skip and log |
| IP blocking | **Medium** | Rate limit, cache results |

---

## 7. Recommended Safe Scope

### Phase 1: Research/Prototype (No Code Changes)

1. **Document JKAnime URL structure** (this document)
2. **Map metadata fields** to Animarr data model
3. **Identify cross-reference opportunities** with AniList/MAL
4. **Design integration API** (future implementation)

### Phase 2: Metadata Provider (Future, If Approved)

1. **JKAnime metadata provider** — Read-only, search-only
2. **Title matching** — Spanish/English/Japanese title resolution
3. **Season/type detection** — Use JKAnime's classification
4. **No media access** — Metadata only

### Phase 3: Alias Enrichment (Future, If Approved)

1. **Spanish title database** — Build from JKAnime search results
2. **Cross-reference with AniList/MAL** — Map to TVDB IDs
3. **User-curated aliases** — Allow manual title mapping

---

## 8. Possible Data Model

### JKAnime Search Result

```json
{
  "slug": "one-piece",
  "title": "ONE PIECE",
  "alternative_titles": {
    "sinonimos": ["ワンピース"],
    "english": ["One Piece"],
    "japanese": ["ONE PIECE"]
  },
  "type": "Serie",
  "genres": ["Accion", "Aventura", "Comedia", "Shounen"],
  "studio": "Toei Animation",
  "season": "Otoño",
  "year": 1999,
  "status": "En emision",
  "episodes": 1100,
  "synopsis": "Monkey D. Luffy..."
}
```

### Animarr Integration Model

```json
{
  "tvdb_id": 81797,
  "jkanime_slug": "one-piece",
  "jkanime_titles": {
    "spanish": "One Piece",
    "japanese": "ワンピース",
    "english": "One Piece"
  },
  "confidence": 0.95,
  "source": "jkanime",
  "last_verified": "2026-06-21"
}
```

---

## 9. robots.txt Analysis

```
User-agent: *
Disallow:
```

**Fully open.** No restrictions on crawling. However:
- This does NOT imply permission to download media
- Metadata scraping should still be respectful (rate limits, caching)
- Terms of service may apply beyond robots.txt

---

## 10. Third-Party API

A third-party Node.js scraper API exists:
- **Repository:** `chrismichaelps/jkanime` (GitHub)
- **License:** MIT
- **Status:** Unmaintained since May 2020
- **npm package:** `jkanime` (v2.0.4)
- **Endpoints:** `/api/v1/search/{query}`, `/api/v1/latestAnimes`, `/api/v1/video/{id}/{chapter}`
- **Demo:** Likely defunct (`jkanime.chrismichael.now.sh`)

**Recommendation:** Do NOT rely on third-party API. Use direct HTML parsing of public pages for reliability.

---

## Appendix: Example Search Flow

```
1. User adds anime to Animarr: "One Piece"
2. Animarr searches AniList/MAL: finds TVDB ID 81797
3. Animarr optionally queries JKAnime: "One Piece"
4. JKAnime returns slug: "one-piece", Spanish title: "One Piece"
5. Animarr stores Spanish title as alternate title
6. Future searches include Spanish title for Nyaa/Spanish indexers
7. User benefits: better matching for Spanish-subbed releases
```

---

## Appendix: Integration Points

| Animarr Component | JKAnime Integration | Priority |
|-------------------|---------------------|----------|
| Metadata providers | New JKAnime provider | Medium |
| Alternate titles | Spanish title enrichment | High |
| Search service | Spanish title search | Medium |
| Import lists | JKAnime watchlist import | Low |
| UI | Spanish title display | Low |
