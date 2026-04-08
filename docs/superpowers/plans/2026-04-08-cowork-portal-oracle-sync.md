# Cowork → Portal Oracle Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers-extended-cc:subagent-driven-development (recommended) or superpowers-extended-cc:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build two Portal API endpoints (`GET`/`POST /oracle/sync`) and three Cowork skills (`portal-pull`, `portal-sync`, `portal-discover`) so workshop Oracle data flows from Cowork into the Marchitect Portal database.

**Architecture:** The Portal exposes a bulk sync endpoint that accepts API key auth (already implemented in `lib/auth.ts`). Cowork skills read from `.portal.json` per client folder for credentials, call the endpoint via Python's `urllib`, and write a human-readable `portal-snapshot.md` for Claude's workshop context. A shared `mapping.json` maps workshop markdown section headers to Oracle field names.

**Tech Stack:** Next.js 16 App Router, TypeScript, Drizzle ORM (`drizzle-orm/pg-core`), Zod v4 (`zod/v4`), Node.js `crypto` module; Cowork sandbox uses Python `urllib` for HTTP calls.

---

## Important: Cowork Sandbox Path

Before starting Tasks 3–7, confirm your Cowork sandbox root path. Tasks below use `<SANDBOX_ROOT>` as a placeholder. Based on your existing files this is likely `/mnt/c/Users/Owner/Sandbox/` (WSL path) — verify before creating any files there.

---

## File Map

**Portal repo (`/home/mike/Projects/marchitect-website`):**
- Create: `app/api/workspaces/[id]/oracle/sync/route.ts` — GET + POST handlers
- Create: `scripts/create-api-key.ts` — utility to generate a workspace API key for testing

**Cowork sandbox (`<SANDBOX_ROOT>`):**
- Create: `marchitect-portal/mapping.json` — section header → Oracle field mapping table
- Create: `Skills/portal-pull.md` — skill: fetch Portal Oracle state → write snapshot
- Create: `Skills/portal-sync.md` — skill: diff workshop output vs Portal → push confirmed fields
- Create: `Skills/portal-discover.md` — skill: interactively map unmapped sections to Oracle fields
- Edit: `CLAUDE.md` — add auto-pull instruction for client session starts

---

## Task 1: Portal — GET + POST /oracle/sync endpoint

**Goal:** Create the sync route that Cowork calls to pull all Oracle data and push field updates using API key auth.

**Files:**
- Create: `app/api/workspaces/[id]/oracle/sync/route.ts`

**Acceptance Criteria:**
- [ ] `GET` with valid API key returns `{ "Brand & Positioning": { "positioning_statement": "..." } }` — values only, no metadata
- [ ] `GET` with session token also works (dual auth)
- [ ] `GET` with API key for workspace B returns 403 when URL says workspace A
- [ ] `POST` upserts each field in the `fields` array; absent fields are untouched
- [ ] `POST` returns `{ synced: N, skipped: 0, fields: [...fieldNames] }`
- [ ] `POST` with invalid body returns 400
- [ ] Missing/invalid auth returns 401

**Verify:** Run all six curl commands in Step 3 and confirm each matches its expected output.

**Steps:**

- [ ] **Step 1: Create the route file**

Create `app/api/workspaces/[id]/oracle/sync/route.ts` with this exact content:

