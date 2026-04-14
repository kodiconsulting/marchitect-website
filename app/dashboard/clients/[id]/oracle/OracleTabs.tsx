'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Sparkles, Users, Layers, Target, Radio, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Sparkles,
  Users,
  Layers,
  Target,
  Radio,
}

function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export interface BrandCategoryData {
  categoryId: string
  categoryLabel: string
  icon: string
  fields: Array<{
    id: string
    label: string
    hasValue: boolean
    displayValue: string | null
    lastUpdated: Date | null
    updatedBy: string | null
  }>
  populatedCount: number
  totalCount: number
  workshopPrompt: string | null
}

export interface ObjectiveSection {
  category: string
  workshopName: string | null
  workshopPrompt: string | null
  fields: Record<string, unknown>
  isEmpty: boolean
}

export interface ObjectiveData {
  id: string
  name: string
  successDefinition: string | null
  priority: string
  status: string
  targetTimeline: string | null
  sections: ObjectiveSection[]
}

export interface OracleTabsProps {
  workspaceId: string
  brandData: BrandCategoryData[]
  objectives: ObjectiveData[]
}

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-zinc-100 text-zinc-600',
}

const STATUS_STYLES: Record<string, string> = {
  planning: 'bg-zinc-100 text-zinc-600',
  active: 'bg-green-100 text-green-700',
  paused: 'bg-yellow-100 text-yellow-700',
  complete: 'bg-purple-100 text-purple-700',
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function BrandTab({
  workspaceId,
  brandData,
}: {
  workspaceId: string
  brandData: BrandCategoryData[]
}) {
  return (
    <div className="space-y-4">
      {brandData.map((category) => {
        const Icon = ICON_MAP[category.icon] ?? Building2
        const { populatedCount, totalCount, workshopPrompt } = category
        const allFilled = populatedCount === totalCount
        const someFilled = populatedCount > 0 && populatedCount < totalCount
        const noneFilled = populatedCount === 0

        const badgeClass = allFilled
          ? 'bg-green-500/20 text-green-600 border border-green-500/30'
          : someFilled
          ? 'bg-yellow-500/20 text-[#f6a600] border border-yellow-500/30'
          : 'bg-[#f1f1f4] text-[#78829d] border border-[#e8e8e8]'

        return (
          <Card key={category.categoryId} className="bg-white border-[#e8e8e8]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-[#f1f1f4] flex items-center justify-center shrink-0">
                    <Icon className="size-4 text-[#78829d]" />
                  </div>
                  <CardTitle className="text-sm font-semibold text-[#252f4a]">
                    {category.categoryLabel}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
                    {populatedCount} of {totalCount} fields populated
                  </span>
                  <Link
                    href={`/dashboard/clients/${workspaceId}/oracle/${category.categoryId}`}
                    className="inline-flex h-7 items-center justify-center rounded-lg border border-[#e8e8e8] px-3 text-xs font-medium text-[#4b5675] transition-colors hover:border-[#1B84FF] hover:text-[#252f4a]"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {noneFilled && workshopPrompt ? (
                <div className="rounded-lg border border-dashed border-[#e8e8e8] bg-[#f9f9f9] p-4 flex gap-3 items-start">
                  <span className="text-lg leading-none mt-0.5">📋</span>
                  <div>
                    <p className="text-xs font-semibold text-[#78829d] mb-1">{category.categoryLabel} Workshop</p>
                    <p className="text-sm text-[#78829d]">{workshopPrompt}</p>
                  </div>
                </div>
              ) : (
                <ul className="divide-y divide-[#f1f1f4]">
                  {category.fields.map((field) => (
                    <li key={field.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-[#78829d] mb-0.5">{field.label}</p>
                          {field.displayValue ? (
                            <p className="text-sm text-[#252f4a] whitespace-pre-wrap break-words">
                              {field.displayValue}
                            </p>
                          ) : (
                            <p className="text-sm text-[#78829d]">—</p>
                          )}
                        </div>
                        {field.lastUpdated && (
                          <p className="text-xs text-[#78829d] shrink-0 mt-0.5">
                            {formatDate(field.lastUpdated)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function ObjectivesTab({
  workspaceId,
  objectives,
}: {
  workspaceId: string
  objectives: ObjectiveData[]
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    Object.fromEntries(objectives.map((o) => [o.id, true]))
  )

  if (objectives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-white border border-[#e8e8e8] rounded-xl p-8 max-w-md w-full text-center">
          <div className="size-12 rounded-xl bg-[#f1f1f4] flex items-center justify-center mx-auto mb-4">
            <Target className="size-5 text-[#78829d]" />
          </div>
          <h3 className="text-sm font-semibold text-[#252f4a] mb-2">No Objectives defined yet</h3>
          <p className="text-sm text-[#78829d] mb-4">
            Create an Objective in Goals &amp; Objectives to start building Objective-level Oracle sections.
          </p>
          <Link
            href={`/dashboard/clients/${workspaceId}/rocks`}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#1B84FF] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#1366cc]"
          >
            Go to Goals &amp; Objectives
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {objectives.map((objective) => {
        const isOpen = expanded[objective.id] ?? true
        const priorityClass = PRIORITY_STYLES[objective.priority] ?? PRIORITY_STYLES.medium
        const statusClass = STATUS_STYLES[objective.status] ?? STATUS_STYLES.planning

        return (
          <Card key={objective.id} className="bg-white border-[#e8e8e8] overflow-hidden">
            <button
              type="button"
              onClick={() => setExpanded((prev) => ({ ...prev, [objective.id]: !prev[objective.id] }))}
              className="w-full text-left"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <CardTitle className="text-sm font-bold text-[#252f4a]">
                        {objective.name}
                      </CardTitle>
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${priorityClass}`}>
                        {capitalize(objective.priority)} priority
                      </span>
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusClass}`}>
                        {capitalize(objective.status)}
                      </span>
                    </div>
                    {objective.successDefinition && (
                      <p className="text-xs text-[#78829d] line-clamp-2 mt-0.5">
                        {objective.successDefinition}
                      </p>
                    )}
                    {objective.targetTimeline && (
                      <p className="text-xs text-[#78829d] mt-1">
                        <span className="font-medium">Timeline:</span> {objective.targetTimeline}
                      </p>
                    )}
                  </div>
                  <span className="text-[#78829d] text-xs shrink-0 mt-1">
                    {isOpen ? '▲' : '▼'}
                  </span>
                </div>
              </CardHeader>
            </button>

            {isOpen && (
              <CardContent className="pt-0 space-y-4">
                {objective.sections.map((section) => (
                  <div key={section.category}>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="size-3.5 text-[#78829d]" />
                      <p className="text-xs font-semibold text-[#78829d] uppercase tracking-wide">
                        {section.category}
                      </p>
                    </div>

                    {section.isEmpty ? (
                      <div className="rounded-lg border border-dashed border-[#e8e8e8] bg-[#f9f9f9] p-4 flex gap-3 items-start">
                        <span className="text-base leading-none mt-0.5">📋</span>
                        <div>
                          <p className="text-xs font-semibold text-[#78829d] mb-1">{section.category}</p>
                          <p className="text-xs text-[#78829d] mb-1">This section is empty.</p>
                          {section.workshopPrompt && (
                            <p className="text-xs text-[#78829d]">{section.workshopPrompt}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <ul className="divide-y divide-[#f1f1f4] rounded-lg border border-[#e8e8e8] bg-[#f9f9f9] px-4">
                        {Object.entries(section.fields).map(([fieldName, value]) => {
                          const displayValue =
                            value == null || value === ''
                              ? null
                              : typeof value === 'string'
                              ? value
                              : JSON.stringify(value)
                          return (
                            <li key={fieldName} className="py-2.5 first:pt-3 last:pb-3">
                              <p className="text-xs font-medium text-[#78829d] mb-0.5">{fieldName}</p>
                              {displayValue ? (
                                <p className="text-sm text-[#252f4a] whitespace-pre-wrap break-words">
                                  {displayValue}
                                </p>
                              ) : (
                                <p className="text-sm text-[#78829d]">—</p>
                              )}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export default function OracleTabs({ workspaceId, brandData, objectives }: OracleTabsProps) {
  const [activeTab, setActiveTab] = useState<'brand' | 'objectives'>('brand')

  const brandCategoriesWithData = brandData.filter((c) => c.populatedCount > 0).length

  return (
    <div>
      <div className="flex items-center gap-1 mb-6 border-b border-[#e8e8e8]">
        <button
          type="button"
          onClick={() => setActiveTab('brand')}
          className={`relative pb-2.5 px-4 text-sm font-medium transition-colors ${
            activeTab === 'brand'
              ? 'text-[#252f4a] border-b-2 border-[#1B84FF]'
              : 'text-[#78829d] hover:text-[#252f4a]'
          }`}
        >
          Brand
          {brandCategoriesWithData > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-[#1B84FF]/10 px-2 py-0.5 text-xs font-semibold text-[#1B84FF]">
              {brandCategoriesWithData}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('objectives')}
          className={`relative pb-2.5 px-4 text-sm font-medium transition-colors ${
            activeTab === 'objectives'
              ? 'text-[#252f4a] border-b-2 border-[#1B84FF]'
              : 'text-[#78829d] hover:text-[#252f4a]'
          }`}
        >
          Objectives
          {objectives.length > 0 && (
            <span className="ml-2 inline-flex items-center rounded-full bg-[#f1f1f4] px-2 py-0.5 text-xs font-semibold text-[#78829d]">
              {objectives.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'brand' ? (
        <BrandTab workspaceId={workspaceId} brandData={brandData} />
      ) : (
        <ObjectivesTab workspaceId={workspaceId} objectives={objectives} />
      )}
    </div>
  )
}
