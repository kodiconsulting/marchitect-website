CREATE TABLE "audit_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_number" text NOT NULL,
	"description" text NOT NULL,
	"pillar_id" uuid NOT NULL,
	"tier" integer NOT NULL,
	"toggle_tags" text[] DEFAULT '{}' NOT NULL,
	"definition_of_done" text,
	"related_oracle_fields" text[] DEFAULT '{}',
	"related_playbook_id" uuid,
	CONSTRAINT "audit_items_item_number_unique" UNIQUE("item_number")
);
--> statement-breakpoint
CREATE TABLE "audit_score_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"audit_item_id" uuid NOT NULL,
	"score" integer NOT NULL,
	"scored_by" text NOT NULL,
	"scored_date" timestamp NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "audit_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"audit_item_id" uuid NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"scored_by" text DEFAULT 'system' NOT NULL,
	"scored_date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	CONSTRAINT "audit_scores_workspace_id_audit_item_id_unique" UNIQUE("workspace_id","audit_item_id")
);
--> statement-breakpoint
CREATE TABLE "client_playbook_status" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"playbook_item_id" uuid NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"completed_version_url" text,
	"completed_date" timestamp,
	CONSTRAINT "client_playbook_status_workspace_id_playbook_item_id_unique" UNIQUE("workspace_id","playbook_item_id")
);
--> statement-breakpoint
CREATE TABLE "engagement_phases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phase_number" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"associated_pillars" integer[] DEFAULT '{}',
	"typical_month_range" text,
	CONSTRAINT "engagement_phases_phase_number_unique" UNIQUE("phase_number")
);
--> statement-breakpoint
CREATE TABLE "function_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"function_id" uuid NOT NULL,
	"assigned_owner" text,
	"internal_external" text,
	"gwc_get" boolean,
	"gwc_want" boolean,
	"gwc_capacity" boolean,
	"notes" text,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "function_assignments_workspace_id_function_id_unique" UNIQUE("workspace_id","function_id")
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"goal_text" text NOT NULL,
	"timeframe" text NOT NULL,
	"linked_revenue_target" numeric,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inbound_audit_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_text" text NOT NULL,
	"category" text NOT NULL,
	"display_order" integer NOT NULL,
	"tooltip" text,
	"response_type" text DEFAULT 'scale' NOT NULL,
	"response_options" jsonb,
	"audit_item_id" uuid
);
--> statement-breakpoint
CREATE TABLE "inbound_audit_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"response_value" text NOT NULL,
	"calculated_score" numeric
);
--> statement-breakpoint
CREATE TABLE "intake_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"submission_date" timestamp DEFAULT now() NOT NULL,
	"submitted_by" uuid,
	CONSTRAINT "intake_responses_workspace_id_unique" UNIQUE("workspace_id")
);
--> statement-breakpoint
CREATE TABLE "kpi_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kpi_id" uuid NOT NULL,
	"value" numeric NOT NULL,
	"recorded_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kpis" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"name" text NOT NULL,
	"definition" text,
	"owner" text,
	"target_value" numeric,
	"current_value" numeric,
	"unit" text NOT NULL,
	"update_frequency" text NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"revenue_range" text,
	"industry" text,
	"website_url" text,
	"role_title" text,
	"submission_date" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"converted_workspace_id" uuid
);
--> statement-breakpoint
CREATE TABLE "login_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"tool_name" text NOT NULL,
	"category" text NOT NULL,
	"login_url" text,
	"username" text,
	"owner" text,
	"monthly_cost" numeric,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketing_functions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"function_name" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"pillar_id" uuid
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"rock_id" uuid NOT NULL,
	"title" text NOT NULL,
	"owner" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"target_date" date
);
--> statement-breakpoint
CREATE TABLE "oracle_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"category" text NOT NULL,
	"field_name" text NOT NULL,
	"field_value" jsonb,
	"last_updated" timestamp DEFAULT now() NOT NULL,
	"updated_by" text DEFAULT 'system' NOT NULL,
	"related_audit_items" text[] DEFAULT '{}',
	CONSTRAINT "oracle_fields_workspace_id_category_field_name_unique" UNIQUE("workspace_id","category","field_name")
);
--> statement-breakpoint
CREATE TABLE "pillars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pillar_number" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "pillars_pillar_number_unique" UNIQUE("pillar_number")
);
--> statement-breakpoint
CREATE TABLE "playbook_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"pillar_id" uuid,
	"related_audit_item_ids" uuid[] DEFAULT '{}',
	"toggle_requirements" text[] DEFAULT '{}',
	"engagement_phase" integer,
	"file_url" text
);
--> statement-breakpoint
CREATE TABLE "rocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"quarter" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"definition_of_done" text,
	"owner" text NOT NULL,
	"status" text DEFAULT 'not_started' NOT NULL,
	"target_date" date,
	"linked_audit_item_ids" uuid[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"milestone_id" uuid NOT NULL,
	"title" text NOT NULL,
	"owner" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"due_date" date
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"hashed_password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "workspace_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"key_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	CONSTRAINT "workspace_api_keys_key_hash_unique" UNIQUE("key_hash")
);
--> statement-breakpoint
CREATE TABLE "workspace_engagement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"current_phase" integer DEFAULT 1 NOT NULL,
	"phase_history" jsonb DEFAULT '[]' NOT NULL,
	CONSTRAINT "workspace_engagement_workspace_id_unique" UNIQUE("workspace_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"workspace_id" uuid NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"engagement_start_date" date,
	"current_phase" integer DEFAULT 1,
	"toggle_core" boolean DEFAULT true NOT NULL,
	"toggle_lead_gen" boolean DEFAULT false NOT NULL,
	"toggle_ecom" boolean DEFAULT false NOT NULL,
	"toggle_b2b" boolean DEFAULT false NOT NULL,
	"toggle_b2c" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_items" ADD CONSTRAINT "audit_items_pillar_id_pillars_id_fk" FOREIGN KEY ("pillar_id") REFERENCES "public"."pillars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_score_history" ADD CONSTRAINT "audit_score_history_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_score_history" ADD CONSTRAINT "audit_score_history_audit_item_id_audit_items_id_fk" FOREIGN KEY ("audit_item_id") REFERENCES "public"."audit_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_scores" ADD CONSTRAINT "audit_scores_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_scores" ADD CONSTRAINT "audit_scores_audit_item_id_audit_items_id_fk" FOREIGN KEY ("audit_item_id") REFERENCES "public"."audit_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_playbook_status" ADD CONSTRAINT "client_playbook_status_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_playbook_status" ADD CONSTRAINT "client_playbook_status_playbook_item_id_playbook_items_id_fk" FOREIGN KEY ("playbook_item_id") REFERENCES "public"."playbook_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "function_assignments" ADD CONSTRAINT "function_assignments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "function_assignments" ADD CONSTRAINT "function_assignments_function_id_marketing_functions_id_fk" FOREIGN KEY ("function_id") REFERENCES "public"."marketing_functions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_audit_questions" ADD CONSTRAINT "inbound_audit_questions_audit_item_id_audit_items_id_fk" FOREIGN KEY ("audit_item_id") REFERENCES "public"."audit_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_audit_responses" ADD CONSTRAINT "inbound_audit_responses_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inbound_audit_responses" ADD CONSTRAINT "inbound_audit_responses_question_id_inbound_audit_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."inbound_audit_questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_responses" ADD CONSTRAINT "intake_responses_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_responses" ADD CONSTRAINT "intake_responses_submitted_by_users_id_fk" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kpi_history" ADD CONSTRAINT "kpi_history_kpi_id_kpis_id_fk" FOREIGN KEY ("kpi_id") REFERENCES "public"."kpis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kpis" ADD CONSTRAINT "kpis_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_converted_workspace_id_workspaces_id_fk" FOREIGN KEY ("converted_workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "login_entries" ADD CONSTRAINT "login_entries_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketing_functions" ADD CONSTRAINT "marketing_functions_pillar_id_pillars_id_fk" FOREIGN KEY ("pillar_id") REFERENCES "public"."pillars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_rock_id_rocks_id_fk" FOREIGN KEY ("rock_id") REFERENCES "public"."rocks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oracle_fields" ADD CONSTRAINT "oracle_fields_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "playbook_items" ADD CONSTRAINT "playbook_items_pillar_id_pillars_id_fk" FOREIGN KEY ("pillar_id") REFERENCES "public"."pillars"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rocks" ADD CONSTRAINT "rocks_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "todos" ADD CONSTRAINT "todos_milestone_id_milestones_id_fk" FOREIGN KEY ("milestone_id") REFERENCES "public"."milestones"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_api_keys" ADD CONSTRAINT "workspace_api_keys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_engagement" ADD CONSTRAINT "workspace_engagement_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_memberships" ADD CONSTRAINT "workspace_memberships_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_memberships" ADD CONSTRAINT "workspace_memberships_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;