```typescript
import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { oracleFields } from '@/lib/db/schema'
import { requireAuth } from '@/lib/auth'

function assertWorkspaceAccess(workspaceIds: string[], id: string): void {
  if (!workspaceIds.includes(id)) {
    throw Response.json({ error: 'Forbidden' }, { status: 403 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    assertWorkspaceAccess(auth.workspaceIds, id)

    const rows = await db
      .select()
      .from(oracleFields)
      .where(eq(oracleFields.workspaceId, id))

    const grouped: Record<string, Record<string, unknown>> = {}
    for (const row of rows) {
      if (!grouped[row.category]) grouped[row.category] = {}
      grouped[row.category][row.fieldName] = row.fieldValue
    }

    return Response.json(grouped)
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const syncFieldSchema = z.object({
  category: z.string().min(1),
  fieldName: z.string().min(1),
  fieldValue: z.unknown(),
})

const postSchema = z.object({
  fields: z.array(syncFieldSchema).min(1),
  updatedBy: z.string().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request)
    const { id } = await params
    assertWorkspaceAccess(auth.workspaceIds, id)

    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const { fields, updatedBy = 'cowork' } = parsed.data
    const now = new Date()

    await Promise.all(
      fields.map(({ category, fieldName, fieldValue }) =>
        db
          .insert(oracleFields)
          .values({
            workspaceId: id,
            category,
            fieldName,
            fieldValue: fieldValue as Parameters<typeof db.insert>[0] extends never ? never : unknown,
            lastUpdated: now,
            updatedBy,
          })
          .onConflictDoUpdate({
            target: [oracleFields.workspaceId, oracleFields.category, oracleFields.fieldName],
            set: {
              fieldValue: fieldValue as Parameters<typeof db.insert>[0] extends never ? never : unknown,
              lastUpdated: now,
              updatedBy,
            },
          })
      )
    )

    return Response.json({
      synced: fields.length,
      skipped: 0,
      fields: fields.map((f) => f.fieldName),
    })
  } catch (e) {
    if (e instanceof Response) return e
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

Note on the `fieldValue` cast: this matches the pattern used in `app/api/workspaces/[id]/oracle/[category]/route.ts:84` — it is required to satisfy TypeScript's strict inference on Drizzle's JSONB insert type.

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /home/mike/Projects/marchitect-website
npx tsc --noEmit
```

Expected: no errors. If you see a type error on `fieldValue`, the cast on lines 73 and 81 of the route file matches the existing pattern at `oracle/[category]/route.ts:84-92` — verify the cast is identical.

- [ ] **Step 3: Commit**

```bash
git add app/api/workspaces/\[id\]/oracle/sync/route.ts
git commit -m "feat: add GET/POST /oracle/sync endpoint for Cowork API key access"
```

---

## Task 2: Portal — API key generation script

**Goal:** Create a small script to generate a workspace API key so the endpoint can be tested end-to-end. (There is no API key management UI yet — this fills the gap for dev/test use.)

**Files:**
- Create: `scripts/create-api-key.ts`

**Acceptance Criteria:**
- [ ] Running the script with a valid workspace UUID prints a raw API key (prefixed `sk-`)
- [ ] The key's SHA-256 hash is inserted into `workspace_api_keys` and can be found via the DB
- [ ] Running the script with no args prints usage and exits 1

**Verify:**
```bash
npx tsx scripts/create-api-key.ts <some-workspace-uuid>
# Should print: Raw API key (save this): sk-<64 hex chars>
```

**Steps:**

- [ ] **Step 1: Create the script**

Create `scripts/create-api-key.ts`:

```typescript
import { db } from '../lib/db'
import { workspaceApiKeys } from '../lib/db/schema'
import { createHash, randomBytes } from 'crypto'

const workspaceId = process.argv[2]
if (!workspaceId) {
  console.error('Usage: npx tsx scripts/create-api-key.ts <workspaceId>')
  process.exit(1)
}

const rawKey = `sk-${randomBytes(32).toString('hex')}`
const keyHash = createHash('sha256').update(rawKey).digest('hex')

await db.insert(workspaceApiKeys).values({ workspaceId, keyHash })

console.log('Raw API key (save this — it cannot be recovered):')
console.log(rawKey)
console.log()
console.log(`Workspace: ${workspaceId}`)
```

- [ ] **Step 2: Run against a real workspace to get a test key**

You need a workspace ID first. If no workspaces exist in your local DB yet, create one:

```bash
curl -s -X POST http://localhost:3000/api/workspaces \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $(node -e "console.log(Buffer.from(JSON.stringify({userId:'test-user',role:'admin',workspaceIds:[]})).toString('base64url'))")" \
  -d '{"clientName":"Test Client"}' | jq .
```

Note the `id` field from the response. Then generate an API key:

```bash
npx tsx scripts/create-api-key.ts <workspace-id-from-above>
```

Save the printed raw key — you will need it for Cowork's `.portal.json` and for the curl tests in the next step.

- [ ] **Step 3: Smoke test the endpoint with curl**

With `npm run dev` running in a separate terminal:

