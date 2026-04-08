import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  date,
  jsonb,
  numeric,
  unique,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull(), // admin, fcmo, client, ceo
  hashedPassword: text('hashed_password').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const workspaces = pgTable('workspaces', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  clientName: text('client_name').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  engagementStartDate: date('engagement_start_date'),
  currentPhase: integer('current_phase').default(1),
  toggleCore: boolean('toggle_core').notNull().default(true),
  toggleLeadGen: boolean('toggle_lead_gen').notNull().default(false),
  toggleEcom: boolean('toggle_ecom').notNull().default(false),
  toggleB2b: boolean('toggle_b2b').notNull().default(false),
  toggleB2c: boolean('toggle_b2c').notNull().default(false),
})

export const workspaceMemberships = pgTable('workspace_memberships', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // admin, fcmo, client, ceo
})

export const workspaceApiKeys = pgTable('workspace_api_keys', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  keyHash: text('key_hash').notNull().unique(),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  lastUsedAt: timestamp('last_used_at'),
})

export const oracleFields = pgTable(
  'oracle_fields',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    category: text('category').notNull(),
    fieldName: text('field_name').notNull(),
    fieldValue: jsonb('field_value'),
    lastUpdated: timestamp('last_updated').notNull().default(sql`now()`),
    updatedBy: text('updated_by').notNull().default('system'),
    relatedAuditItems: text('related_audit_items')
      .array()
      .default(sql`'{}'`),
  },
  (t) => [unique().on(t.workspaceId, t.category, t.fieldName)]
)

export const pillars = pgTable('pillars', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  pillarNumber: integer('pillar_number').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
})

export const auditItems = pgTable('audit_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  itemNumber: text('item_number').notNull().unique(),
  description: text('description').notNull(),
  pillarId: uuid('pillar_id')
    .notNull()
    .references(() => pillars.id),
  tier: integer('tier').notNull(),
  toggleTags: text('toggle_tags')
    .array()
    .notNull()
    .default(sql`'{}'`),
  definitionOfDone: text('definition_of_done'),
  relatedOracleFields: text('related_oracle_fields')
    .array()
    .default(sql`'{}'`),
  relatedPlaybookId: uuid('related_playbook_id'), // nullable, references playbook_items — FK added later to avoid circular
})

export const auditScores = pgTable(
  'audit_scores',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    auditItemId: uuid('audit_item_id')
      .notNull()
      .references(() => auditItems.id),
    score: integer('score').notNull().default(0),
    scoredBy: text('scored_by').notNull().default('system'),
    scoredDate: timestamp('scored_date').notNull().default(sql`now()`),
    notes: text('notes'),
  },
  (t) => [unique().on(t.workspaceId, t.auditItemId)]
)

export const auditScoreHistory = pgTable('audit_score_history', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  auditItemId: uuid('audit_item_id')
    .notNull()
    .references(() => auditItems.id),
  score: integer('score').notNull(),
  scoredBy: text('scored_by').notNull(),
  scoredDate: timestamp('scored_date').notNull(),
  notes: text('notes'),
})

export const rocks = pgTable('rocks', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  quarter: text('quarter').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  definitionOfDone: text('definition_of_done'),
  owner: text('owner').notNull(),
  status: text('status').notNull().default('not_started'),
  targetDate: date('target_date'),
  linkedAuditItemIds: uuid('linked_audit_item_ids')
    .array()
    .default(sql`'{}'`),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  completedAt: timestamp('completed_at'),
})

export const milestones = pgTable('milestones', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  rockId: uuid('rock_id')
    .notNull()
    .references(() => rocks.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  owner: text('owner').notNull(),
  status: text('status').notNull().default('not_started'),
  targetDate: date('target_date'),
})

export const todos = pgTable('todos', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  milestoneId: uuid('milestone_id')
    .notNull()
    .references(() => milestones.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  owner: text('owner').notNull(),
  status: text('status').notNull().default('pending'),
  dueDate: date('due_date'),
})

export const goals = pgTable('goals', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  goalText: text('goal_text').notNull(),
  timeframe: text('timeframe').notNull(),
  linkedRevenueTarget: numeric('linked_revenue_target'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  lastUpdated: timestamp('last_updated').notNull().default(sql`now()`),
})

export const kpis = pgTable('kpis', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  definition: text('definition'),
  owner: text('owner'),
  targetValue: numeric('target_value'),
  currentValue: numeric('current_value'),
  unit: text('unit').notNull(),
  updateFrequency: text('update_frequency').notNull(),
  lastUpdated: timestamp('last_updated').notNull().default(sql`now()`),
})

export const kpiHistory = pgTable('kpi_history', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  kpiId: uuid('kpi_id')
    .notNull()
    .references(() => kpis.id, { onDelete: 'cascade' }),
  value: numeric('value').notNull(),
  recordedDate: timestamp('recorded_date').notNull().default(sql`now()`),
})

export const marketingFunctions = pgTable('marketing_functions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  functionName: text('function_name').notNull(),
  category: text('category').notNull(),
  description: text('description'),
  pillarId: uuid('pillar_id').references(() => pillars.id),
})

