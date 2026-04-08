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

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-500 border border-zinc-700">
        Not scored
      </span>
    )
  }
  if (score === 0) {
    return (
      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-red-400/10 text-red-400 border border-red-400/20">
        Not Done
      </span>
    )
  }
  if (score === 1) {
    return (
      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
        In Progress
      </span>
    )
  }
  return (
    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md bg-green-400/10 text-green-400 border border-green-400/20">
      Complete
    </span>
  )
}

function TierBadge({ tier }: { tier: number }) {
  const styles: Record<number, string> = {
    1: 'bg-red-500/20 text-red-300',
    2: 'bg-orange-500/20 text-orange-300',
    3: 'bg-blue-500/20 text-blue-300',
    4: 'bg-zinc-600 text-zinc-300',
  }
  return (
    <span
      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md ${styles[tier] ?? 'bg-zinc-700 text-zinc-400'}`}
    >
      T{tier}
    </span>
  )
}

export default function AuditItemRow({ item, score, workspaceId }: Props) {
  const router = useRouter()
  const [currentScore, setCurrentScore] = useState<number | null>(
    score?.score ?? null
  )
  const [scoredDate, setScoredDate] = useState<Date | null>(
    score?.scoredDate ?? null
  )
  const [loading, setLoading] = useState(false)

  async function handleScore(newScore: 0 | 1 | 2) {
    setLoading(true)
    const prevScore = currentScore
    const prevDate = scoredDate
    // Optimistic update
    setCurrentScore(newScore)
    setScoredDate(new Date())

    try {
      const res = await fetch(
        `/api/workspaces/${workspaceId}/audit/scores`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scores: [{ auditItemId: item.id, score: newScore }],
            scoredBy: 'Admin',
          }),
        }
      )
      if (!res.ok) {
        // Revert on failure
        setCurrentScore(prevScore)
        setScoredDate(prevDate)
      } else {
        router.refresh()
      }
    } catch {
      setCurrentScore(prevScore)
      setScoredDate(prevDate)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 mb-2">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Item number */}
        <span className="font-mono text-sm text-zinc-400 flex-shrink-0 w-10">
          {item.itemNumber}
        </span>

        {/* Description */}
        <p className="text-white text-sm flex-1">{item.description}</p>

        {/* Right side: badges + buttons */}
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <TierBadge tier={item.tier} />

          {item.toggleTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500"
            >
              {tag}
            </span>
          ))}

          <ScoreBadge score={currentScore} />

          {scoredDate && (
            <span className="text-zinc-600 text-xs">
              {new Date(scoredDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: '2-digit',
              })}
            </span>
          )}
        </div>
      </div>

      {/* Score buttons */}
      <div className="flex items-center gap-2 mt-3 ml-0 sm:ml-13">
        <button
          onClick={() => handleScore(0)}
          disabled={loading}
          className={`text-xs font-medium px-3 py-1 rounded border transition-colors disabled:opacity-50 bg-red-500/20 hover:bg-red-500/40 text-red-300 border-red-400/20 ${currentScore === 0 ? 'ring-1 ring-red-400/60' : ''}`}
        >
          Not Done
        </button>
        <button
          onClick={() => handleScore(1)}
          disabled={loading}
          className={`text-xs font-medium px-3 py-1 rounded border transition-colors disabled:opacity-50 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 border-yellow-400/20 ${currentScore === 1 ? 'ring-1 ring-yellow-400/60' : ''}`}
        >
          In Progress
        </button>
        <button
          onClick={() => handleScore(2)}
          disabled={loading}
          className={`text-xs font-medium px-3 py-1 rounded border transition-colors disabled:opacity-50 bg-green-500/20 hover:bg-green-500/40 text-green-300 border-green-400/20 ${currentScore === 2 ? 'ring-1 ring-green-400/60' : ''}`}
        >
          Complete
        </button>
      </div>
    </div>
  )
}
