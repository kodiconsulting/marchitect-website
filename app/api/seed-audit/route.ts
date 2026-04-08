import { db } from '@/lib/db'
import { pillars, auditItems } from '@/lib/db/schema'

const PILLARS_DATA = [
  {
    pillarNumber: 1,
    name: 'Brand & Positioning Foundation',
    description: 'Who you are, who you serve, and why anyone should care.',
  },
  {
    pillarNumber: 2,
    name: 'Offer Generation, Goals, Budget & Success Definitions',
    description:
      'What success looks like, how it\'s measured, and how it\'s funded.',
  },
  {
    pillarNumber: 3,
    name: 'Offer & Funnel Health',
    description:
      'What you\'re selling, how you\'re selling it, and how traffic converts.',
  },
  {
    pillarNumber: 4,
    name: 'Channel Strategy & Execution',
    description:
      'Which channels you use, why, how they\'re run, and how they perform.',
  },
  {
    pillarNumber: 5,
    name: 'Team & Resource Readiness',
    description:
      'Who owns what, whether they\'re right for it, and whether the team can scale.',
  },
  {
    pillarNumber: 6,
    name: 'Asset, Infrastructure & Compliance',
    description:
      'The tools, files, logins, brand assets, and legal compliance that keep the department running.',
  },
  {
    pillarNumber: 7,
    name: 'Operational Cadence & Project Management',
    description:
      'The meetings, tasks, and systems that keep work moving week to week.',
  },
  {
    pillarNumber: 8,
    name: 'Content & Creative Production',
    description:
      'The content strategy, calendar, creative standards, and production systems.',
  },
  {
    pillarNumber: 9,
    name: 'Sales-Marketing Alignment',
    description:
      'The lead handoff, qualification criteria, SLA, and feedback loop between sales and marketing.',
  },
  {
    pillarNumber: 10,
    name: 'Customer Retention & Expansion',
    description:
      'Marketing to existing customers — lifecycle, retention, referrals, and feedback.',
  },
  {
    pillarNumber: 11,
    name: 'Measurement, Attribution & Reporting',
    description:
      'Tracking setup, attribution, dashboards, and data-driven decision making.',
  },
  {
    pillarNumber: 12,
    name: 'Overall Marketing Maturity',
    description:
      'Cross-cutting self-sufficiency indicators — can the team run without external help?',
  },
]

