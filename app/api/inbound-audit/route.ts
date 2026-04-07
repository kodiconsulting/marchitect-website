import { NextRequest } from 'next/server'
import { z } from 'zod/v4'
import { eq, inArray } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  leads,
  inboundAuditResponses,
  inboundAuditQuestions,
} from '@/lib/db/schema'

const postSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  revenueRange: z.string().optional(),
  industry: z.string().optional(),
  websiteUrl: z.string().optional(),
  roleTitle: z.string().optional(),
  responses: z.array(
    z.object({
      questionId: z.string().uuid(),
      responseValue: z.string().min(1),
    })
  ),
})

function computeScore(
  responseValue: string,
  responseType: string
): number {
  if (responseType === 'scale') {
    // Assume scale 1-5, normalize to 0-1
    const num = parseFloat(responseValue)
    if (!isNaN(num)) {
      return Math.max(0, Math.min(1, (num - 1) / 4))
    }
  }
  return 0
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ error: parsed.error.message }, { status: 400 })
    }

    const {
      companyName,
      contactName,
      email,
      phone,
      revenueRange,
      industry,
      websiteUrl,
      roleTitle,
      responses,
    } = parsed.data

    // Create lead record
    const [lead] = await db
      .insert(leads)
      .values({
        companyName,
        contactName,
        email,
        phone: phone ?? null,
        revenueRange: revenueRange ?? null,
        industry: industry ?? null,
        websiteUrl: websiteUrl ?? null,
        roleTitle: roleTitle ?? null,
        submissionDate: new Date(),
        status: 'new',
      })
      .returning()

    if (responses.length === 0) {
      return Response.json({ leadId: lead.id, categoryScores: {} }, { status: 201 })
    }

    // Fetch questions to get categories and response types
    const questionIds = responses.map((r) => r.questionId)
    const questions = await db
      .select()
      .from(inboundAuditQuestions)
      .where(inArray(inboundAuditQuestions.id, questionIds))

    const questionMap = new Map<string, typeof inboundAuditQuestions.$inferSelect>()
    for (const q of questions) {
      questionMap.set(q.id, q)
    }

    // Insert responses with computed scores
    await db.insert(inboundAuditResponses).values(
      responses.map(({ questionId, responseValue }) => {
        const question = questionMap.get(questionId)
        const calculatedScore = question
          ? computeScore(responseValue, question.responseType)
          : null
        return {
          leadId: lead.id,
          questionId,
          responseValue,
          calculatedScore: calculatedScore !== null ? calculatedScore.toString() : null,
        }
      })
    )

    // Compute category scores
    const categoryScores: Record<string, { total: number; count: number; score: number }> = {}
    for (const { questionId, responseValue } of responses) {
      const question = questionMap.get(questionId)
      if (!question) continue
      const category = question.category
      if (!categoryScores[category]) {
        categoryScores[category] = { total: 0, count: 0, score: 0 }
      }
      const score = computeScore(responseValue, question.responseType)
      categoryScores[category].total += score
      categoryScores[category].count += 1
    }

    const result: Record<string, { averageScore: number; label: 'red' | 'yellow' | 'green' }> = {}
    for (const [category, { total, count }] of Object.entries(categoryScores)) {
      const avg = count > 0 ? total / count : 0
      let label: 'red' | 'yellow' | 'green' = 'red'
      if (avg >= 0.67) label = 'green'
      else if (avg >= 0.33) label = 'yellow'
      result[category] = { averageScore: avg, label }
    }

    return Response.json({ leadId: lead.id, categoryScores: result }, { status: 201 })
  } catch (e) {
    console.error(e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
