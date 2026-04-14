-- Migration: Two-level Oracle (Brand + Objective) support
-- Steps: objectives table, objective_id on oracle_fields, updated unique constraint, oracle_category_defs seed

-- 1a. Create objectives table
CREATE TABLE "objectives" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "workspace_id" uuid NOT NULL,
  "name" text NOT NULL,
  "success_definition" text,
  "target_timeline" text,
  "priority" text DEFAULT 'medium' NOT NULL,
  "status" text DEFAULT 'planning' NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  "updated_at" timestamptz DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_workspace_id_workspaces_id_fk"
  FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE CASCADE ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_objectives_workspace" ON "objectives"("workspace_id");

-- 1b. Add objective_id column to oracle_fields
ALTER TABLE "oracle_fields" ADD COLUMN "objective_id" uuid;
--> statement-breakpoint
ALTER TABLE "oracle_fields" ADD CONSTRAINT "oracle_fields_objective_id_objectives_id_fk"
  FOREIGN KEY ("objective_id") REFERENCES "public"."objectives"("id") ON DELETE CASCADE ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_oracle_fields_objective" ON "oracle_fields"("objective_id");

-- 1c. Replace unique constraint to account for objective scoping
-- Existing rows are Brand-level (objective_id = NULL) — no data migration needed
ALTER TABLE "oracle_fields" DROP CONSTRAINT "oracle_fields_workspace_id_category_field_name_unique";
--> statement-breakpoint
-- NULLS NOT DISTINCT treats NULLs as equal for uniqueness (requires PostgreSQL 15+, which Supabase runs)
ALTER TABLE "oracle_fields" ADD CONSTRAINT "uq_oracle_fields_scoped"
  UNIQUE NULLS NOT DISTINCT ("workspace_id", "objective_id", "category", "field_name");

-- 1d. Create oracle_category_defs reference table
CREATE TABLE "oracle_category_defs" (
  "id" serial PRIMARY KEY,
  "level" text NOT NULL CHECK ("level" IN ('brand', 'objective')),
  "category" text NOT NULL UNIQUE,
  "display_order" integer NOT NULL,
  "workshop_name" text,
  "workshop_prompt" text
);
--> statement-breakpoint
INSERT INTO "oracle_category_defs" ("level", "category", "display_order", "workshop_name", "workshop_prompt") VALUES
  ('brand',     'Company Identity',               1, 'Company Identity Questionnaire',  'Run the Company Identity Questionnaire in Cowork to populate this section.'),
  ('brand',     'Brand & Positioning',            2, 'Brand & Positioning Workshop',    'Run the Brand & Positioning Workshop in Cowork to populate this section.'),
  ('brand',     'Visual Identity',                3, 'Visual Identity Questionnaire',   'Run the Visual Identity Questionnaire in Cowork to populate this section.'),
  ('brand',     'Competitive Landscape',          4, 'Competitive Landscape Workshop',  'Run the Competitive Landscape Workshop in Cowork to populate this section.'),
  ('objective', 'Objective Definition',           1, NULL,                              NULL),
  ('objective', 'Product / Service Definition',   2, 'Product & Service Workshop',      'Run the Product & Service Workshop in Cowork to populate this section.'),
  ('objective', 'Target Avatars / ICP',           3, 'Avatar & ICP Workshop',           'Run the Avatar & ICP Workshop in Cowork to populate this section.'),
  ('objective', 'Offer Architecture',             4, 'Offer Architecture Workshop',     'Run the Offer Architecture Workshop in Cowork to populate this section.'),
  ('objective', 'Channel Strategy',               5, 'Channel Strategy Workshop',       'Run the Channel Strategy Workshop in Cowork to populate this section.');