// item_number, description, pillarNumber (1-12), tier, toggleTags
const AUDIT_ITEMS_DATA: {
  itemNumber: string
  description: string
  pillarNumber: number
  tier: number
  toggleTags: string[]
}[] = [
  // PILLAR 1
  { itemNumber: '1.1', description: 'Is there a documented positioning statement?', pillarNumber: 1, tier: 1, toggleTags: ['core'] },
  { itemNumber: '1.2', description: 'Are ideal customer avatars defined with data (not assumptions)?', pillarNumber: 1, tier: 1, toggleTags: ['core'] },
  { itemNumber: '1.3', description: "Can every team member articulate the company's differentiation in one sentence?", pillarNumber: 1, tier: 1, toggleTags: ['core'] },
  { itemNumber: '1.4', description: 'Is the brand identity document complete and current?', pillarNumber: 1, tier: 1, toggleTags: ['core'] },
  { itemNumber: '1.5', description: 'Has a competitive analysis been completed in the last 12 months?', pillarNumber: 1, tier: 2, toggleTags: ['core'] },
  { itemNumber: '1.6', description: 'Have Win/Loss interviews been conducted (minimum 5)?', pillarNumber: 1, tier: 2, toggleTags: ['lead_gen'] },
  { itemNumber: '1.7', description: "Is there a defined 'who we are NOT for' statement?", pillarNumber: 1, tier: 2, toggleTags: ['core'] },
  { itemNumber: '1.8', description: 'Are credibility anchors documented (proof points, case studies, awards)?', pillarNumber: 1, tier: 2, toggleTags: ['core'] },
  { itemNumber: '1.9', description: 'Is there a crisis response playbook?', pillarNumber: 1, tier: 3, toggleTags: ['core'] },
  { itemNumber: '1.10', description: 'Are online reviews being monitored and responded to?', pillarNumber: 1, tier: 3, toggleTags: ['core'] },
  { itemNumber: '1.11', description: 'Is there a documented process for handling negative publicity?', pillarNumber: 1, tier: 3, toggleTags: ['core'] },
  { itemNumber: '1.12', description: 'Are customer-facing employees trained on brand messaging?', pillarNumber: 1, tier: 3, toggleTags: ['core'] },
  // PILLAR 2
  { itemNumber: '2.1', description: 'Are annual marketing goals documented and aligned with revenue targets?', pillarNumber: 2, tier: 1, toggleTags: ['core'] },
  { itemNumber: '2.2', description: 'Are funnel stages defined and agreed upon across sales and marketing?', pillarNumber: 2, tier: 1, toggleTags: ['lead_gen'] },
  { itemNumber: '2.3', description: 'Are funnel stages defined (browse > cart > purchase > repeat)?', pillarNumber: 2, tier: 1, toggleTags: ['ecom'] },
  { itemNumber: '2.4', description: "Are quarterly rocks defined with measurable 'done' criteria?", pillarNumber: 2, tier: 1, toggleTags: ['core'] },
  { itemNumber: '2.5', description: 'Does each KPI have a named owner?', pillarNumber: 2, tier: 1, toggleTags: ['core'] },
  { itemNumber: '2.6', description: 'Is there an annual marketing budget documented and approved?', pillarNumber: 2, tier: 1, toggleTags: ['core'] },
  { itemNumber: '2.7', description: 'Is there a documented attribution model?', pillarNumber: 2, tier: 2, toggleTags: ['core'] },
  { itemNumber: '2.8', description: 'Is there a regular reporting cadence in place?', pillarNumber: 2, tier: 2, toggleTags: ['core'] },
  { itemNumber: '2.9', description: 'Is the marketing vision (1-year and 3-year) documented?', pillarNumber: 2, tier: 2, toggleTags: ['core'] },
  { itemNumber: '2.10', description: 'Do monthly milestones roll up to quarterly rocks?', pillarNumber: 2, tier: 2, toggleTags: ['core'] },
  { itemNumber: '2.11', description: 'Is there a weekly to-do structure connected to monthly milestones?', pillarNumber: 2, tier: 2, toggleTags: ['core'] },
  { itemNumber: '2.12', description: 'Is budget tracked monthly with variance reporting?', pillarNumber: 2, tier: 2, toggleTags: ['core'] },
  { itemNumber: '2.13', description: 'Are performance benchmarks documented for your industry?', pillarNumber: 2, tier: 3, toggleTags: ['core'] },
  { itemNumber: '2.14', description: 'Is there a mid-year budget reforecast process?', pillarNumber: 2, tier: 3, toggleTags: ['core'] },
  { itemNumber: '2.15', description: 'Can the marketing leader justify the budget with expected ROI?', pillarNumber: 2, tier: 3, toggleTags: ['core'] },
  // PILLAR 3
  { itemNumber: '3.1', description: 'Is there a documented front-end offer designed for cold traffic?', pillarNumber: 3, tier: 1, toggleTags: ['lead_gen'] },
  { itemNumber: '3.2', description: 'Are product pages optimized with clear CTAs, reviews, and comparison tools?', pillarNumber: 3, tier: 1, toggleTags: ['ecom'] },
  { itemNumber: '3.3', description: 'Does the funnel have a clear, low-friction CTA?', pillarNumber: 3, tier: 1, toggleTags: ['core'] },
  { itemNumber: '3.4', description: 'Is there a documented funnel map from traffic to sale?', pillarNumber: 3, tier: 1, toggleTags: ['core'] },
  { itemNumber: '3.5', description: 'Are conversion rates tracked at each funnel stage?', pillarNumber: 3, tier: 1, toggleTags: ['core'] },
  { itemNumber: '3.6', description: 'Is there a defined offer ladder (front-end > core > upsell)?', pillarNumber: 3, tier: 2, toggleTags: ['core'] },
  { itemNumber: '3.7', description: 'Is there a shopping cart abandonment recovery sequence?', pillarNumber: 3, tier: 2, toggleTags: ['ecom'] },
  { itemNumber: '3.8', description: 'Has the offer been tested against at least one alternative?', pillarNumber: 3, tier: 2, toggleTags: ['core'] },
  { itemNumber: '3.9', description: 'Is there a documented testing methodology with kill criteria?', pillarNumber: 3, tier: 3, toggleTags: ['core'] },
  { itemNumber: '3.10', description: 'Does the team have playbooks to build new funnels independently?', pillarNumber: 3, tier: 3, toggleTags: ['core'] },
  { itemNumber: '3.11', description: 'Is pricing strategy documented with competitive context?', pillarNumber: 3, tier: 3, toggleTags: ['core'] },
  // PILLAR 4
  { itemNumber: '4.1', description: 'Is there a documented channel strategy with rationale for each channel?', pillarNumber: 4, tier: 1, toggleTags: ['core'] },
  { itemNumber: '4.2', description: "Is budget allocated intentionally (not just 'whatever's left')?", pillarNumber: 4, tier: 1, toggleTags: ['core'] },
  { itemNumber: '4.3', description: 'Does each active channel have a named owner?', pillarNumber: 4, tier: 1, toggleTags: ['core'] },
  { itemNumber: '4.4', description: 'Has competitive research been conducted for primary channels?', pillarNumber: 4, tier: 2, toggleTags: ['core'] },
  { itemNumber: '4.5', description: 'Are campaigns structured with clear naming conventions and tracking?', pillarNumber: 4, tier: 2, toggleTags: ['core'] },
  { itemNumber: '4.6', description: 'Is there a defined process for when to optimize vs. kill a campaign?', pillarNumber: 4, tier: 2, toggleTags: ['core'] },
  { itemNumber: '4.7', description: 'Is there a campaign brief template in use?', pillarNumber: 4, tier: 2, toggleTags: ['core'] },
  { itemNumber: '4.8', description: 'Is there an ABM strategy for top target accounts?', pillarNumber: 4, tier: 2, toggleTags: ['b2b'] },
  { itemNumber: '4.9', description: 'Are marketplace/platform-specific strategies documented?', pillarNumber: 4, tier: 2, toggleTags: ['ecom'] },
  { itemNumber: '4.10', description: 'Is there a seasonal planning calendar?', pillarNumber: 4, tier: 2, toggleTags: ['core'] },
  { itemNumber: '4.11', description: 'Are agencies/vendors evaluated against a defined scorecard?', pillarNumber: 4, tier: 2, toggleTags: ['core'] },
  { itemNumber: '4.12', description: 'Is there a documented research process before launching new channels?', pillarNumber: 4, tier: 3, toggleTags: ['core'] },
  { itemNumber: '4.13', description: "'Time to results' expectations documented by channel?", pillarNumber: 4, tier: 3, toggleTags: ['core'] },
  // PILLAR 5
  { itemNumber: '5.1', description: 'Is there a completed Responsibility Matrix with every function assigned?', pillarNumber: 5, tier: 1, toggleTags: ['core'] },
  { itemNumber: '5.2', description: 'Does the Marketing Technician role exist and is it clearly defined?', pillarNumber: 5, tier: 1, toggleTags: ['core'] },
  { itemNumber: '5.3', description: 'Does each team member know exactly which functions they own?', pillarNumber: 5, tier: 1, toggleTags: ['core'] },
  { itemNumber: '5.4', description: 'Has a GWC assessment been conducted for each team member?', pillarNumber: 5, tier: 2, toggleTags: ['core'] },
  { itemNumber: '5.5', description: 'Are all vendor/contractor relationships governed by clear deliverables?', pillarNumber: 5, tier: 2, toggleTags: ['core'] },
  { itemNumber: '5.6', description: 'Is there a performance evaluation process for marketing team members?', pillarNumber: 5, tier: 2, toggleTags: ['core'] },
  { itemNumber: '5.7', description: 'Are salary/rate benchmarks documented for each function?', pillarNumber: 5, tier: 2, toggleTags: ['core'] },
  { itemNumber: '5.8', description: 'Is there a team growth roadmap?', pillarNumber: 5, tier: 2, toggleTags: ['core'] },
  { itemNumber: '5.9', description: 'Is there a documented process for evaluating vendor performance?', pillarNumber: 5, tier: 2, toggleTags: ['core'] },
  { itemNumber: '5.10', description: 'Are handoff processes between team members documented?', pillarNumber: 5, tier: 3, toggleTags: ['core'] },
  { itemNumber: '5.11', description: 'Has an AI tool audit been conducted?', pillarNumber: 5, tier: 3, toggleTags: ['core'] },
  { itemNumber: '5.12', description: 'Is there a documented onboarding process for new marketing team members?', pillarNumber: 5, tier: 3, toggleTags: ['core'] },
  // PILLAR 6
  { itemNumber: '6.1', description: 'Is there a documented inventory of all tools, logins, and access?', pillarNumber: 6, tier: 1, toggleTags: ['core'] },
  { itemNumber: '6.2', description: 'Are brand guidelines documented and up to date?', pillarNumber: 6, tier: 1, toggleTags: ['core'] },
  { itemNumber: '6.3', description: 'Is the CRM properly configured with pipeline stages matching the funnel?', pillarNumber: 6, tier: 1, toggleTags: ['lead_gen'] },
  { itemNumber: '6.4', description: 'Is the ecommerce platform properly configured (checkout, shipping, tax)?', pillarNumber: 6, tier: 1, toggleTags: ['ecom'] },
  { itemNumber: '6.5', description: 'Is there a centralized, organized asset library?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.6', description: 'Is there a single source of truth for approved brand assets?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.7', description: 'Is there a digital asset kit with reusable templates?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.8', description: 'Are files organized with consistent naming conventions?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.9', description: 'Is the website privacy policy current and compliant?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.10', description: 'Is email marketing CAN-SPAM compliant?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.11', description: 'Is there a documented tool evaluation process?', pillarNumber: 6, tier: 3, toggleTags: ['core'] },
  { itemNumber: '6.12', description: 'Has an annual tool stack review been conducted?', pillarNumber: 6, tier: 3, toggleTags: ['core'] },
  { itemNumber: '6.13', description: 'Is the website ADA/WCAG accessible?', pillarNumber: 6, tier: 3, toggleTags: ['core'] },
  { itemNumber: '6.14', description: 'Are FTC disclosure requirements being met for testimonials/endorsements?', pillarNumber: 6, tier: 3, toggleTags: ['core'] },
  { itemNumber: '6.15', description: 'Can a new team member find what they need within their first day?', pillarNumber: 6, tier: 3, toggleTags: ['core'] },
  { itemNumber: '6.16', description: 'Is the tool stack documented with costs, owners, and renewal dates?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.17', description: 'Is there a password manager in use for all marketing credentials?', pillarNumber: 6, tier: 1, toggleTags: ['core'] },
  { itemNumber: '6.18', description: 'Are all marketing logins stored in the password manager (not spreadsheets)?', pillarNumber: 6, tier: 1, toggleTags: ['core'] },
  { itemNumber: '6.19', description: 'Is MFA enabled on all critical marketing accounts?', pillarNumber: 6, tier: 1, toggleTags: ['core'] },
  { itemNumber: '6.20', description: 'Is there a documented process for revoking access when someone leaves?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.21', description: 'Are marketing files organized in a centralized platform with a defined folder structure?', pillarNumber: 6, tier: 1, toggleTags: ['core'] },
  { itemNumber: '6.22', description: 'Are file naming conventions documented and followed?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.23', description: 'Is there a clear separation between brand assets (read-only) and working files?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.24', description: 'Are vendor/contractor files organized by vendor with contracts, briefs, and deliverables?', pillarNumber: 6, tier: 2, toggleTags: ['core'] },
  { itemNumber: '6.25', description: 'Is there a process for archiving completed campaigns?', pillarNumber: 6, tier: 3, toggleTags: ['core'] },
  { itemNumber: '6.26', description: 'Are all marketing credentials owned by company emails (not personal accounts)?', pillarNumber: 6, tier: 1, toggleTags: ['core'] },
  // PILLAR 7
  { itemNumber: '7.1', description: 'Is there a weekly marketing meeting with a defined agenda?', pillarNumber: 7, tier: 1, toggleTags: ['core'] },
  { itemNumber: '7.2', description: 'Is a PM tool in use with consistent task standards?', pillarNumber: 7, tier: 1, toggleTags: ['core'] },
  { itemNumber: '7.3', description: 'Are quarterly rocks set and tracked?', pillarNumber: 7, tier: 1, toggleTags: ['core'] },
  { itemNumber: '7.4', description: 'Is there a monthly performance review cadence?', pillarNumber: 7, tier: 2, toggleTags: ['core'] },
  { itemNumber: '7.5', description: 'Is there a clear process for prioritizing competing requests?', pillarNumber: 7, tier: 2, toggleTags: ['core'] },
  { itemNumber: '7.6', description: 'Does every task in the PM tool have an owner, due date, and definition of done?', pillarNumber: 7, tier: 2, toggleTags: ['core'] },
  { itemNumber: '7.7', description: 'Are production checklists documented for recurring deliverable types?', pillarNumber: 7, tier: 2, toggleTags: ['core'] },
  { itemNumber: '7.8', description: 'Are vendor check-ins happening on a defined cadence?', pillarNumber: 7, tier: 2, toggleTags: ['core'] },
  { itemNumber: '7.9', description: 'Is there a documented escalation process for blocked tasks?', pillarNumber: 7, tier: 3, toggleTags: ['core'] },
  { itemNumber: '7.10', description: 'Is the marketing team running their own meetings without FCMO facilitation?', pillarNumber: 7, tier: 4, toggleTags: ['core'] },
  // PILLAR 8
  { itemNumber: '8.1', description: 'Is there a content strategy framework in place?', pillarNumber: 8, tier: 2, toggleTags: ['core'] },
  { itemNumber: '8.2', description: 'Is there an active content calendar being maintained?', pillarNumber: 8, tier: 2, toggleTags: ['core'] },
  { itemNumber: '8.3', description: 'Are content themes aligned with target customer pain points?', pillarNumber: 8, tier: 2, toggleTags: ['core'] },
  { itemNumber: '8.4', description: 'Is there a product content strategy (descriptions, photography, video)?', pillarNumber: 8, tier: 2, toggleTags: ['ecom'] },
  { itemNumber: '8.5', description: 'Is the team running content planning meetings independently?', pillarNumber: 8, tier: 2, toggleTags: ['core'] },
  { itemNumber: '8.6', description: 'Are testimonials being collected and published regularly?', pillarNumber: 8, tier: 2, toggleTags: ['core'] },
  { itemNumber: '8.7', description: 'Is sales enablement content mapped to each funnel stage?', pillarNumber: 8, tier: 2, toggleTags: ['lead_gen'] },
  { itemNumber: '8.8', description: 'Are case studies documented with problem/solution/results?', pillarNumber: 8, tier: 3, toggleTags: ['core'] },
  { itemNumber: '8.9', description: 'Are editorial guidelines documented and followed?', pillarNumber: 8, tier: 3, toggleTags: ['core'] },
  { itemNumber: '8.10', description: 'Is there a content repurposing strategy?', pillarNumber: 8, tier: 3, toggleTags: ['core'] },
  { itemNumber: '8.11', description: 'Are AI tools being used for production efficiency?', pillarNumber: 8, tier: 3, toggleTags: ['core'] },
  { itemNumber: '8.12', description: 'Is user-generated content being leveraged?', pillarNumber: 8, tier: 3, toggleTags: ['ecom', 'b2c'] },
  // PILLAR 9
  { itemNumber: '9.1', description: 'Is there a documented lead handoff process from marketing to sales?', pillarNumber: 9, tier: 1, toggleTags: ['lead_gen'] },
  { itemNumber: '9.2', description: 'Are lead qualification criteria agreed upon by both teams?', pillarNumber: 9, tier: 1, toggleTags: ['lead_gen'] },
  { itemNumber: '9.3', description: 'Is there a sales-marketing SLA?', pillarNumber: 9, tier: 1, toggleTags: ['lead_gen'] },
  { itemNumber: '9.4', description: 'Is there a feedback loop for rejected/bad leads?', pillarNumber: 9, tier: 2, toggleTags: ['lead_gen'] },
  { itemNumber: '9.5', description: 'Is there a lead scoring model in place?', pillarNumber: 9, tier: 2, toggleTags: ['lead_gen', 'b2b'] },
  { itemNumber: '9.6', description: 'Is there a joint sales-marketing meeting cadence?', pillarNumber: 9, tier: 2, toggleTags: ['lead_gen'] },
  { itemNumber: '9.7', description: 'Can both teams see shared funnel data?', pillarNumber: 9, tier: 2, toggleTags: ['lead_gen'] },
  { itemNumber: '9.8', description: 'Is sales enablement content mapped to the sales process?', pillarNumber: 9, tier: 2, toggleTags: ['lead_gen'] },
  { itemNumber: '9.9', description: 'Is sales follow-up speed being tracked against SLA?', pillarNumber: 9, tier: 3, toggleTags: ['lead_gen'] },
  { itemNumber: '9.10', description: 'Is there an ABM coordination process between sales and marketing?', pillarNumber: 9, tier: 3, toggleTags: ['b2b'] },
  // PILLAR 10
  { itemNumber: '10.1', description: 'Is there a documented customer lifecycle map?', pillarNumber: 10, tier: 2, toggleTags: ['core'] },
  { itemNumber: '10.2', description: 'Is there an active retention/nurture communication for existing customers?', pillarNumber: 10, tier: 2, toggleTags: ['core'] },
  { itemNumber: '10.3', description: 'Is customer feedback being collected systematically (NPS, CSAT, surveys)?', pillarNumber: 10, tier: 2, toggleTags: ['core'] },
  { itemNumber: '10.4', description: 'Is there a referral program or structured referral ask?', pillarNumber: 10, tier: 2, toggleTags: ['core'] },
  { itemNumber: '10.5', description: 'Is there a post-purchase email sequence?', pillarNumber: 10, tier: 2, toggleTags: ['ecom'] },
  { itemNumber: '10.6', description: 'Is there an onboarding sequence for new clients?', pillarNumber: 10, tier: 2, toggleTags: ['lead_gen'] },
  { itemNumber: '10.7', description: 'Are churn early warning indicators defined and monitored?', pillarNumber: 10, tier: 3, toggleTags: ['core'] },
  { itemNumber: '10.8', description: 'Is there an upsell/cross-sell campaign strategy?', pillarNumber: 10, tier: 3, toggleTags: ['core'] },
  { itemNumber: '10.9', description: 'Is there a loyalty program?', pillarNumber: 10, tier: 3, toggleTags: ['ecom', 'b2c'] },
  { itemNumber: '10.10', description: 'Are customer advocacy programs in place (reviews, case studies, referrals)?', pillarNumber: 10, tier: 3, toggleTags: ['core'] },
  { itemNumber: '10.11', description: 'Is customer LTV tracked and used in marketing decisions?', pillarNumber: 10, tier: 3, toggleTags: ['core'] },
  { itemNumber: '10.12', description: 'Is there a win-back campaign for lapsed customers?', pillarNumber: 10, tier: 3, toggleTags: ['core'] },
  // PILLAR 11
  { itemNumber: '11.1', description: 'Is conversion tracking properly configured for all channels?', pillarNumber: 11, tier: 1, toggleTags: ['core'] },
  { itemNumber: '11.2', description: 'Is there a live performance dashboard accessible to leadership?', pillarNumber: 11, tier: 1, toggleTags: ['core'] },
  { itemNumber: '11.3', description: 'Can you calculate true cost per client/customer by channel?', pillarNumber: 11, tier: 1, toggleTags: ['core'] },
  { itemNumber: '11.4', description: 'Is CRM data connected to marketing data for closed-loop reporting?', pillarNumber: 11, tier: 1, toggleTags: ['lead_gen'] },
  { itemNumber: '11.5', description: 'Is ecommerce analytics properly configured (revenue, AOV, LTV tracking)?', pillarNumber: 11, tier: 1, toggleTags: ['ecom'] },
  { itemNumber: '11.6', description: 'Are UTM parameters used consistently across all campaigns?', pillarNumber: 11, tier: 2, toggleTags: ['core'] },
  { itemNumber: '11.7', description: 'Are reports generated and reviewed on a regular cadence?', pillarNumber: 11, tier: 2, toggleTags: ['core'] },
  { itemNumber: '11.8', description: 'Is there a defined testing methodology?', pillarNumber: 11, tier: 2, toggleTags: ['core'] },
  { itemNumber: '11.9', description: 'Is there a CRO process in place?', pillarNumber: 11, tier: 2, toggleTags: ['core'] },
  { itemNumber: '11.10', description: 'Are campaign decisions based on documented data thresholds?', pillarNumber: 11, tier: 2, toggleTags: ['core'] },
  { itemNumber: '11.11', description: 'Does the team understand how to interpret the dashboard independently?', pillarNumber: 11, tier: 3, toggleTags: ['core'] },
  { itemNumber: '11.12', description: 'Are industry benchmarks used as performance context?', pillarNumber: 11, tier: 3, toggleTags: ['core'] },
  { itemNumber: '11.13', description: 'Is there a documented attribution model?', pillarNumber: 11, tier: 3, toggleTags: ['core'] },
  // PILLAR 12
  { itemNumber: '12.1', description: 'Can the marketing team run all weekly/monthly/quarterly meetings independently?', pillarNumber: 12, tier: 4, toggleTags: ['core'] },
  { itemNumber: '12.2', description: 'Is there a documented process for onboarding new marketing team members?', pillarNumber: 12, tier: 3, toggleTags: ['core'] },
  { itemNumber: '12.3', description: "Is institutional knowledge documented (not just in people's heads)?", pillarNumber: 12, tier: 3, toggleTags: ['core'] },
  { itemNumber: '12.4', description: "Is there internal marketing communication about the department's value?", pillarNumber: 12, tier: 3, toggleTags: ['core'] },
  { itemNumber: '12.5', description: "Are other departments aware of marketing's goals, wins, and process?", pillarNumber: 12, tier: 3, toggleTags: ['core'] },
  { itemNumber: '12.6', description: 'Can the marketing leader independently present to the CEO on performance?', pillarNumber: 12, tier: 4, toggleTags: ['core'] },
  { itemNumber: '12.7', description: 'Is there an annual self-assessment process the team can run without external help?', pillarNumber: 12, tier: 4, toggleTags: ['core'] },
  { itemNumber: '12.8', description: 'Does the department have an innovation/experimentation pipeline?', pillarNumber: 12, tier: 4, toggleTags: ['core'] },
  { itemNumber: '12.9', description: "Is the marketing department's value understood and supported by the broader organization?", pillarNumber: 12, tier: 4, toggleTags: ['core'] },
  { itemNumber: '12.10', description: 'Can the department operate fully without Marchitect?', pillarNumber: 12, tier: 4, toggleTags: ['core'] },
]

