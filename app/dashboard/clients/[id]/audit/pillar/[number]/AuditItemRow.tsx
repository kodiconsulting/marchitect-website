'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuditItem {
  id: string
  itemNumber: string
  description: string
  tier: number
  toggleTags: string[]
}

interface Props {
  item: AuditItem
  score: { score: number; scoredDate: Date | null } | null
  workspaceId: string
}

const SCORE_STYLES: Record<number, string> = {
  0: 'bg-red-500/10 text-red-300 border-red-400/20',
  1: 'bg-yellow-500/10 text-yellow-300 border-yellow-400/20',
  2: 'bg-green-500/10 text-green-300 border-green-400/20',
}

const TIER_STYLES: Record<number, string> = {
  1: 'bg-red-500/20 text-red-300',
  2: 'bg-orange-500/20 text-orange-300',
  3: 'bg-blue-500/20 text-blue-300',
  4: 'bg-zinc-600 text-zinc-300',
}

const SCORE_LABELS: Record<number, string> = {
  0: 'Not Done',
  1: 'In Progress',
  2: 'Complete',
}

export default function AuditItemRow({ item, score, workspaceId }: Props) {
  const router = useRouter()
  // Default to 0 (Not Done) if no score exists yet
  const [currentScore, setCurrentScore] = useState<number>(score?.score ?? 0)
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newScore = parseInt(e.target.value) as 0 | 1 | 2
    const prevScore = currentScore
    setCurrentScore(newScore)
    setLoading(true)

    try {
      const res = await fetch(`/api/workspaces/${workspaceId}/audit/scores`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: [{ auditItemId: item.id, score: newScore }],
          scoredBy: 'Admin',
        }),
      })
      if (!res.ok) {
        setCurrentScore(prevScore)
      } else {
        router.refresh()
      }
    } catch {
      setCurrentScore(prevScore)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 mb-2 flex items-center gap-3">
      {/* Item number */}
      <span className="font-mono text-sm text-zinc-400 flex-shrink-0 w-10">
        {item.itemNumber}
      </span>

      {/* Description */}
      <p className="text-white text-sm flex-1">{item.description}</p>

      {/* Tier + toggle tags */}
      <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md ${TIER_STYLES[item.tier] ?? 'bg-zinc-700 text-zinc-400'}`}>
          T{item.tier}
        </span>
        {item.toggleTags.map((tag) => (
          <span key={tag} className="inline-flex items-center text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">
            {tag}
          </span>
        ))}
      </div>

      {/* Status dropdown */}
      <select
        value={currentScore}
        onChange={handleChange}
        disabled={loading}
        className={`flex-shrink-0 text-xs font-medium px-2 py-1.5 rounded-md border cursor-pointer transition-colors disabled:opacity-50 bg-zinc-950 outline-none ${SCORE_STYLES[currentScore]}`}
      >
        <option value={0}>Not Done</option>
        <option value={1}>In Progress</option>
        <option value={2}>Complete</option>
      </select>
    </div>
  )
}
