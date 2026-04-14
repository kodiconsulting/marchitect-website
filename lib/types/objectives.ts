// --- Objectives ---

export interface Objective {
  id: string
  workspaceId: string
  name: string
  successDefinition: string | null
  targetTimeline: string | null
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'planning' | 'active' | 'paused' | 'complete'
  createdAt: string
  updatedAt: string
}

export interface ObjectiveWithCompleteness extends Objective {
  oracleCompleteness: Record<string, { total: number; filled: number }>
}

export interface CreateObjectiveRequest {
  name: string
  successDefinition?: string
  targetTimeline?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
}

export interface UpdateObjectiveRequest {
  name?: string
  successDefinition?: string
  targetTimeline?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'planning' | 'active' | 'paused' | 'complete'
}

// --- Oracle (extended) ---

export type OracleLevel = 'brand' | 'objective'

export interface OracleCategoryDef {
  level: OracleLevel
  category: string
  displayOrder: number
  workshopName: string | null
  workshopPrompt: string | null
}

export interface OracleField {
  id: string
  workspaceId: string
  objectiveId: string | null // null = Brand-level
  category: string
  fieldName: string
  fieldValue: unknown | null
  updatedBy: string | null
  updatedAt: string
}

export interface OracleSyncField {
  category: string
  fieldName: string
  fieldValue: unknown
  objectiveId?: string // omit for Brand-level
}

export interface OracleSyncRequest {
  fields: OracleSyncField[]
  updatedBy: string
}

export interface OracleFullDump {
  brand: Record<string, Record<string, unknown>>
  objectives: Array<{
    objectiveId: string
    objectiveName: string
    sections: Record<string, Record<string, unknown>>
  }>
}

// --- Campaign Readiness ---

export interface CampaignReadiness {
  ready: boolean
  missing: Array<{
    category: string
    workshop: string
    prompt: string
  }>
  complete: string[]
}
