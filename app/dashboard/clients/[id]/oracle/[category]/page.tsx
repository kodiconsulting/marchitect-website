import { auth } from '@/auth'
import { redirect } from 'next/navigation'
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
import OracleCategoryForm from './OracleCategoryForm'

export default async function OracleCategoryPage({
  params,
}: {
  params: Promise<{ id: string; category: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id, category: categoryId } = await params

  const matchedCategory = ORACLE_CATEGORIES.find((c) => c.id === categoryId)

  const [workspace] = await db
    .select()
    .from(workspaces)
    .where(eq(workspaces.id, id))
    .limit(1)

  if (!workspace) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Link
          href={`/dashboard/clients/${id}/oracle`}
          className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
        >
          ← Back to Oracle
        </Link>
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-16 text-center">
            <p className="text-[#252f4a] font-semibold text-lg mb-2">
              Client not found
            </p>
            <p className="text-[#78829d] text-sm">
              This workspace does not exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!matchedCategory) {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <Link
          href={`/dashboard/clients/${id}/oracle`}
          className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
        >
          ← Back to Oracle
        </Link>
        <Card className="bg-white border-[#e8e8e8]">
          <CardContent className="py-16 text-center">
            <p className="text-[#252f4a] font-semibold text-lg mb-2">
              Category not found
            </p>
            <p className="text-[#78829d] text-sm">
              The Oracle category &ldquo;{categoryId}&rdquo; does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const fields = await db
    .select()
    .from(oracleFields)
    .where(
      and(
        eq(oracleFields.workspaceId, id),
        eq(oracleFields.category, categoryId)
      )
    )

  const initialValues: Record<string, string> = {}
  for (const field of fields) {
    const val = field.fieldValue
    if (val !== null && val !== undefined) {
      initialValues[field.fieldName] = typeof val === 'string' ? val : JSON.stringify(val)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link
        href={`/dashboard/clients/${id}/oracle`}
        className="text-sm text-[#78829d] hover:text-[#252f4a] transition-colors mb-6 inline-block"
      >
        ← Back to Oracle
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#252f4a]">{matchedCategory.label}</h1>
        <p className="text-[#78829d] mt-1 text-sm">
          {workspace.clientName} — edit Oracle fields
        </p>
      </div>

      <Card className="bg-white border-[#e8e8e8]">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#252f4a]">
            {matchedCategory.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OracleCategoryForm
            category={matchedCategory}
            initialValues={initialValues}
            workspaceId={id}
          />
        </CardContent>
      </Card>
    </div>
  )
}
