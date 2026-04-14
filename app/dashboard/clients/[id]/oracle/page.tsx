import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, oracleFields, oracleCategoryDefs, objectives } from '@/lib/db/schema'
import { eq, isNull, isNotNull, and } from 'drizzle-orm'
import Link from 'next/link'
import { ORACLE_CATEGORIES } from '@/lib/oracle-schema'
import OracleTabs, { type OracleTabsProps } from './OracleTabs'

const OBJECTIVE_SECTION_CATEGORIES = [
  'Product / Service Definition',
  'Target Avatars / ICP',
  'Offer Architecture',
  'Channel Strategy',
]

export default async function ClientOraclePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, id))
    .limit(1)

  if (!workspace) notFound()

  const [categoryDefs, brandFields, workspaceObjectives] = await Promise.all([
    db.select().from(oracleCategoryDefs),
    db.select().from(oracleFields).where(and(eq(oracleFields.workspaceId, id), isNull(oracleFields.objectiveId))),
    db.select().from(objectives).where(eq(objectives.workspaceId, id)),
  ])

  const defByCategory = Object.fromEntries(categoryDefs.map((d) => [d.category, d]))
  const objectiveSectionDefMap = Object.fromEntries(
    categoryDefs.filter((d) => d.level === 'objective').map((d) => [d.category, d])
  )

  // Build brand field map: { [category_or_oracle_id]: { [fieldName]: row } }
  type FieldRow = (typeof brandFields)[number]
  const brandFieldMap: Record<string, Record<string, FieldRow>> = {}
  for (const field of brandFields) {
    if (!brandFieldMap[field.category]) brandFieldMap[field.category] = {}
    brandFieldMap[field.category][field.fieldName] = field
  }

  // Build brandData — all ORACLE_CATEGORIES shown under Brand tab
  const brandData: OracleTabsProps['brandData'] = ORACLE_CATEGORIES.map((cat) => {
    // oracle_fields uses category as the full label (e.g. "Brand & Positioning")
    // but ORACLE_CATEGORIES uses id (e.g. "brand_positioning") as field keys
    // Fields are stored with the oracle category id as both category key and fieldName key
    const categoryFieldMap = brandFieldMap[cat.id] ?? {}

    // Try to find a matching oracle_category_defs entry by label
    const matchingDef = defByCategory[cat.label] ?? null

    const fields = cat.fields.map((f) => {
      const row = categoryFieldMap[f.id]
      const value = row?.fieldValue
      const hasValue = value !== undefined && value !== null && value !== ''
      return {
        id: f.id,
        label: f.label,
        hasValue,
        displayValue: hasValue
          ? typeof value === 'string' ? value : JSON.stringify(value)
          : null,
        lastUpdated: row?.lastUpdated ?? null,
        updatedBy: row?.updatedBy ?? null,
      }
    })

    return {
      categoryId: cat.id,
      categoryLabel: cat.label,
      icon: cat.icon,
      fields,
      populatedCount: fields.filter((f) => f.hasValue).length,
      totalCount: cat.fields.length,
      workshopPrompt: matchingDef?.workshopPrompt ?? null,
    }
  })

  // Fetch objective-scoped oracle fields
  let objectiveFieldRows: typeof brandFields = []
  if (workspaceObjectives.length > 0) {
    objectiveFieldRows = await db
      .select()
      .from(oracleFields)
      .where(and(eq(oracleFields.workspaceId, id), isNotNull(oracleFields.objectiveId)))
  }

  // Build objective field map: { [objectiveId]: { [category]: { [fieldName]: value } } }
  const objectiveFieldMap: Record<string, Record<string, Record<string, unknown>>> = {}
  for (const field of objectiveFieldRows) {
    if (!field.objectiveId) continue
    if (!objectiveFieldMap[field.objectiveId]) objectiveFieldMap[field.objectiveId] = {}
    if (!objectiveFieldMap[field.objectiveId][field.category]) {
      objectiveFieldMap[field.objectiveId][field.category] = {}
    }
    objectiveFieldMap[field.objectiveId][field.category][field.fieldName] = field.fieldValue
  }

  const objectivesData: OracleTabsProps['objectives'] = workspaceObjectives.map((obj) => {
    const objFields = objectiveFieldMap[obj.id] ?? {}

    const sections = OBJECTIVE_SECTION_CATEGORIES.map((sectionCategory) => {
      const sectionDef = objectiveSectionDefMap[sectionCategory] ?? null
      const fields = objFields[sectionCategory] ?? {}
      return {
        category: sectionCategory,
        workshopName: sectionDef?.workshopName ?? null,
        workshopPrompt: sectionDef?.workshopPrompt ?? null,
        fields,
        isEmpty: Object.keys(fields).length === 0,
      }
    })

    return {
      id: obj.id,
      name: obj.name,
      successDefinition: obj.successDefinition,
      priority: obj.priority,
      status: obj.status,
      targetTimeline: obj.targetTimeline,
      sections,
    }
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}`}
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to {workspace.clientName}
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">Content Oracle</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — knowledge base fields
        </p>
      </div>

      <OracleTabs
        workspaceId={id}
        brandData={brandData}
        objectives={objectivesData}
      />
    </div>
  )
}
