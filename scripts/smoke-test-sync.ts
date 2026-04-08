/**
 * Smoke test the /oracle/sync endpoint end-to-end.
 * Run with: npx tsx scripts/smoke-test-sync.ts
 * Requires the dev server running at localhost:3000.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

const WORKSPACE_ID = '98255c14-1c44-4111-95db-37f1faf47cc0'
const API_KEY = 'sk-438cb69f469498616cca7275fed3e650f227874f91a866046f94761101580124'
const BASE_URL = 'http://localhost:3000'
const URL = `${BASE_URL}/api/workspaces/${WORKSPACE_ID}/oracle/sync`

;(async () => {
  console.log('=== Smoke testing /oracle/sync ===\n')

  // 1. GET — expect empty object (no Oracle data yet)
  console.log('1. GET (expect empty)')
  const getRes = await fetch(URL, { headers: { 'x-api-key': API_KEY } })
  console.log(`   Status: ${getRes.status} (expected 200)`)
  const getData = await getRes.json()
  console.log(`   Body: ${JSON.stringify(getData)}\n`)

  // 2. POST — push one field
  console.log('2. POST one field')
  const postRes = await fetch(URL, {
    method: 'POST',
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: [{ category: 'Brand & Positioning', fieldName: 'positioning_statement', fieldValue: 'We help automotive dealers build scalable digital marketing systems.' }],
      updatedBy: 'cowork-test'
    })
  })
  console.log(`   Status: ${postRes.status} (expected 200)`)
  const postData = await postRes.json()
  console.log(`   Body: ${JSON.stringify(postData)}\n`)

  // 3. GET again — should have the field now
  console.log('3. GET (expect positioning_statement)')
  const getRes2 = await fetch(URL, { headers: { 'x-api-key': API_KEY } })
  console.log(`   Status: ${getRes2.status} (expected 200)`)
  const getData2 = await getRes2.json()
  console.log(`   Body: ${JSON.stringify(getData2)}\n`)

  // 4. 401 — no key
  console.log('4. GET with no key (expect 401)')
  const noKeyRes = await fetch(URL)
  console.log(`   Status: ${noKeyRes.status} (expected 401)\n`)

  // 5. 400 — empty fields array
  console.log('5. POST empty fields (expect 400)')
  const badRes = await fetch(URL, {
    method: 'POST',
    headers: { 'x-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: [] })
  })
  console.log(`   Status: ${badRes.status} (expected 400)\n`)

  const allPassed =
    getRes.status === 200 &&
    postRes.status === 200 &&
    postData.synced === 1 &&
    getRes2.status === 200 &&
    (getData2['Brand & Positioning']?.positioning_statement !== undefined) &&
    noKeyRes.status === 401 &&
    badRes.status === 400

  console.log(allPassed ? '✅ All checks passed.' : '❌ Some checks failed — review output above.')
})().catch(e => { console.error('Error:', e.message); process.exit(1) })
