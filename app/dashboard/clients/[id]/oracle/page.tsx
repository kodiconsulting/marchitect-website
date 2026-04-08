import { auth } from '@/auth'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { workspaces, oracleFields } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ORACLE_CATEGORIES } from '@/lib/oracle-schema'
import {
  Building2,
  Sparkles,
  Users,
  Layers,
  Target,
  Radio,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Sparkles,
  Users,
  Layers,
  Target,
  Radio,
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

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

  if (!workspace) {
    notFound()
  }

  const fields = await db
    .select()
    .from(oracleFields)
    .where(eq(oracleFields.workspaceId, id))

  // Build map: { [category]: { [fieldName]: { value, lastUpdated, updatedBy } } }
  type FieldData = { value: unknown; lastUpdated: Date; updatedBy: string }
  const fieldMap: Record<string, Record<string, FieldData>> = {}

  for (const field of fields) {
    if (!fieldMap[field.category]) {
      fieldMap[field.category] = {}
    }
    fieldMap[field.category][field.fieldName] = {
      value: field.fieldValue,
      lastUpdated: field.lastUpdated,
      updatedBy: field.updatedBy,
    }
  }

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

      <div className="space-y-4">
        {ORACLE_CATEGORIES.map((category) => {
          const Icon = ICON_MAP[category.icon] ?? Building2
          const categoryFields = fieldMap[category.id] ?? {}
          const populatedCount = category.fields.filter(
            (f) => {
              const val = categoryFields[f.id]?.value
              return val !== undefined && val !== null && val !== ''
            }
          ).length
          const totalCount = category.fields.length
          const allFilled = populatedCount === totalCount
          const someFilled = populatedCount > 0 && populatedCount < totalCount
          const noneFilled = populatedCount === 0

          const badgeClass = allFilled
            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
            : someFilled
            ? 'bg-yellow-500/20 text-[#f6a600] border border-yellow-500/30'
            : 'bg-[#f1f1f4] text-[#78829d] border border-[#e8e8e8]'

          return (
            <Card key={category.id} className="bg-white border-[#e8e8e8]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-lg bg-[#f1f1f4] flex items-center justify-center shrink-0">
                      <Icon className="size-4 text-[#78829d]" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-[#252f4a]">
                      {category.label}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
                      {populatedCount} of {totalCount} fields populated
                    </span>
                    <Link
                      href={`/dashboard/clients/${id}/oracle/${category.id}`}
                      className="inline-flex h-7 items-center justify-center rounded-lg border border-[#e8e8e8] px-3 text-xs font-medium text-[#4b5675] transition-colors hover:border-[#1B84FF] hover:text-[#252f4a]"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="divide-y divide-zinc-800">
                  {category.fields.map((field) => {
                    const data = categoryFields[field.id]
                    const value = data?.value
                    const hasValue = value !== undefined && value !== null && value !== ''
                    const displayValue = hasValue
                      ? (typeof value === 'string' ? value : JSON.stringify(value))
                      : null

                    return (
                      <li key={field.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-[#78829d] mb-0.5">
                              {field.label}
                            </p>
                            {displayValue ? (
                              <p className="text-sm text-[#252f4a] whitespace-pre-wrap break-words">
                                {displayValue}
                              </p>
                            ) : (
                              <p className="text-sm text-[#78829d]">—</p>
                            )}
                          </div>
                          {data?.lastUpdated && (
                            <p className="text-xs text-[#78829d] shrink-0 mt-0.5">
                              {formatDate(data.lastUpdated)}
                            </p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