export const functionAssignments = pgTable(
  'function_assignments',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    functionId: uuid('function_id')
      .notNull()
      .references(() => marketingFunctions.id),
    assignedOwner: text('assigned_owner'),
    internalExternal: text('internal_external'),
    gwcGet: boolean('gwc_get'),
    gwcWant: boolean('gwc_want'),
    gwcCapacity: boolean('gwc_capacity'),
    notes: text('notes'),
    lastUpdated: timestamp('last_updated').notNull().default(sql`now()`),
  },
  (t) => [unique().on(t.workspaceId, t.functionId)]
)

export const loginEntries = pgTable('login_entries', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  toolName: text('tool_name').notNull(),
  category: text('category').notNull(),
  loginUrl: text('login_url'),
  username: text('username'),
  owner: text('owner'),
  monthlyCost: numeric('monthly_cost'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
  lastUpdated: timestamp('last_updated').notNull().default(sql`now()`),
})

export const engagementPhases = pgTable('engagement_phases', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  phaseNumber: integer('phase_number').notNull().unique(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  associatedPillars: integer('associated_pillars')
    .array()
    .default(sql`'{}'`),
  typicalMonthRange: text('typical_month_range'),
})

export const workspaceEngagement = pgTable('workspace_engagement', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .unique(),
  currentPhase: integer('current_phase').notNull().default(1),
  phaseHistory: jsonb('phase_history').notNull().default(sql`'[]'`),
})

export const playbookItems = pgTable('playbook_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description'),
  pillarId: uuid('pillar_id').references(() => pillars.id),
  relatedAuditItemIds: uuid('related_audit_item_ids')
    .array()
    .default(sql`'{}'`),
  toggleRequirements: text('toggle_requirements')
    .array()
    .default(sql`'{}'`),
  engagementPhase: integer('engagement_phase'),
  fileUrl: text('file_url'),
})

export const clientPlaybookStatus = pgTable(
  'client_playbook_status',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    playbookItemId: uuid('playbook_item_id')
      .notNull()
      .references(() => playbookItems.id),
    status: text('status').notNull().default('available'),
    completedVersionUrl: text('completed_version_url'),
    completedDate: timestamp('completed_date'),
  },
  (t) => [unique().on(t.workspaceId, t.playbookItemId)]
)

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  revenueRange: text('revenue_range'),
  industry: text('industry'),
  websiteUrl: text('website_url'),
  roleTitle: text('role_title'),
  submissionDate: timestamp('submission_date').notNull().default(sql`now()`),
  status: text('status').notNull().default('new'),
  convertedWorkspaceId: uuid('converted_workspace_id').references(
    () => workspaces.id
  ),
})

export const inboundAuditQuestions = pgTable('inbound_audit_questions', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  questionText: text('question_text').notNull(),
  category: text('category').notNull(),
  displayOrder: integer('display_order').notNull(),
  tooltip: text('tooltip'),
  responseType: text('response_type').notNull().default('scale'),
  responseOptions: jsonb('response_options'),
  auditItemId: uuid('audit_item_id').references(() => auditItems.id),
})

export const inboundAuditResponses = pgTable('inbound_audit_responses', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  leadId: uuid('lead_id')
    .notNull()
    .references(() => leads.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id')
    .notNull()
    .references(() => inboundAuditQuestions.id),
  responseValue: text('response_value').notNull(),
  calculatedScore: numeric('calculated_score'),
})

export const intakeResponses = pgTable('intake_responses', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' })
    .unique(),
  data: jsonb('data').notNull(),
  submissionDate: timestamp('submission_date').notNull().default(sql`now()`),
  submittedBy: uuid('submitted_by').references(() => users.id),
})

export const teamMembers = pgTable('team_members', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id')
    .notNull()
    .references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  title: text('title'),
  email: text('email'),
  phone: text('phone'),
  reportsTo: uuid('reports_to'), // self-reference; FK enforced in DB only
  category: text('category').notNull().default('client'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const workspaceLocations = pgTable('workspace_locations', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  address: text('address'),
  services: text('services'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  channel: text('channel'),
  offer: text('offer'),
  audience: text('audience'),
  budget: numeric('budget'),
  cpl: numeric('cpl'),
  status: text('status').notNull().default('active'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const promoEntries = pgTable('promo_entries', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  month: text('month').notNull(),
  year: integer('year').notNull(),
  serviceCategory: text('service_category'),
  offer: text('offer'),
  status: text('status').notNull().default('upcoming'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const leadSequences = pgTable('lead_sequences', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  stage: text('stage'),
  platform: text('platform'),
  docLink: text('doc_link'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const adSpendEntries = pgTable('ad_spend_entries', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  channel: text('channel').notNull(),
  weeklyAvg: numeric('weekly_avg'),
  monthlyBudget: numeric('monthly_budget'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const budgetExpenses = pgTable('budget_expenses', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  purpose: text('purpose').notNull(),
  vendor: text('vendor'),
  costPerMonth: numeric('cost_per_month'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const brandAssets = pgTable('brand_assets', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  assetName: text('asset_name').notNull(),
  assetType: text('asset_type'),
  haveIt: text('have_it').notNull().default('pending'),
  link: text('link'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const sourceDocuments = pgTable('source_documents', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  docDate: text('doc_date'),
  docType: text('doc_type'),
  fileName: text('file_name').notNull(),
  fileLink: text('file_link'),
  keyThemes: text('key_themes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})

export const clientProjects = pgTable('client_projects', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  owner: text('owner'),
  status: text('status').notNull().default('open'),
  isPast: boolean('is_past').notNull().default(false),
  dueDate: date('due_date'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`now()`),
})
