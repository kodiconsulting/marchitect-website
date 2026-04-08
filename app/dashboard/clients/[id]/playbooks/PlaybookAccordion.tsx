'use client'

import { useState } from 'react'
import { ChevronDown, Terminal } from 'lucide-react'

interface Pillar {
  id: string
  pillarNumber: number
  name: string
  description: string
}

// Skill names will be filled in as they are built in Cowork.
// Format: 'Skill <skill-name>' — set to null if not yet built.
const PILLAR_SKILLS: Record<number, string | null> = {
  1:  null,
  2:  null,
  3:  null,
  4:  null,
  5:  null,
  6:  null,
  7:  null,
  8:  null,
  9:  null,
  10: null,
  11: null,
  12: null,
}

export default function PlaybookAccordion({ pillars }: { pillars: Pillar[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {pillars.map(pillar => {
        const isOpen = open === pillar.pillarNumber
        const skill = PILLAR_SKILLS[pillar.pillarNumber]

        return (
          <div key={pillar.id} className="bg-white border border-[#e8e8e8] rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : pillar.pillarNumber)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#f9f9f9] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#f1f1f4] text-[#78829d] text-xs font-bold shrink-0">
                  {pillar.pillarNumber}
                </span>
                <span className="text-sm font-semibold text-[#252f4a] truncate">{pillar.name}</span>
              </div>
              <ChevronDown
                className={`size-4 text-[#78829d] shrink-0 ml-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div className="px-5 pb-5 border-t border-[#e8e8e8]">
                <p className="text-[#78829d] text-sm mt-4 mb-4">{pillar.description}</p>

                {/* Cowork skill callout */}
                <div className="flex items-start gap-3 rounded-lg border border-[#e8e8e8] bg-[#f9f9f9] px-4 py-3 mb-4">
                  <Terminal className="size-4 text-[#78829d] mt-0.5 shrink-0" />
                  <div className="text-sm">
                    {skill ? (
                      <span className="text-[#252f4a]">
                        Run{' '}
                        <code className="bg-[#f1f1f4] text-[#1B84FF] px-1.5 py-0.5 rounded font-mono text-xs">
                          Skill {skill}
                        </code>{' '}
                        in your Cowork sandbox to generate content for this pillar.
                      </span>
                    ) : (
                      <span className="text-[#78829d]">
                        Cowork skill for this pillar is not yet built.{' '}
                        <span className="text-[#f6a600]">Coming soon.</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Placeholder for future playbook items */}
                <p className="text-[#78829d] text-sm text-center py-4">
                  No playbook templates added yet for this pillar.
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
