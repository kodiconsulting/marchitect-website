# Cowork → Portal Oracle Sync

**Date:** 2026-04-08
**Status:** Approved for implementation

## Overview

After running a workshop in Cowork, structured Oracle field data (brand positioning, customer avatars, offer architecture, competitive landscape, channel strategy) needs to flow into the Marchitect Portal's database. This design defines the pull/push workflow, the skill set, the Portal API additions, and the mapping layer that connects workshop markdown sections to Oracle fields.

The mental model is git-style: **pull before you work, push when you're done.**

---

## Scope

- **In scope:** Oracle fields only — 5 of 6 categories initially (Brand & Positioning, Customer Avatars, Offer Architecture, Competitive Landscape, Channel Strategy). Company Identity deferred — likely populated via intake form, not workshops.
- **Out of scope (Phase 2):** Audit scores, Goals, KPIs, Rocks, bidirectional real-time sync

---

## Components

### 1. Portal API — Two New Endpoints

Both endpoints share the same path and use the existing `x-api-key` header auth (SHA-256 hashed key looked up in `workspace_api_keys`).

#### `GET /api/workspaces/[id]/oracle/sync`
Returns all Oracle fields for the workspace as a flat JSON structure grouped by category. Used by `portal-pull` to build the snapshot.

**Response:**
```json
{
  "Brand & Positioning": {
    "positioning_statement": "...",
    "mission_statement": "..."
  },
  "Customer Avatars": {
    "primary_avatar_summary": "..."
  }
}
```

Fields with no value are omitted from the response.

#### `POST /api/workspaces/[id]/oracle/sync`
Accepts a partial or full Oracle payload and upserts each field using the existing `onConflictDoUpdate` pattern already used across the codebase. Only fields present in the payload are touched — absent fields are left unchanged.

**Request body:**
```json
{
  "fields": [
    {
      "category": "Brand & Positioning",
      "fieldName": "positioning_statement",
      "fieldValue": "We help multi-location dental groups..."
    }
  ],
  "updatedBy": "cowork"
}
```

**Response:**
```json
{
  "synced": 3,
  "skipped": 0,
  "fields": ["positioning_statement", "mission_statement", "primary_avatar_summary"]
}
```

---

### 2. Sandbox Structure

```
Sandbox/
  marchitect-portal/
    mapping.json              ← section header → Oracle category + field name
  Clients/
    [ClientName]/
      .portal.json            ← workspaceId + apiKey for this client
      portal-snapshot.md      ← human-readable Oracle dump, refreshed on pull
      Overview.md
      Workshops/
        YYYY-MM-DD-[topic].md
```

#### `.portal.json`
```json
{
  "workspaceId": "abc-123",
  "apiKey": "sk-..."
}
```

One file per client folder. Created once when a client is onboarded to the Portal.

#### `portal-snapshot.md`
Human-readable markdown dump of current Portal Oracle state. Updated automatically after every pull and every successful push. Claude reads this as context during workshops so it knows what's already in the Portal.

```markdown
# Portal Snapshot — [ClientName]
Last pulled: 2026-04-08T10:30:00Z

## Brand & Positioning
**Positioning Statement:** We help multi-location dental groups...
**Mission Statement:** (empty)

## Customer Avatars
**Primary Avatar Summary:** Practice owner, 40-55, 3-10 locations...
```

#### `marchitect-portal/mapping.json`
Maps workshop markdown section headers to Oracle category + field name. Lives at the sandbox level (shared across all clients). Updated via `portal-discover` or manually.

```json
{
  "Positioning Statement":      { "category": "Brand & Positioning", "field": "positioning_statement" },
  "Mission Statement":          { "category": "Brand & Positioning", "field": "mission_statement" },
  "Origin Story":               { "category": "Brand & Positioning", "field": "origin_story" },
  "Diagnostic Trust Statement": { "category": "Brand & Positioning", "field": "diagnostic_trust_statement" },
  "Identity Statement":         { "category": "Brand & Positioning", "field": "identity_statement" },
  "Credibility Statement":      { "category": "Brand & Positioning", "field": "credibility_statement" },
  "Market Explanation":         { "category": "Brand & Positioning", "field": "market_explanation" },
  "Onliness Statement":         { "category": "Brand & Positioning", "field": "onliness_statement" },
  "Enemy Definition":           { "category": "Brand & Positioning", "field": "enemy_definition" },
  "Who We Are Not For":         { "category": "Brand & Positioning", "field": "who_we_are_not_for_statement" },
  "Primary Avatar":             { "category": "Customer Avatars",    "field": "primary_avatar_summary" },
  "Primary Avatar Demographics":{ "category": "Customer Avatars",    "field": "primary_avatar_demographics" },
  "Primary Avatar Pain Points": { "category": "Customer Avatars",    "field": "primary_avatar_pain_points" },
  "Primary Avatar Goals":       { "category": "Customer Avatars",    "field": "primary_avatar_goals" },
  "Secondary Avatar":           { "category": "Customer Avatars",    "field": "secondary_avatar_summary" },
  "Front End Offer":            { "category": "Offer Architecture",  "field": "front_end_offer" },
  "Core Offer":                 { "category": "Offer Architecture",  "field": "core_offer" },
  "Backend Offers":             { "category": "Offer Architecture",  "field": "backend_offers" },
  "Offer Ladder":               { "category": "Offer Architecture",  "field": "offer_ladder_summary" },
  "Primary Competitors":        { "category": "Competitive Landscape","field": "primary_competitors" },
  "Competitor Strengths":       { "category": "Competitive Landscape","field": "competitor_strengths" },
  "Competitor Weaknesses":      { "category": "Competitive Landscape","field": "competitor_weaknesses" },
  "White Space":                { "category": "Competitive Landscape","field": "white_space_analysis" },
  "Key Differentiators":        { "category": "Competitive Landscape","field": "key_differentiators" },
  "Active Channels":            { "category": "Channel Strategy",    "field": "active_channels" },
  "Channel Budget Allocation":  { "category": "Channel Strategy",    "field": "channel_budget_allocation" },
  "Inactive Channels":          { "category": "Channel Strategy",    "field": "inactive_channels" },
  "Channel Benchmarks":         { "category": "Channel Strategy",    "field": "channel_benchmarks" }
}
```