```bash
WORKSPACE_ID=<your-workspace-id>
API_KEY=<your-raw-key>

# Test GET — should return {} (empty workspace)
curl -s http://localhost:3000/api/workspaces/$WORKSPACE_ID/oracle/sync \
  -H "x-api-key: $API_KEY" | jq .

# Test POST — push one field
curl -s -X POST http://localhost:3000/api/workspaces/$WORKSPACE_ID/oracle/sync \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"fields":[{"category":"Brand & Positioning","fieldName":"positioning_statement","fieldValue":"We help multi-location dental groups build scalable marketing systems."}]}' | jq .
# Expected: {"synced":1,"skipped":0,"fields":["positioning_statement"]}

# Test GET again — should now return the pushed field
curl -s http://localhost:3000/api/workspaces/$WORKSPACE_ID/oracle/sync \
  -H "x-api-key: $API_KEY" | jq .
# Expected: {"Brand & Positioning":{"positioning_statement":"We help multi-location dental groups..."}}

# Test 401 — missing API key
curl -s http://localhost:3000/api/workspaces/$WORKSPACE_ID/oracle/sync | jq .
# Expected: {"error":"Unauthorized"}

# Test 403 — wrong workspace (use a different UUID)
curl -s http://localhost:3000/api/workspaces/00000000-0000-0000-0000-000000000000/oracle/sync \
  -H "x-api-key: $API_KEY" | jq .
# Expected: {"error":"Forbidden"}

# Test 400 — bad POST body
curl -s -X POST http://localhost:3000/api/workspaces/$WORKSPACE_ID/oracle/sync \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"fields":[]}' | jq .
# Expected: {"error":"..."} with status 400
```

All six checks should match expected output before continuing.

- [ ] **Step 4: Commit**

```bash
git add scripts/create-api-key.ts
git commit -m "feat: add create-api-key script for dev/test use"
```

---

## Task 3: Cowork — Config foundation

**Goal:** Create the `mapping.json` file with initial section→field mappings, and document the `.portal.json` structure that each client folder needs.

**Files:**
- Create: `<SANDBOX_ROOT>/marchitect-portal/mapping.json`
- (Reference only, not created here): `<SANDBOX_ROOT>/Clients/<ClientName>/.portal.json`

**Acceptance Criteria:**
- [ ] `mapping.json` exists at `<SANDBOX_ROOT>/marchitect-portal/mapping.json`
- [ ] All 28 initial entries are present and use exact Oracle field names from the schema
- [ ] A `.portal.json` has been created for at least one real client folder

**Steps:**

- [ ] **Step 1: Create the directory and mapping file**

Create `<SANDBOX_ROOT>/marchitect-portal/mapping.json`:

```json
{
  "Positioning Statement":       { "category": "Brand & Positioning",  "field": "positioning_statement" },
  "Mission Statement":           { "category": "Brand & Positioning",  "field": "mission_statement" },
  "Origin Story":                { "category": "Brand & Positioning",  "field": "origin_story" },
  "Diagnostic Trust Statement":  { "category": "Brand & Positioning",  "field": "diagnostic_trust_statement" },
  "Identity Statement":          { "category": "Brand & Positioning",  "field": "identity_statement" },
  "Credibility Statement":       { "category": "Brand & Positioning",  "field": "credibility_statement" },
  "Market Explanation":          { "category": "Brand & Positioning",  "field": "market_explanation" },
  "Onliness Statement":          { "category": "Brand & Positioning",  "field": "onliness_statement" },
  "Enemy Definition":            { "category": "Brand & Positioning",  "field": "enemy_definition" },
  "Who We Are Not For":          { "category": "Brand & Positioning",  "field": "who_we_are_not_for_statement" },
  "Primary Avatar":              { "category": "Customer Avatars",     "field": "primary_avatar_name" },
  "Primary Avatar Demographics": { "category": "Customer Avatars",     "field": "primary_avatar_demographics" },
  "Primary Avatar Psychographics":{ "category": "Customer Avatars",    "field": "primary_avatar_psychographics" },
  "Primary Avatar Pain Points":  { "category": "Customer Avatars",     "field": "primary_avatar_pain_points" },
  "Primary Avatar Goals":        { "category": "Customer Avatars",     "field": "primary_avatar_goals" },
  "Primary Avatar Awareness":    { "category": "Customer Avatars",     "field": "primary_avatar_awareness_level" },
  "Secondary Avatar":            { "category": "Customer Avatars",     "field": "secondary_avatar_name" },
  "Secondary Avatar Summary":    { "category": "Customer Avatars",     "field": "secondary_avatar_summary" },
  "Front End Offer":             { "category": "Offer Architecture",   "field": "front_end_offer" },
  "Core Offer":                  { "category": "Offer Architecture",   "field": "core_offer" },
  "Backend Offers":              { "category": "Offer Architecture",   "field": "backend_offers" },
  "Offer Ladder":                { "category": "Offer Architecture",   "field": "offer_ladder_summary" },
  "Primary Competitors":         { "category": "Competitive Landscape","field": "primary_competitors" },
  "Competitor Strengths":        { "category": "Competitive Landscape","field": "competitor_strengths" },
  "Competitor Weaknesses":       { "category": "Competitive Landscape","field": "competitor_weaknesses" },
  "White Space":                 { "category": "Competitive Landscape","field": "white_space_analysis" },
  "Key Differentiators":         { "category": "Competitive Landscape","field": "key_differentiators" },
  "Active Channels":             { "category": "Channel Strategy",     "field": "active_channels" },
  "Channel Budget Allocation":   { "category": "Channel Strategy",     "field": "channel_budget_allocation" },
  "Inactive Channels":           { "category": "Channel Strategy",     "field": "inactive_channels" },
  "Channel Benchmarks":          { "category": "Channel Strategy",     "field": "channel_benchmarks" }
}
```

