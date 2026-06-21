# DECISIONS.md - Animarr Architectural Decisions

## Decision Log

### 1. Fork Strategy

**Decision:** Fork Sonarr v5-develop as base
**Date:** 2026-06-20
**Status:** Accepted

**Rationale:**
- Sonarr is mature, well-maintained PVR
- Strong community and plugin ecosystem
- Similar use case (media management)
- Can upstream non-anime-specific improvements

**Tradeoffs:**
+ Proven codebase and architecture
+ Existing community and documentation
+ Regular security updates
- Must track upstream changes
- Technical debt from Sonarr branding
- May diverge significantly over time

---

### 2. Phase 1 Scope

**Decision:** Visual rebranding only for Phase 1
**Date:** 2026-06-20
**Status:** Accepted

**Rationale:**
- Minimize risk of breaking changes
- Allow gradual transition
- Focus on user-facing identity first
- Backend changes require coordinated effort

**Tradeoffs:**
+ Safe, non-breaking changes
+ Quick visual impact
+ Easy to test and verify
- Backend still shows Sonarr references
- API contracts remain unchanged
- May confuse users seeing mixed branding

---

### 3. Color Palette Direction

**Decision:** Violet/Magenta/Pink anime-themed palette
**Date:** 2026-06-20
**Status:** Proposed

**Rationale:**
- Distinct from Sonarr (blue)
- Distinct from Radarr (blue)
- Distinct from other *arr apps
- Anime aesthetic association
- Modern, vibrant feel

**Tradeoffs:**
+ Unique brand identity
+ Anime cultural association
+ Professional yet playful
- Must ensure accessibility (contrast)
- May not appeal to all users
- Requires testing in both themes

---

### 4. Namespace Preservation

**Decision:** Keep NzbDrone namespaces in Phase 1
**Date:** 2026-06-20
**Status:** Accepted

**Rationale:**
- Renaming namespaces is high-risk
- Requires updating all C# files
- May break plugin compatibility
- Can be done in Phase 2

**Tradeoffs:**
+ Zero risk of backend breakage
+ Maintains plugin compatibility
+ Faster Phase 1 delivery
- Internal code references legacy name
- May confuse developers
- Technical debt accumulation

---

### 5. window.Sonarr Preservation

**Decision:** Keep window.Sonarr global in Phase 1
**Date:** 2026-06-20
**Status:** Accepted

**Rationale:**
- Backend injects this object
- Used in 40+ frontend files
- Changing requires coordinated backend update
- Low user visibility

**Tradeoffs:**
+ No frontend breakage
+ Backend compatibility maintained
+ Easy Phase 1
- Inconsistent branding in code
- May confuse developers
- Requires Phase 2 coordination

---

### 6. Distribution Asset Strategy

**Decision:** Generate distribution assets with Pillow
**Date:** 2026-06-20
**Status:** Accepted

**Rationale:**
- Pillow available on Windows
- Can create ICNS, BMP, and other formats
- Single source (Logo/1024.png) for all assets

**Tradeoffs:**
+ No external tools required
+ Consistent branding across platforms
+ Easy to regenerate
- Limited ICNS size options
- BMP generation requires specific dimensions

---

## Future Decisions Pending

### 6. Anime Metadata Providers
- MAL vs AniList vs Kitsu
- API key management
- Rate limiting strategy

### 7. Plugin Compatibility
- Support Sonarr plugins?
- Create Animarr-specific plugin API?
- Migration strategy?

### 8. Update Mechanism
- Independent from Sonarr?
- Shared infrastructure?
- Self-hosted updates?

### 9. Community Platform
- Discord server?
- Forums?
- Reddit community?
