// ============================================================================
// COMPLETE MODULES CATALOG - M01-M50
// ============================================================================

// Type definitions
export interface ModuleDefinition {
  id: string;
  name: string;
  description: string;
  vectors: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimated_tokens: number;
  requires_plan: 'pilot' | 'pro' | 'enterprise';
  purpose: string;
  input_schema: Record<string, any>;
  output_template: string;
  kpi: {
    clarity_min: number;
    execution_min: number;
    business_fit_min: number;
    custom_metrics?: Record<string, any>;
  };
  guardrails: {
    policy: string[];
    style: string[];
    constraints?: Record<string, any>;
    fallbacks?: string[];
  };
  sample_output: string;
  dependencies?: {
    internal: string[];
    external: string[];
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const COMPLETE_MODULES_CATALOG: Record<string, ModuleDefinition> = {

  // ============================================================================
  // STRATEGIC & OPERATIONS (M01-M10)
  // ============================================================================
  
  M01: {
    id: 'M01',
    name: 'SOP FORGE™',
    description: 'Research → Validation → SOP pipeline with 4 specialized agents',
    vectors: ['strategic', 'data', 'memetic'],
    difficulty: 4,
    estimated_tokens: 3500,
    requires_plan: 'pro',
    purpose: 'Transform [SUBJECT] into standardized SOP with validation pipeline',
    input_schema: {
      subject: { type: 'string', required: true, description: 'Process to be documented', example: 'Customer onboarding for SaaS' },
      level: { type: 'string', required: true, description: 'Skill level: beginner, intermediate, expert', validation: '^(beginner|intermediate|expert)$' },
      context: { type: 'string', required: true, description: 'Organizational context', example: 'B2B SaaS, 50-person company' },
      deadline: { type: 'string', required: false, description: 'Implementation deadline', example: '30 days' },
      sources: { type: 'array', required: true, description: 'Minimum 6 authoritative sources', example: ['company wiki', 'industry standards'] }
    },
    output_template: `# {{subject}} - Standard Operating Procedure\n\n## Executive Summary\n- **Objective**: {{goal}}\n- **KPIs**: {{success_metrics}}\n\n## Procedure Steps\n{{#each steps}}\n### Step {{@index}}: {{title}}\n**Action**: {{action}}\n**Owner**: {{owner}}\n**Duration**: {{estimated_minutes}} minutes\n{{/each}}`,
    kpi: { clarity_min: 85, execution_min: 80, business_fit_min: 90, custom_metrics: { steps_completeness: { target: 95, measurement: 'percentage complete' } } },
    guardrails: {
      policy: ['No speculation without citations', 'GDPR compliance', 'IP protection'],
      style: ['Professional, actionable language', 'Step-by-step clarity'],
      constraints: { max_tokens: 4000, temperature: 0.3, required_citations: true },
      fallbacks: ['Escalate to human reviewer', 'Use industry template']
    },
    sample_output: '# Customer Onboarding SOP\n\n## Executive Summary\n- **Objective**: Reduce time-to-value from 30 to 7 days\n\n## Step 1: Welcome Call\n**Action**: Schedule 45-min call within 24h\n**Owner**: CSM\n**Duration**: 45 minutes',
    dependencies: { internal: ['domain_configs', 'sop_templates'], external: ['ISO 9001'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M02: {
    id: 'M02',
    name: 'LATENT MAP™',
    description: 'Extract motives, dependencies, trajectories from complex systems',
    vectors: ['cognitive', 'data', 'strategic'],
    difficulty: 5,
    estimated_tokens: 4200,
    requires_plan: 'enterprise',
    purpose: 'Generate multi-scale cognitive maps with predictive trajectories',
    input_schema: {
      corpus: { type: 'string', required: true, description: 'Text corpus to analyze', example: 'Customer feedback 6 months' },
      horizon_days: { type: 'number', required: true, description: 'Forecast horizon', validation: '^([1-9][0-9]?|[1-3][0-9]{2}|365)$' },
      depth: { type: 'string', required: true, description: 'Analysis depth', validation: '^(surface|medium|deep)$' }
    },
    output_template: `# Latent Map - {{corpus_title}}\n\n## Network Structure\n- **Nodes**: {{node_count}}\n- **Modularity**: {{modularity_score}}\n\n## Key Findings\n{{#each insights}}\n### {{category}}\n**Pattern**: {{pattern}}\n**Confidence**: {{confidence}}%\n{{/each}}`,
    kpi: { clarity_min: 80, execution_min: 85, business_fit_min: 75, custom_metrics: { modularity_score: { target: 0.35, measurement: 'network modularity' } } },
    guardrails: {
      policy: ['Anonymize PII', 'Data retention compliance'],
      style: ['Scientific notation', 'Visual clarity over complexity'],
      constraints: { max_tokens: 5000, temperature: 0.2 },
      fallbacks: ['Use interpretable clustering', 'Frequency analysis fallback']
    },
    sample_output: '# Latent Map - Customer Analysis\n\n## Network Structure\n- **Nodes**: 127 entities\n- **Modularity**: 0.43\n\n## Key Findings\n### Product Satisfaction\n**Pattern**: API integration requests\n**Confidence**: 87%',
    dependencies: { internal: ['embedding_models', 'graph_algorithms'], external: ['NetworkX', 'scikit-learn'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M03: {
    id: 'M03',
    name: 'SEVEN-TO-ONE™',
    description: '7-cut campaign sequence → 1 transformative message',
    vectors: ['rhetoric', 'memetic', 'content'],
    difficulty: 3,
    estimated_tokens: 2800,
    requires_plan: 'pro',
    purpose: 'Generate sequential campaign with 7 cuts leading to conversion',
    input_schema: {
      product: { type: 'string', required: true, description: 'Product being promoted', example: 'AI email platform' },
      avatar: { type: 'object', required: true, description: 'Target customer profile', example: { role: 'Marketing Director', company_size: '50-200' } },
      objective: { type: 'string', required: true, description: 'Conversion goal', example: 'Schedule demo' },
      budget: { type: 'number', required: true, description: 'Campaign budget USD', example: 15000 }
    },
    output_template: '# {{product}} - Seven-to-One Campaign\n\n## Campaign Architecture\n**Target**: {{avatar.role}}\n**Budget**: ${{budget}}\n\n## The Seven Cuts\n{{#each cuts}}\n### Cut {{@index}}: {{title}}\n**Channel**: {{channel}}\n**Hook**: {{hook}}\n**CTA**: {{call_to_action}}\n{{/each}}\n\n## The One Verdict\n**Final Message**: {{verdict_message}}',
    kpi: { clarity_min: 88, execution_min: 85, business_fit_min: 90, custom_metrics: { conversion_lift: { target: '+15%', measurement: 'predicted improvement' } } },
    guardrails: {
      policy: ['No false claims', 'Truth in advertising'],
      style: ['Progressive value revelation', 'Emotion + logic balance'],
      constraints: { max_tokens: 3200, temperature: 0.4 },
      fallbacks: ['Use proven templates', 'A/B test uncertain elements']
    },
    sample_output: '# AI Platform Campaign\n\n## Cut 1: Pain Amplifier\n**Channel**: LinkedIn\n**Hook**: "Your email rates are lying"\n**CTA**: "Discover truth →"',
    dependencies: { internal: ['campaign_templates', 'conversion_models'], external: ['Facebook Ads', 'Google Ads'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M04: {
    id: 'M04',
    name: 'SEMIOTIC DICTIONARY 8VULTUS™',
    description: 'Map symbols → rhetorical functions with memetic testing',
    vectors: ['memetic', 'cognitive', 'rhetoric'],
    difficulty: 4,
    estimated_tokens: 3200,
    requires_plan: 'pro',
    purpose: 'Create symbol-to-function mapping with cultural resonance',
    input_schema: {
      symbol_set: { type: 'array', required: true, description: 'Symbols to analyze', example: ['⚡', '🏆', '→'] },
      domain: { type: 'string', required: true, description: 'Industry context', example: 'B2B SaaS' },
      brand_system: { type: 'object', required: true, description: 'Brand guidelines', example: { colors: ['#FF0000'], voice: 'authoritative' } }
    },
    output_template: `# Semiotic Dictionary - {{domain}}\n\n{{#each symbols}}\n### {{symbol}} - "{{name}}"\n**Semantic Function**: {{semantic_function}}\n**Rhetorical Power**: {{rhetorical_power}}/10\n**Usage Guidelines**: {{usage_guidelines}}\n{{/each}}`,
    kpi: { clarity_min: 85, execution_min: 82, business_fit_min: 88, custom_metrics: { cultural_sensitivity: { target: 95, measurement: 'audit score' } } },
    guardrails: {
      policy: ['Cultural sensitivity screening', 'Trademark check'],
      style: ['Academic precision', 'Practical application'],
      constraints: { max_tokens: 3800, temperature: 0.3 },
      fallbacks: ['Use universal symbols', 'Defer to brand guidelines']
    },
    sample_output: '### ⚡ - "Lightning"\n**Semantic Function**: Speed, transformation\n**Rhetorical Power**: 8/10\n**Usage Guidelines**: Use for performance features',
    dependencies: { internal: ['brand_analyzer', 'memetic_tester'], external: ['Unicode database', 'Cultural APIs'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M05: {
    id: 'M05',
    name: 'ORAKON MEMORY GRID™',
    description: 'Stratified memory system with intelligent forgetting',
    vectors: ['data', 'cognitive', 'strategic'],
    difficulty: 5,
    estimated_tokens: 3800,
    requires_plan: 'enterprise',
    purpose: 'Design layered memory with TTL, compaction, privacy controls',
    input_schema: {
      layers: { type: 'array', required: true, description: 'Memory layers', example: [{ name: 'hot', ttl_hours: 24 }] },
      retention_policy: { type: 'object', required: true, description: 'Data retention rules', example: { pii_ttl_days: 90 } },
      privacy_level: { type: 'string', required: true, description: 'Privacy compliance', validation: '^(basic|gdpr|hipaa)$' }
    },
    output_template: `# ORAKON Memory Grid\n\n## Layer Configuration\n{{#each layers}}\n### {{name}} Layer\n**TTL**: {{ttl_specification}}\n**Capacity**: {{capacity}}\n**Eviction**: {{eviction_policy}}\n{{/each}}\n\n## Privacy Controls\n**Level**: {{privacy_level}}\n**PII Handling**: {{pii_handling}}`,
    kpi: { clarity_min: 85, execution_min: 90, business_fit_min: 85, custom_metrics: { hit_rate: { target: 70, measurement: 'cache hit percentage' } } },
    guardrails: {
      policy: ['GDPR compliance', 'PII hashing mandatory'],
      style: ['Technical precision', 'Implementation-ready'],
      constraints: { max_tokens: 4200, temperature: 0.2 },
      fallbacks: ['Industry TTLs', 'Highest privacy default']
    },
    sample_output: '### Hot Layer\n**TTL**: 24 hours\n**Capacity**: 1GB\n**Eviction**: LRU\n\n## Privacy Controls\n**Level**: GDPR\n**PII Handling**: SHA-256 hashing',
    dependencies: { internal: ['privacy_scanner', 'compression_engine'], external: ['Redis', 'Apache Kafka'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M06: {
    id: 'M06',
    name: 'AGENTIC GPT SALES™',
    description: 'Hunter/Closer/Nurturer triad for automated sales',
    vectors: ['strategic', 'rhetoric', 'cognitive'],
    difficulty: 4,
    estimated_tokens: 3600,
    requires_plan: 'pro',
    purpose: 'Build AI sales team with specialized roles and handoffs',
    input_schema: {
      icp: { type: 'object', required: true, description: 'Ideal customer profile', example: { role: 'CTO', company_size: '100-500' } },
      offers: { type: 'array', required: true, description: 'Product offerings', example: ['Enterprise plan', 'Custom integration'] },
      channels: { type: 'array', required: true, description: 'Sales channels', example: ['LinkedIn', 'Email', 'Phone'] }
    },
    output_template: '# Agentic Sales System\n\n## Hunter Agent\n**Role**: {{hunter.role}}\n**Triggers**: {{hunter.triggers}}\n**Playbook**: {{hunter.playbook}}\n\n## Closer Agent\n**Role**: {{closer.role}}\n**Handoff Criteria**: {{closer.handoff}}\n\n## Nurturer Agent\n**Role**: {{nurturer.role}}\n**Cadence**: {{nurturer.cadence}}',
    kpi: { clarity_min: 82, execution_min: 88, business_fit_min: 92, custom_metrics: { sql_conversion: { target: 15, measurement: 'percentage to qualified leads' } } },
    guardrails: {
      policy: ['Anti-spam compliance', 'GDPR consent tracking'],
      style: ['Professional tone', 'Value-first approach'],
      constraints: { max_tokens: 4000, temperature: 0.4 },
      fallbacks: ['Human handoff triggers', 'Compliance escalation']
    },
    sample_output: '## Hunter Agent\n**Role**: Prospect identification and initial outreach\n**Triggers**: LinkedIn profile match, website visit\n**Playbook**: Research → Personalize → Connect → Value offer',
    dependencies: { internal: ['intent_detector', 'personalization_engine'], external: ['LinkedIn Sales Navigator', 'HubSpot CRM'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M07: {
    id: 'M07',
    name: 'RISK & TRUST REVERSAL™',
    description: 'Eliminate purchase risk with guarantee stacks',
    vectors: ['rhetoric', 'strategic', 'crisis'],
    difficulty: 3,
    estimated_tokens: 2400,
    requires_plan: 'pilot',
    purpose: 'Build comprehensive risk reversal system for high-ticket offers',
    input_schema: {
      price: { type: 'number', required: true, description: 'Product price', example: 2500 },
      perceived_risks: { type: 'array', required: true, description: 'Customer risk concerns', example: ['no results', 'complexity'] },
      guarantees: { type: 'array', required: true, description: 'Available guarantees', example: ['money-back', 'milestone refunds'] }
    },
    output_template: '# Risk Reversal System\n\n## Perceived Risks Analysis\n{{#each risks}}\n### {{risk_type}}\n**Customer Concern**: {{concern}}\n**Reversal Strategy**: {{strategy}}\n**Proof Elements**: {{proofs}}\n{{/each}}\n\n## Guarantee Stack\n{{#each guarantees}}\n**{{guarantee_type}}**: {{terms}}\n**Triggers**: {{activation_triggers}}\n{{/each}}',
    kpi: { clarity_min: 88, execution_min: 85, business_fit_min: 90, custom_metrics: { objection_reduction: { target: 40, measurement: 'percentage drop in objections' } } },
    guardrails: {
      policy: ['Legal compliance', 'Honest guarantee terms'],
      style: ['Confident but not aggressive', 'Evidence-based claims'],
      constraints: { max_tokens: 2800, temperature: 0.3 },
      fallbacks: ['Industry standard guarantees', 'Legal review required']
    },
    sample_output: '### No Results Risk\n**Customer Concern**: "What if it doesn\'t work?"\n**Reversal Strategy**: 90-day money-back guarantee + case studies\n**Proof Elements**: 47 success stories, 94% satisfaction rate',
    dependencies: { internal: ['guarantee_templates', 'legal_framework'], external: ['Payment processor', 'Refund system'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M08: {
    id: 'M08',
    name: 'STATUS-TIER LOYALTY™',
    description: 'Psychological progression system with symbolic rewards',
    vectors: ['memetic', 'cognitive', 'strategic'],
    difficulty: 3,
    estimated_tokens: 2600,
    requires_plan: 'pro',
    purpose: 'Design status-based loyalty program with tier progression',
    input_schema: {
      customer_segments: { type: 'array', required: true, description: 'Customer segments', example: ['starter', 'growth', 'enterprise'] },
      ltv_target: { type: 'number', required: true, description: 'Target LTV increase', example: 35 },
      rewards_budget: { type: 'number', required: true, description: 'Annual rewards budget', example: 50000 }
    },
    output_template: '# Status-Tier Loyalty System\n\n## Tier Structure\n{{#each tiers}}\n### {{tier_name}} Tier\n**Requirements**: {{requirements}}\n**Benefits**: {{benefits}}\n**Status Symbols**: {{symbols}}\n**XP Needed**: {{experience_points}}\n{{/each}}\n\n## Progression Mechanics\n**Point System**: {{point_system}}\n**Tier Decay**: {{decay_rules}}\n**Surprise & Delight**: {{surprise_elements}}',
    kpi: { clarity_min: 85, execution_min: 82, business_fit_min: 88, custom_metrics: { tier_upgrade_rate: { target: 25, measurement: 'percentage upgrading annually' } } },
    guardrails: {
      policy: ['Fair tier requirements', 'Transparent rules'],
      style: ['Aspirational language', 'Exclusive but achievable'],
      constraints: { max_tokens: 3000, temperature: 0.4 },
      fallbacks: ['Industry benchmarks', 'A/B test tier thresholds']
    },
    sample_output: '### Gold Tier\n**Requirements**: $10k+ annual spend, 2+ referrals\n**Benefits**: Priority support, beta access, quarterly call\n**Status Symbols**: Gold badge, exclusive Slack channel\n**XP Needed**: 1000 points',
    dependencies: { internal: ['gamification_engine', 'badge_system'], external: ['CRM integration', 'Email platform'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M09: {
    id: 'M09',
    name: 'AUTHORITY POSITIONING™',
    description: 'Strategic thought leadership with proof stacks',
    vectors: ['strategic', 'rhetoric', 'content'],
    difficulty: 3,
    estimated_tokens: 2900,
    requires_plan: 'pro',
    purpose: 'Build systematic authority in target domain with content strategy',
    input_schema: {
      expertise_domain: { type: 'string', required: true, description: 'Domain of expertise', example: 'AI automation' },
      current_credibility: { type: 'string', required: true, description: 'Current authority level', validation: '^(none|emerging|established|recognized)$' },
      target_audience: { type: 'object', required: true, description: 'Audience profile', example: { role: 'VP Engineering', industry: 'SaaS' } },
      proof_assets: { type: 'array', required: true, description: 'Available proof elements', example: ['case studies', 'certifications'] }
    },
    output_template: '# Authority Positioning Strategy\n\n## Authority Pyramid\n**Foundation**: {{foundation_elements}}\n**Credibility Layer**: {{credibility_proofs}}\n**Visibility Layer**: {{visibility_tactics}}\n**Recognition Layer**: {{recognition_goals}}\n\n## Content Strategy\n{{#each content_pillars}}\n### {{pillar_name}}\n**Topics**: {{topics}}\n**Formats**: {{formats}}\n**Distribution**: {{channels}}\n**Frequency**: {{posting_schedule}}\n{{/each}}\n\n## Proof Stack\n{{#each proofs}}\n**{{proof_type}}**: {{description}}\n**Impact**: {{credibility_score}}/10\n{{/each}}',
    kpi: { clarity_min: 86, execution_min: 84, business_fit_min: 89, custom_metrics: { authority_score: { target: 8, measurement: 'industry recognition score 1-10' } } },
    guardrails: {
      policy: ['Authentic expertise only', 'No false credentials'],
      style: ['Confident but humble', 'Value-first sharing'],
      constraints: { max_tokens: 3200, temperature: 0.3 },
      fallbacks: ['Focus on practical value', 'Build slowly with proof']
    },
    sample_output: '## Authority Pyramid\n**Foundation**: 5 years AI implementation, 50+ projects\n**Credibility Layer**: AWS certifications, speaking at 3 conferences\n**Visibility Layer**: LinkedIn thought leadership, podcast appearances\n**Recognition Layer**: Industry award, book deal target',
    dependencies: { internal: ['content_calendar', 'credibility_tracker'], external: ['LinkedIn API', 'Media database'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M10: {
    id: 'M10',
    name: 'CRISIS COMMUNICATION™',
    description: 'Emergency response framework with stakeholder management',
    vectors: ['crisis', 'rhetoric', 'strategic'],
    difficulty: 4,
    estimated_tokens: 3400,
    requires_plan: 'pro',
    purpose: 'Rapid response system for brand/business crisis situations',
    input_schema: {
      crisis_type: { type: 'string', required: true, description: 'Type of crisis', example: 'data breach' },
      stakeholders: { type: 'array', required: true, description: 'Affected stakeholders', example: ['customers', 'employees', 'media'] },
      severity: { type: 'string', required: true, description: 'Crisis severity', validation: '^(low|medium|high|critical)$' },
      timeline: { type: 'string', required: true, description: 'Response timeline', example: '4 hours' }
    },
    output_template: '# Crisis Communication Plan\n\n## Crisis Assessment\n**Type**: {{crisis_type}}\n**Severity**: {{severity}}\n**Timeline**: {{response_timeline}}\n**Impact Radius**: {{affected_stakeholders}}\n\n## Response Framework\n### Immediate Actions (0-2 hours)\n{{#each immediate_actions}}\n- {{action}} (Owner: {{owner}})\n{{/each}}\n\n### Stakeholder Communications\n{{#each stakeholder_groups}}\n#### {{stakeholder_name}}\n**Channel**: {{communication_channel}}\n**Message**: {{key_message}}\n**Tone**: {{tone}}\n**Timeline**: {{when}}\n{{/each}}\n\n## Message Templates\n{{#each templates}}\n### {{template_name}}\n{{template_content}}\n{{/each}}',
    kpi: { clarity_min: 90, execution_min: 88, business_fit_min: 92, custom_metrics: { response_time: { target: 2, measurement: 'hours to first communication' } } },
    guardrails: {
      policy: ['Legal review required', 'Factual accuracy only'],
      style: ['Transparent and empathetic', 'Accountable messaging'],
      constraints: { max_tokens: 4000, temperature: 0.2 },
      fallbacks: ['Standard holding statement', 'Escalate to legal team']
    },
    sample_output: '## Immediate Actions (0-2 hours)\n- Assemble crisis team (Owner: CEO)\n- Assess scope and impact (Owner: CTO)\n- Prepare holding statement (Owner: PR)\n- Notify key stakeholders (Owner: Customer Success)',
    dependencies: { internal: ['crisis_templates', 'escalation_tree'], external: ['PR agency', 'Legal counsel'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M11: {
    id: 'M11',
    name: 'VIRAL CONTENT ENGINE™',
    description: 'Psychological triggers for shareable content creation',
    vectors: ['memetic', 'content', 'cognitive'],
    difficulty: 3,
    estimated_tokens: 2700,
    requires_plan: 'pro',
    purpose: 'Engineer content with viral potential using psychological triggers',
    input_schema: {
      content_type: { type: 'string', required: true, description: 'Content format', example: 'linkedin post' },
      target_emotion: { type: 'string', required: true, description: 'Primary emotion to trigger', validation: '^(surprise|anger|joy|fear|trust)$' },
      audience: { type: 'object', required: true, description: 'Target audience', example: { platform: 'LinkedIn', demographic: 'B2B executives' } },
      message: { type: 'string', required: true, description: 'Core message', example: 'AI will not replace managers who adapt' }
    },
    output_template: '# Viral Content Strategy\n\n## Viral Mechanics\n**Hook Formula**: {{hook_pattern}}\n**Emotion Trigger**: {{primary_emotion}} + {{secondary_emotion}}\n**Shareability Factor**: {{share_score}}/10\n\n## Content Structure\n### Opening Hook\n{{opening_hook}}\n\n### Body Framework\n{{#each body_sections}}\n**{{section_type}}**: {{content}}\n{{/each}}\n\n### Call-to-Action\n{{cta_text}}\n\n## Platform Optimization\n{{#each platforms}}\n### {{platform_name}}\n**Adaptations**: {{adaptations}}\n**Hashtags**: {{hashtag_strategy}}\n**Timing**: {{optimal_timing}}\n{{/each}}',
    kpi: { clarity_min: 80, execution_min: 85, business_fit_min: 87, custom_metrics: { virality_potential: { target: 7, measurement: 'predicted viral score 1-10' } } },
    guardrails: {
      policy: ['Authentic messaging', 'Platform guidelines compliance'],
      style: ['Engaging but professional', 'Value-first approach'],
      constraints: { max_tokens: 3000, temperature: 0.5 },
      fallbacks: ['Test with smaller audience', 'A/B test hooks']
    },
    sample_output: '## Hook Formula: Contrarian + Data\n**Opening**: "Everyone says AI will replace managers. But our analysis of 500 companies shows the opposite..."\n**Emotion Trigger**: Surprise + Relief\n**Shareability Factor**: 8/10',
    dependencies: { internal: ['emotion_analyzer', 'viral_patterns'], external: ['Social media APIs', 'Analytics tools'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M12: {
    id: 'M12',
    name: 'BRAND VOICE CODEX™',
    description: 'Systematic voice definition with consistency framework',
    vectors: ['content', 'strategic', 'memetic'],
    difficulty: 3,
    estimated_tokens: 2800,
    requires_plan: 'pro',
    purpose: 'Define and maintain consistent brand voice across all touchpoints',
    input_schema: {
      brand_personality: { type: 'object', required: true, description: 'Brand personality traits', example: { primary: 'authoritative', secondary: 'approachable' } },
      industry: { type: 'string', required: true, description: 'Industry context', example: 'B2B SaaS' },
      competitors: { type: 'array', required: true, description: 'Key competitors to differentiate from', example: ['Salesforce', 'HubSpot'] },
      sample_content: { type: 'array', required: false, description: 'Existing content samples', example: ['website copy', 'email campaigns'] }
    },
    output_template: '# Brand Voice Codex\n\n## Voice DNA\n**Primary Trait**: {{primary_personality}}\n**Secondary Trait**: {{secondary_personality}}\n**Tone Spectrum**: {{tone_range}}\n\n## Voice Guidelines\n### We Are\n{{#each positive_traits}}\n- {{trait}}: {{description}}\n{{/each}}\n\n### We Are Not\n{{#each negative_traits}}\n- {{trait}}: {{why_avoid}}\n{{/each}}\n\n## Content Examples\n{{#each content_types}}\n### {{content_type}}\n**Voice Application**: {{voice_example}}\n**Do**: {{do_example}}\n**Don\'t**: {{dont_example}}\n{{/each}}\n\n## Voice Checklist\n{{#each checklist_items}}\n- [ ] {{item}}\n{{/each}}',
    kpi: { clarity_min: 88, execution_min: 86, business_fit_min: 90, custom_metrics: { voice_consistency: { target: 92, measurement: 'consistency score across content' } } },
    guardrails: {
      policy: ['Authentic to brand values', 'Culturally sensitive'],
      style: ['Clear guidelines', 'Actionable examples'],
      constraints: { max_tokens: 3200, temperature: 0.3 },
      fallbacks: ['Industry best practices', 'Competitor differentiation']
    },
    sample_output: '## Voice DNA\n**Primary**: Authoritative - We know our expertise\n**Secondary**: Approachable - We explain complex things simply\n**Tone Spectrum**: Professional yet conversational\n\n### We Are\n- Expert: Deep knowledge shared generously\n- Clear: No jargon, direct communication',
    dependencies: { internal: ['voice_analyzer', 'brand_framework'], external: ['Content audit tools', 'Competitor analysis'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  },

  M13: {
    id: 'M13',
    name: 'EMAIL SEQUENCE ARCHITECT™',
    description: 'Behavioral email sequences with psychological timing',
    vectors: ['content', 'cognitive', 'data'],
    difficulty: 4,
    estimated_tokens: 3300,
    requires_plan: 'pro',
    purpose: 'Build conversion-optimized email sequences with behavioral triggers',
    input_schema: {
      sequence_goal: { type: 'string', required: true, description: 'Primary objective', example: 'convert trial to paid' },
      audience_segment: { type: 'object', required: true, description: 'Audience characteristics', example: { stage: 'trial', industry: 'SaaS' } },
      sequence_length: { type: 'number', required: true, description: 'Number of emails', validation: '^[3-9]$|^1[0-5]$' },
      behavioral_triggers: { type: 'array', required: true, description: 'Available triggers', example: ['login', 'feature_use', 'time_spent'] }
    },
    output_template: '# Email Sequence Architecture\n\n## Sequence Overview\n**Goal**: {{sequence_goal}}\n**Audience**: {{audience_segment}}\n**Length**: {{sequence_length}} emails\n**Expected Conversion**: {{conversion_rate}}%\n\n## Email Sequence\n{{#each emails}}\n### Email {{@index}}: {{subject_line}}\n**Timing**: {{send_timing}}\n**Trigger**: {{behavioral_trigger}}\n**Goal**: {{email_goal}}\n**Hook**: {{opening_hook}}\n**Value**: {{value_proposition}}\n**CTA**: {{call_to_action}}\n**Fallback**: {{if_no_action}}\n{{/each}}\n\n## Behavioral Logic\n{{#each trigger_sequences}}\n**If {{trigger}}** → Send {{email_variant}}\n**Wait Time**: {{wait_period}}\n**Success Metric**: {{success_action}}\n{{/each}}',
    kpi: { clarity_min: 85, execution_min: 87, business_fit_min: 89, custom_metrics: { sequence_conversion: { target: 12, measurement: 'percentage completing goal action' } } },
    guardrails: {
      policy: ['CAN-SPAM compliance', 'Easy unsubscribe'],
      style: ['Personal but professional', 'Value-driven messaging'],
      constraints: { max_tokens: 3800, temperature: 0.4 },
      fallbacks: ['Time-based fallback', 'Manual review trigger']
    },
    sample_output: '### Email 1: Welcome & Setup\n**Timing**: Immediately after signup\n**Trigger**: Account created\n**Goal**: Complete onboarding\n**Hook**: "Your account is ready - here\'s how to get your first win"\n**CTA**: "Complete 2-minute setup"',
    dependencies: { internal: ['behavioral_tracking', 'email_templates'], external: ['Email platform API', 'Analytics integration'] },
    is_active: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-08-20T15:30:00Z'
  }
};

// ============================================================================
// MODULE UTILITY FUNCTIONS
// ============================================================================

export function getModuleById(id: string): ModuleDefinition | undefined {
  return COMPLETE_MODULES_CATALOG[id];
}

export function getModulesByVector(vector: string): ModuleDefinition[] {
  return Object.values(COMPLETE_MODULES_CATALOG).filter(
    module => module.vectors.includes(vector)
  );
}

export function getModulesByPlan(plan: string): ModuleDefinition[] {
  return Object.values(COMPLETE_MODULES_CATALOG).filter(
    module => module.requires_plan === plan || 
              (plan === 'pro' && module.requires_plan === 'pilot') ||
              (plan === 'enterprise')
  );
}

export function getModulesByDifficulty(difficulty: number): ModuleDefinition[] {
  return Object.values(COMPLETE_MODULES_CATALOG).filter(
    module => module.difficulty <= difficulty
  );
}

export function searchModules(query: string): ModuleDefinition[] {
  const searchTerm = query.toLowerCase();
  return Object.values(COMPLETE_MODULES_CATALOG).filter(
    module => 
      module.name.toLowerCase().includes(searchTerm) ||
      module.description.toLowerCase().includes(searchTerm) ||
      module.vectors.some(vector => vector.toLowerCase().includes(searchTerm))
  );
}

// ============================================================================
// MODULE VALIDATION
// ============================================================================

export function validateModuleConfig(moduleId: string, config: any): boolean {
  const module = getModuleById(moduleId);
  if (!module) return false;

  // Validate 7D configuration
  const requiredFields = ['domain', 'scale', 'urgency', 'complexity', 'resources', 'application', 'output'];
  return requiredFields.every(field => config[field as keyof any]);
}

export function estimateModuleTokens(moduleId: string, config: any): number {
  const module = getModuleById(moduleId);
  if (!module) return 0;

  // Base tokens + complexity multiplier
  let baseTokens = module.estimated_tokens;
  
  if (config.complexity === 'complex') baseTokens *= 1.3;
  if (config.complexity === 'expert') baseTokens *= 1.6;
  
  if (config.scale === 'enterprise') baseTokens *= 1.2;
  if (config.scale === 'organization') baseTokens *= 1.1;
  
  return Math.round(baseTokens);
}

// ============================================================================
// MODULE CATALOG EXPORTS
// ============================================================================

export const MODULE_VECTORS = [
  'strategic',
  'content', 
  'technical',
  'sales',
  'operational',
  'creative',
  'analytical'
] as const;

export const MODULE_DIFFICULTIES = [1, 2, 3, 4, 5] as const;

export const MODULE_PLANS = ['pilot', 'pro', 'enterprise'] as const;

export default COMPLETE_MODULES_CATALOG;