- [ ] **Step 2: Create `.portal.json` for the first real client**

For each client that has a Portal workspace, create `<SANDBOX_ROOT>/Clients/<ClientName>/.portal.json`:

```json
{
  "workspaceId": "<uuid from Portal workspace>",
  "apiKey": "<raw key from create-api-key.ts output>",
  "baseUrl": "http://localhost:3000"
}
```

Change `baseUrl` to the production URL when the Portal is deployed. For now, `http://localhost:3000` targets local dev.

The `workspaceId` comes from the Portal DB (the `id` column of the `workspaces` table for this client). The `apiKey` is the raw key printed by `scripts/create-api-key.ts` when run against that workspace.

---

## Task 4: Cowork — portal-pull skill

**Goal:** Create the skill instruction file that Claude follows to fetch current Portal Oracle state and write `portal-snapshot.md` for a client.

**Files:**
- Create: `<SANDBOX_ROOT>/Skills/portal-pull.md`

**Acceptance Criteria:**
- [ ] File exists at `<SANDBOX_ROOT>/Skills/portal-pull.md`
- [ ] Running the skill in Cowork for a client with a populated `.portal.json` successfully writes `portal-snapshot.md` to that client's folder
- [ ] Snapshot format is human-readable with proper section headers and field labels

**Steps:**

- [ ] **Step 1: Create the skill file**

Create `<SANDBOX_ROOT>/Skills/portal-pull.md`:

````markdown
# portal-pull

Fetch the current Oracle state from the Marchitect Portal for the active client and write it to `portal-snapshot.md` in the client folder.

## When to use
- At the start of any session where a specific client is the focus
- Before starting a workshop
- When the user asks to refresh Portal data

## Steps

1. **Identify the active client.** Determine from context (e.g., the user mentioned a client name, you are in a client folder). If ambiguous, ask: "Which client should I pull Portal data for?"

2. **Read `.portal.json`.** Read `<SANDBOX_ROOT>/Clients/<ClientName>/.portal.json` and extract `workspaceId`, `apiKey`, and `baseUrl` (default `http://localhost:3000` if absent).

3. **Fetch Oracle data from the Portal.** Run this Python script via the shell, substituting actual values for `WORKSPACE_ID`, `API_KEY`, and `BASE_URL`:

```python
import json, urllib.request, urllib.error, sys

workspace_id = 'WORKSPACE_ID'
api_key = 'API_KEY'
base_url = 'BASE_URL'

req = urllib.request.Request(
    f'{base_url}/api/workspaces/{workspace_id}/oracle/sync',
    headers={'x-api-key': api_key}
)
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        print(json.dumps(data))
except urllib.error.HTTPError as e:
    print(f'HTTP Error {e.code}: {e.read().decode()}', file=sys.stderr)
    sys.exit(1)
except urllib.error.URLError as e:
    print(f'Connection error: {e.reason}', file=sys.stderr)
    sys.exit(1)
```

4. **Format and write `portal-snapshot.md`.** Parse the JSON response and write `<SANDBOX_ROOT>/Clients/<ClientName>/portal-snapshot.md` using this format:

