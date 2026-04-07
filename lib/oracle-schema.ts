export interface OracleField {
  id: string
  label: string
  description: string
  type: 'text' | 'textarea' | 'url'
}

export interface OracleCategory {
  id: string
  label: string
  icon: string
  fields: OracleField[]
}

export const ORACLE_CATEGORIES: OracleCategory[] = [
  {
    id: 'company_identity',
    label: 'Company Identity',
    icon: 'Building2',
    fields: [
      { id: 'company_name', label: 'Company Name', description: 'The primary trading name of the business', type: 'text' },
      { id: 'legal_entity_name', label: 'Legal Entity Name', description: 'Registered legal name if different from trading name', type: 'text' },
      { id: 'website_url', label: 'Website URL', description: 'Primary website', type: 'url' },
      { id: 'industry', label: 'Industry / Vertical', description: 'The industry or market the business operates in', type: 'text' },
      { id: 'revenue_range', label: 'Revenue Range', description: 'Approximate annual revenue range', type: 'text' },
      { id: 'year_founded', label: 'Year Founded', description: 'Year the business was established', type: 'text' },
      { id: 'geographic_markets', label: 'Geographic Markets Served', description: 'Countries, regions, or cities the business serves', type: 'textarea' },
    ],
  },
  {
    id: 'brand_positioning',
    label: 'Brand & Positioning',
    icon: 'Sparkles',
    fields: [
      { id: 'positioning_statement', label: 'Positioning Statement', description: 'One-sentence statement of how the brand is positioned in the market', type: 'textarea' },
      { id: 'mission_statement', label: 'Mission Statement', description: "The company's purpose beyond making money", type: 'textarea' },
      { id: 'origin_story', label: 'Origin Story', description: 'Why the company was founded and what problem it set out to solve', type: 'textarea' },
      { id: 'diagnostic_trust_statement', label: 'Diagnostic Trust Statement', description: 'Statement that builds trust by demonstrating deep understanding of the customer problem', type: 'textarea' },
      { id: 'identity_statement', label: 'Identity Statement', description: 'How the brand defines itself', type: 'textarea' },
      { id: 'credibility_statement', label: 'Credibility Statement', description: 'Why the company is qualified to solve this problem', type: 'textarea' },
      { id: 'market_explanation', label: 'Concise Market Explanation', description: "Clear explanation of what the company does for someone unfamiliar with the space", type: 'textarea' },
      { id: 'onliness_statement', label: 'Onliness Statement', description: 'What makes this company the only one that does what it does, the way it does it', type: 'textarea' },
      { id: 'enemy_definition', label: 'Enemy Definition', description: 'The problem, belief, or competitor the brand stands against', type: 'text' },
      { id: 'not_for_statement', label: '"Who We Are NOT For" Statement', description: 'Explicit statement of who the company does not serve', type: 'textarea' },
    ],
  },
  {
    id: 'customer_avatars',
    label: 'Customer Avatars',
    icon: 'Users',
    fields: [
      { id: 'primary_avatar_name', label: 'Primary Avatar Name', description: 'Name for the primary customer persona', type: 'text' },
      { id: 'primary_avatar_demographics', label: 'Primary Avatar Demographics', description: 'Age range, gender, geography, income, job title/role', type: 'textarea' },
      { id: 'primary_avatar_psychographics', label: 'Primary Avatar Psychographics', description: 'Values, fears, aspirations, objections', type: 'textarea' },
      { id: 'primary_avatar_pain_points', label: 'Primary Avatar Pain Points', description: 'Top problems and frustrations', type: 'textarea' },
      { id: 'primary_avatar_goals', label: 'Primary Avatar Goals', description: 'Desired outcomes and what success looks like for them', type: 'textarea' },
      { id: 'primary_avatar_awareness_level', label: 'Primary Avatar Awareness Level', description: 'Unaware / Problem-aware / Solution-aware / Product-aware', type: 'text' },
      { id: 'secondary_avatar_name', label: 'Secondary Avatar Name', description: 'Name for the secondary customer persona (if applicable)', type: 'text' },
      { id: 'secondary_avatar_summary', label: 'Secondary Avatar Summary', description: 'Brief description of the secondary persona', type: 'textarea' },
    ],
  },
  {
    id: 'offer_architecture',
    label: 'Offer Architecture',
    icon: 'Layers',
    fields: [
      { id: 'front_end_offer', label: 'Front-End Offer', description: 'Description, purpose, target avatar, and CTA for the entry-point offer', type: 'textarea' },
      { id: 'core_offer', label: 'Core Offer', description: 'Description, pricing, and delivery model for the primary offer', type: 'textarea' },
      { id: 'backend_offers', label: 'Back-End / Upsell Offers', description: 'Description, trigger, and pricing for upsell/back-end offers', type: 'textarea' },
      { id: 'offer_ladder_summary', label: 'Offer Ladder Summary', description: 'Overview of the full value ladder from entry to high-ticket', type: 'textarea' },
    ],
  },
  {
    id: 'competitive_landscape',
    label: 'Competitive Landscape',
    icon: 'Target',
    fields: [
      { id: 'primary_competitors', label: 'Primary Competitors', description: 'Names, websites, and positioning of main competitors', type: 'textarea' },
      { id: 'competitor_strengths', label: 'Competitor Strengths', description: 'What competitors do well that we need to be aware of', type: 'textarea' },
      { id: 'competitor_weaknesses', label: 'Competitor Weaknesses', description: 'Where competitors fall short — our opportunities', type: 'textarea' },
      { id: 'white_space_analysis', label: 'White Space Analysis', description: 'Underserved opportunities in the market not addressed by competitors', type: 'textarea' },
      { id: 'key_differentiators', label: 'Key Differentiators vs. Competitors', description: 'How this company wins against the competition', type: 'textarea' },
    ],
  },
  {
    id: 'channel_strategy',
    label: 'Channel Strategy',
    icon: 'Radio',
    fields: [
      { id: 'active_channels', label: 'Active Channels', description: 'Current marketing channels in use with strategy summary for each', type: 'textarea' },
      { id: 'channel_budget_allocation', label: 'Channel Budget Allocation', description: 'How marketing budget is distributed across channels', type: 'textarea' },
      { id: 'inactive_channels', label: 'Evaluated but Inactive Channels', description: 'Channels considered but not currently used, with rationale', type: 'textarea' },
      { id: 'channel_benchmarks', label: 'Channel Benchmarks', description: 'Performance benchmarks and targets for each active channel', type: 'textarea' },
    ],
  },
]