This mapping is the initial set based on the current Oracle schema. It is incomplete by design — new entries are added via `portal-discover` as workshops evolve.

---

### 3. Three Cowork Skills

All skills live in the Cowork sandbox's `Skills/` folder under `marchitect-portal/`.

---

#### `portal-pull`

**Purpose:** Fetch current Oracle state from Portal → write `portal-snapshot.md` in client folder.

**Triggered by:**
- CLAUDE.md instruction at session start when a client context is active
- Workshop process files as their first step
- Manual invocation ("pull portal data for [client]")

**Steps:**
1. Read `.portal.json` from the active client folder
2. Call `GET /api/workspaces/[id]/oracle/sync` with the API key
3. Write `portal-snapshot.md` to the client folder in human-readable markdown
4. Confirm: "Portal snapshot updated for [ClientName]. Last pulled: [timestamp]"

---

#### `portal-sync`

**Purpose:** Extract Oracle fields from a workshop file → diff against live Portal → confirm → push.

**Triggered by:** Manual invocation after a workshop ("sync this workshop to the portal").

**Steps:**

1. **Identify target file** — use the most recent workshop file in `Workshops/`, or accept a specific filename
2. **Extract sections** — parse all `## Section Header` blocks from the markdown
3. **Map to Oracle fields** — look up each header in `mapping.json`. Unmapped sections are logged but not pushed
4. **Fetch live Portal state** — call `GET /api/workspaces/[id]/oracle/sync` (fresh, not snapshot)
5. **Show diff** — for each mapped field:
   - If value unchanged: skip silently
   - If new value differs from current: show current vs. new
   - If field is empty in Portal: show as new
6. **Confirm** — present options: push all / pick individual fields / abort
7. **Push** — call `POST /api/workspaces/[id]/oracle/sync` with confirmed fields only
8. **Update snapshot** — rewrite `portal-snapshot.md` with the new state
9. **Report** — "Pushed 4 fields, skipped 2 (unchanged), skipped 1 (no mapping for 'Workshop Notes')"

**Diff output format:**
```
Brand & Positioning > positioning_statement
  CURRENT: "We help dental practices grow..."
  NEW:     "We help multi-location dental groups build..."

Customer Avatars > primary_avatar_summary
  CURRENT: (empty)
  NEW:     "Practice owner, 40-55, 3-10 locations..."

Push all? [yes / pick / abort]
```

---

#### `portal-discover`

**Purpose:** Map unmapped workshop section headers to Oracle fields interactively.

**Triggered by:** Manual invocation when `portal-sync` reports unmapped sections, or proactively when building a new workshop process.

**Steps:**
1. Read all `## Section Header` blocks from the target workshop file
2. Cross-reference against `mapping.json` — identify unmapped headers
3. For each unmapped header, show the available Oracle fields (grouped by category) and ask the user to assign or skip
4. Write new entries to `mapping.json`
5. Confirm: "Added 3 new mappings to mapping.json"

---

## Workflow Summary

```
Session opens for [ClientName]
  └─ portal-pull runs automatically
       └─ portal-snapshot.md updated

Workshop runs
  └─ Claude references portal-snapshot.md as context
  └─ Workshop output written to Workshops/YYYY-MM-DD-[topic].md

After workshop
  └─ portal-sync invoked
       ├─ Extracts sections from workshop file
       ├─ Maps via mapping.json
       ├─ Fetches live Portal state (fresh GET)
       ├─ Shows diff
       ├─ User confirms
       ├─ Pushes to Portal
       └─ portal-snapshot.md updated

If unmapped sections found
  └─ portal-discover invoked to extend mapping.json
```

---

## Auth & Security

- API keys are stored in `.portal.json` per client folder — plaintext in the Cowork sandbox (sandboxed Linux environment, not committed to the Portal repo)
- The Portal stores only the SHA-256 hash of the key, validated on each request
- The sync endpoints validate that the API key belongs to the workspace in the URL — a key from client A cannot push to client B's workspace

---

## Testing Before Full Completion

The system is designed to be testable incrementally:

1. **Portal side:** Deploy the two sync endpoints. Test with a `curl` or Postman call using a real workspace API key.
2. **Cowork side:** Add one mapping entry to `mapping.json`. Create a test workshop file with that one section. Run `portal-sync` — verify the field appears in the Portal UI.
3. **Expand:** Add mapping entries one at a time as workshop processes are defined.

Nothing in this design requires the full Oracle schema, all workshop processes, or the complete Portal frontend to be complete before the first push works.

---

## Open Items (Not In Scope Here)

- Workshop process files themselves (how each workshop type produces its markdown output) — separate design
- Phase 2: Audit score sync, Goal/KPI/Rock sync
- Phase 2: Portal MCP server for interactive (mid-workshop) field updates
- Company Identity Oracle category (company_name, website_url, etc.) — likely populated via intake form, not workshops; confirm before mapping