```
# Portal Snapshot — <ClientName>
Last pulled: <current ISO 8601 timestamp>

## <Category Name>
**<Field Name as Title Case>:** <value as string, or "(empty)" if null>

## <Next Category>
**<Field Name>:** <value>
```

Field name formatting: replace underscores with spaces, convert to Title Case (e.g. `positioning_statement` → "Positioning Statement"). Only include categories/fields present in the response. If the response is `{}`, write a note: "(No Oracle data in Portal yet.)"

5. **Confirm.** Report to the user:
"Portal snapshot updated for <ClientName>. Last pulled: <timestamp>. <N> fields across <M> categories."
````

- [ ] **Step 2: Test in Cowork**

In Cowork, with a client whose `.portal.json` is set up (Task 3, Step 2), invoke the skill:

> "Run portal-pull for [ClientName]"

Verify that `<SANDBOX_ROOT>/Clients/<ClientName>/portal-snapshot.md` is created or updated with the current Portal content (including the positioning_statement pushed during Task 2's smoke test).

---

## Task 5: Cowork — portal-sync skill

**Goal:** Create the skill that extracts Oracle data from a workshop file, diffs it against live Portal state, shows a confirmation prompt, and pushes approved changes.

**Files:**
- Create: `<SANDBOX_ROOT>/Skills/portal-sync.md`

**Acceptance Criteria:**
- [ ] Skill correctly extracts H2 sections from a workshop markdown file
- [ ] Mapped sections are diffed against live Portal data (fresh GET, not snapshot)
- [ ] Unchanged fields are silently skipped
- [ ] Diff is shown before any write
- [ ] Only confirmed fields are pushed
- [ ] `portal-snapshot.md` is updated after a successful push
- [ ] Unmapped sections appear in the final report (not pushed, not errored)

**Steps:**

- [ ] **Step 1: Create the skill file**

Create `<SANDBOX_ROOT>/Skills/portal-sync.md`:

````markdown
# portal-sync

Extract Oracle field data from a workshop markdown file, diff against the live Portal, confirm with the user, and push approved changes.

## When to use
After completing a workshop session and writing the output to a `Workshops/` file.

## Steps

1. **Identify the active client.** From context or ask the user.

2. **Identify the target workshop file.** Use the lexicographically last file in `<SANDBOX_ROOT>/Clients/<ClientName>/Workshops/` (YYYY-MM-DD prefix makes this the most recent). If the user specified a file, use that. If multiple files were created today, ask which to sync.

3. **Extract H2 sections from the workshop file.** Parse all `## ` headings and collect the text content under each heading (up to the next `## ` heading or end of file). Build a dict: `{ "Section Header": "content text" }`. Strip leading/trailing whitespace from values.

4. **Load `mapping.json`.** Read `<SANDBOX_ROOT>/marchitect-portal/mapping.json`. For each extracted section header, look it up in the mapping. Build two lists:
   - `mapped`: `[{ category, fieldName, newValue }]`
   - `unmapped`: section headers that have no mapping entry

5. **Fetch live Portal state.** Read `.portal.json` for credentials. Run this Python script:

```python
import json, urllib.request, urllib.error, sys

workspace_id = 'WORKSPACE_ID'
api_key = 'API_KEY'
base_url = 'BASE_URL'

req = urllib.request.Request(
    f'{base_url}/api/workspaces/{workspace_id}/oracle/sync',
    headers={'x-api-key': api_key}
)
try:
    with urllib.request.urlopen(req) as resp:
        print(json.dumps(json.loads(resp.read())))
except urllib.error.HTTPError as e:
    print(f'HTTP Error {e.code}: {e.read().decode()}', file=sys.stderr)
    sys.exit(1)
```

6. **Compute diff.** For each field in `mapped`:
   - Look up `currentValue = portalData[category][fieldName]` (None if absent)
   - If `newValue == currentValue` (after stripping): mark as "unchanged"
   - If `currentValue` is absent or null: mark as "new"
   - Otherwise: mark as "changed"

7. **Show diff.** Display only "new" and "changed" fields:

```
<Category> > <fieldName>
  CURRENT: "<current value>" (or "(empty)" if new)
  NEW:     "<new value>"

<N> field(s) to push. Push all? [yes / pick / abort]
```

If no fields have changes: report "No differences found between workshop output and Portal. Nothing to push." and stop.

8. **Get confirmation.**
   - **yes** → proceed with all "new" and "changed" fields
   - **pick** → ask about each field individually: "Push <fieldName>? [yes / skip]"
   - **abort** → stop immediately, make no changes

9. **Push confirmed fields.** Run this Python script, substituting actual values:

```python
import json, urllib.request, urllib.error, sys

workspace_id = 'WORKSPACE_ID'
api_key = 'API_KEY'
base_url = 'BASE_URL'

payload = {
    'fields': [
        {'category': 'CATEGORY', 'fieldName': 'FIELD_NAME', 'fieldValue': 'VALUE'},
        # ... one entry per confirmed field
    ],
    'updatedBy': 'cowork'
}

data = json.dumps(payload).encode()
req = urllib.request.Request(
    f'{base_url}/api/workspaces/{workspace_id}/oracle/sync',
    data=data,
    headers={'x-api-key': api_key, 'Content-Type': 'application/json'},
    method='POST'
)
try:
    with urllib.request.urlopen(req) as resp:
        print(json.dumps(json.loads(resp.read())))
except urllib.error.HTTPError as e:
    print(f'HTTP Error {e.code}: {e.read().decode()}', file=sys.stderr)
    sys.exit(1)
```

10. **Update snapshot.** Immediately re-run the portal-pull steps (fetch + write portal-snapshot.md) to reflect the new state.

11. **Final report:**
```
Pushed:     <N> fields (<comma-separated fieldNames>)
Unchanged:  <N> fields (skipped)
Unmapped:   <N> sections (<comma-separated section headers> — add to mapping with portal-discover)
```
````

- [ ] **Step 2: Create a test workshop file and test in Cowork**

Create `<SANDBOX_ROOT>/Clients/<ClientName>/Workshops/2026-04-08-test-sync.md`:

```markdown
## Positioning Statement
We help multi-location dental groups build scalable marketing systems that generate consistent lead flow.

## Mission Statement
To give fractional CMOs the tools and frameworks to run world-class marketing without a full in-house team.

## Workshop Notes
These are general notes about the session. This section has no Oracle mapping.
```

In Cowork, invoke: "Run portal-sync for [ClientName]"

Verify:
1. Diff is shown for Positioning Statement (changed from Task 2's push) and Mission Statement (new)
2. "Workshop Notes" appears in the unmapped report
3. After confirming, Portal Oracle is updated (re-run portal-pull and check snapshot)

---

## Task 6: Cowork — portal-discover skill

**Goal:** Create the skill that interactively assigns unmapped workshop section headers to Oracle fields and updates `mapping.json`.

**Files:**
- Create: `<SANDBOX_ROOT>/Skills/portal-discover.md`

**Acceptance Criteria:**
- [ ] Skill identifies all unmapped H2 headers from the target file
- [ ] For each, shows available Oracle fields grouped by category and asks for assignment
- [ ] New mappings are written to `mapping.json` (existing entries preserved)
- [ ] "Skip" option works — skipped headers are not added to mapping

**Steps:**

- [ ] **Step 1: Create the skill file**

Create `<SANDBOX_ROOT>/Skills/portal-discover.md`:

````markdown
# portal-discover

Interactively map unmapped workshop section headers to Oracle fields, and save the new mappings to `mapping.json`.

## When to use
- After portal-sync reports unmapped sections you want to connect to the Portal
- When building a new workshop process type with new section headers

## Available Oracle fields by category

**Brand & Positioning:**
positioning_statement, mission_statement, origin_story, diagnostic_trust_statement, identity_statement, credibility_statement, market_explanation, onliness_statement, enemy_definition, who_we_are_not_for_statement

**Customer Avatars:**
primary_avatar_name, primary_avatar_demographics, primary_avatar_psychographics, primary_avatar_pain_points, primary_avatar_goals, primary_avatar_awareness_level, secondary_avatar_name, secondary_avatar_summary

**Offer Architecture:**
front_end_offer, core_offer, backend_offers, offer_ladder_summary

**Competitive Landscape:**
primary_competitors, competitor_strengths, competitor_weaknesses, white_space_analysis, key_differentiators

**Channel Strategy:**
active_channels, channel_budget_allocation, inactive_channels, channel_benchmarks

## Steps

1. **Identify the active client and target file.** Same logic as portal-sync.

2. **Find unmapped sections.** Parse H2 headers from the workshop file. Cross-reference against `<SANDBOX_ROOT>/marchitect-portal/mapping.json`. Collect headers with no entry.

   If all sections are already mapped: "All sections in this file already have mappings. Nothing to discover."

3. **For each unmapped header**, ask the user:

```
Unmapped section: "## <Header>"

Available Oracle fields:
  Brand & Positioning: positioning_statement, mission_statement, ...
  Customer Avatars: primary_avatar_name, ...
  Offer Architecture: front_end_offer, ...
  Competitive Landscape: primary_competitors, ...
  Channel Strategy: active_channels, ...

Type the field name to map to, or 'skip':
```

4. **Collect confirmed mappings.** Build new entries:
```json
{ "<Section Header>": { "category": "<CategoryName>", "field": "<fieldName>" } }
```

5. **Write to `mapping.json`.** Read current `mapping.json`, merge new entries, write back. Existing entries are preserved.

6. **Confirm:**
```
Added <N> new mappings to mapping.json:
  "Brand Voice" → Brand & Positioning > identity_statement
  "Ideal Client Profile" → Customer Avatars > primary_avatar_summary
Skipped: <N> sections
```
````

- [ ] **Step 2: Test in Cowork**

In Cowork, invoke: "Run portal-discover for [ClientName]" against the test workshop file from Task 5.

Verify that "Workshop Notes" is presented for mapping, and after choosing a field (or skipping), `mapping.json` is updated correctly.

---

## Task 7: Cowork — CLAUDE.md auto-pull instruction

**Goal:** Add an instruction to `<SANDBOX_ROOT>/CLAUDE.md` so that Claude automatically runs `portal-pull` at the start of any session where a specific client is the focus.

**Files:**
- Edit: `<SANDBOX_ROOT>/CLAUDE.md`

**Acceptance Criteria:**
- [ ] Starting a Cowork session and saying "let's work on [ClientName]" triggers a portal-pull automatically
- [ ] The instruction is specific enough that Claude doesn't pull on every message, only on session-context establishment

**Steps:**

- [ ] **Step 1: Read the current CLAUDE.md**

Read `<SANDBOX_ROOT>/CLAUDE.md` in full to understand existing structure.

- [ ] **Step 2: Add the auto-pull instruction**

Find the appropriate section (e.g., under a "Client Work" or "Sessions" heading, or add a new section). Add:

```markdown
## Portal Sync — Auto Pull

When a client session context is established (i.e., the user says "let's work on [ClientName]", "open [ClientName]", or directs attention to a specific client folder), automatically run the `portal-pull` skill for that client before any other work begins.

Do this once per session, not on every message. If you have already pulled Portal data for the current client in this session, do not pull again unless the user asks.

After pulling, confirm quietly: "Portal snapshot updated for [ClientName]." Then proceed with whatever the user asked.
```

- [ ] **Step 3: Test**

Open a new Cowork session and say: "Let's work on [ClientName]."

Verify that Claude:
1. Runs portal-pull automatically
2. Confirms the snapshot update
3. Proceeds with the session

---

## Spec Coverage Check

| Spec requirement | Covered by |
|---|---|
| `GET /oracle/sync` returns Oracle data grouped by category | Task 1 |
| `POST /oracle/sync` upserts fields, touches only present fields | Task 1 |
| API key auth (`x-api-key` header) on both endpoints | Task 1 (`requireAuth` from `lib/auth`) |
| Workspace-scoped access (key can't access other workspaces) | Task 1 (`assertWorkspaceAccess`) |
| `mapping.json` at sandbox level, shared across clients | Task 3 |
| `.portal.json` per client with workspaceId + apiKey | Task 3 |
| `portal-snapshot.md` written by pull, human-readable | Task 4 |
| `portal-pull`: fetch → write snapshot | Task 4 |
| Session auto-pull from CLAUDE.md | Task 7 |
| `portal-sync`: extract → map → fresh GET → diff → confirm → push → update snapshot | Task 5 |
| Unchanged fields skipped silently | Task 5 |
| Unmapped sections reported (not pushed, not errored) | Task 5 |
| `portal-discover`: interactive mapping → write to mapping.json | Task 6 |
| Testable incrementally before full completion | Tasks 2 + 5 smoke test |
