import { NextRequest } from 'next/server'
import { eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  leads,
  inboundAuditResponses,
  inboundAuditQuestions,
} from '@/lib/db/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params

    const [lead] = await db
      .select()
      .from(leads)
      .where(eq(leads.id, leadId))
      .limit(1)

    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 })
    }

    const responses = await db
      .select()
      .from(inboundAuditResponses)
      .where(eq(inboundAuditResponses.leadId, leadId))

    if (responses.length === 0) {
      return Response.json({ leadId, categoryScores: {} })
    }

    const questionIds = responses.map((r) => r.questionId)
    const questions = await db
      .select()
      .from(inboundAuditQuestions)
      .where(inArray(inboundAuditQuestions.id, questionIds))

    const questionMap = new Map<string, typeof inboundAuditQuestions.$inferSelect>()
    for (const q of questions) {
      questionMap.set(q.id, q)
    }

    // Group scores by category
    const categoryData: Record<
      string,
      { scores: number[]; responses: Array<{ questionId: string; responseValue: string; calculatedScore: string | null }> }
    > = {}

    for (const response of responses) {
      const question = questionMap.get(response.questionId)
      if (!question) continue
      const category = question.category
      if (!categoryData[category]) {
        categoryData[category] = { scores: [], responses: [] }
      }
      const score = response.calculatedScore !== null ? parseFloat(response.calculatedScore) : 0
      categoryData[category].scores.push(score)
      categoryData[category].responses.push({
        questionId: response.questionId,
        responseValue: response.responseValue,
        calculatedScore: response.calculatedScore,
      })
    }

    const categoryScores: Record<
      string,
      {
        averageScore: number
        label: 'red' | 'yellow' | 'green'
        responses: Array<{ questionId: string; responseValue: string; calculatedScore: string | null }>
      }
    > = {}

    for (const [category, { scores, responses: catResponses }] of Object.entries(categoryData)) {
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0
      let label: 'red' | 'yellow' | 'green' = 'red'
      if (avg >= 0.67) label = 'green'
      else if (avg >= 0.33) label = 'yellow'
      categoryScores[category] = { averageScore: avg, label, responses: catResponses }
    }

    return Response.json({
      leadId,
      lead: {
        id: lead.id,
        companyName: lead.companyName,
        contactName: lead.contactName,
        email: lead.email,
        submissionDate: lead.submissionDate,
        status: lead.status,
      },
      categoryScores,
    })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
