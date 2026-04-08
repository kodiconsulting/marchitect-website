import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { budgetExpenses } from '@/lib/db/schema'
import { auth } from '@/auth'

const putSchema = z.object({
  purpose: z.string().optional(),
  vendor: z.string().optional(),
  costPerMonth: z.number().optional(),
  notes: z.string().optional(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; expenseId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, expenseId } = await params

    const body = await request.json()
    const parsed = putSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const updateData: Partial<typeof budgetExpenses.$inferInsert> = {}
    const d = parsed.data
    if (d.purpose !== undefined) updateData.purpose = d.purpose
    if (d.vendor !== undefined) updateData.vendor = d.vendor
    if (d.costPerMonth !== undefined) updateData.costPerMonth = d.costPerMonth.toString()
    if (d.notes !== undefined) updateData.notes = d.notes

    const [updated] = await db
      .update(budgetExpenses)
      .set(updateData)
      .where(and(eq(budgetExpenses.id, expenseId), eq(budgetExpenses.workspaceId, id)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Expense not found' }, { status: 404 })
    }

    return Response.json(updated)
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; expenseId: string }> }
) {
  try {
    const session = await auth()
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id, expenseId } = await params

    const [deleted] = await db
      .delete(budgetExpenses)
      .where(and(eq(budgetExpenses.id, expenseId), eq(budgetExpenses.workspaceId, id)))
      .returning()

    if (!deleted) {
      return Response.json({ error: 'Expense not found' }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