export async function POST() {
  try {
    // Check idempotency
    const existing = await db.select().from(pillars).limit(1)
    if (existing.length > 0) {
      return Response.json({ success: true, message: 'Already seeded' })
    }

    // Insert pillars
    const insertedPillars = await db
      .insert(pillars)
      .values(PILLARS_DATA)
      .returning()

    // Build pillarNumber -> id map
    const pillarMap = new Map<number, string>()
    for (const p of insertedPillars) {
      pillarMap.set(p.pillarNumber, p.id)
    }

    // Insert audit items
    const itemsToInsert = AUDIT_ITEMS_DATA.map((item) => {
      const pillarId = pillarMap.get(item.pillarNumber)
      if (!pillarId) throw new Error(`No pillar found for pillarNumber ${item.pillarNumber}`)
      return {
        itemNumber: item.itemNumber,
        description: item.description,
        pillarId,
        tier: item.tier,
        toggleTags: item.toggleTags,
        definitionOfDone: null,
      }
    })

    await db.insert(auditItems).values(itemsToInsert)

    return Response.json({
      success: true,
      message: `Seeded ${insertedPillars.length} pillars and ${itemsToInsert.length} items`,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    const cause = (e as Record<string, unknown>)?.cause ?? null
    return Response.json({ success: false, message, cause }, { status: 500 })
  }
}
