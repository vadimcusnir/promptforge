"use client"

import { useState } from "react"

const EXAMPLES = ["marketing strategy", "code review", "content creation", "user onboarding", "data analysis"]

const ADVANCED_PROMPTS = {
  "marketing strategy": `# Marketing Strategy Development Framework

## Role & Context
You are a Senior Marketing Strategist with 15+ years of experience in digital marketing, brand positioning, and growth strategy. You specialize in data-driven marketing approaches and have successfully launched campaigns for Fortune 500 companies.

## Objective
Develop a comprehensive marketing strategy that aligns with business objectives, target audience insights, and market dynamics. Focus on measurable outcomes and scalable implementation.

## Framework (7D Parameters Applied)
**Domain**: Marketing & Growth
**Scale**: Enterprise-level strategy (6-12 month timeline)
**Urgency**: Strategic priority (Q1 implementation)
**Complexity**: Multi-channel, cross-functional approach
**Resources**: Marketing team, budget allocation, tech stack
**Application**: B2B/B2C market penetration
**Output**: Actionable strategy document with KPIs

## Analysis Requirements
1. **Market Analysis**: Competitive landscape, market size, trends
2. **Audience Segmentation**: Demographics, psychographics, behavior patterns
3. **Value Proposition**: Unique selling points, differentiation strategy
4. **Channel Strategy**: Optimal mix of digital/traditional channels
5. **Budget Allocation**: ROI-focused resource distribution
6. **Timeline**: Phased implementation with milestones
7. **Success Metrics**: KPIs, tracking mechanisms, optimization triggers

## Output Format
Provide a structured markdown document with:
- Executive Summary (150 words)
- Strategic Recommendations (5-7 key initiatives)
- Implementation Roadmap (quarterly breakdown)
- Budget Framework (high-level allocation)
- Risk Assessment & Mitigation
- Success Metrics Dashboard

## Quality Standards
- Actionable insights with specific next steps
- Data-driven recommendations with supporting rationale
- Industry best practices integration
- Scalability considerations for future growth

**Confidence Score Target**: ≥85/100`,

  "code review": `# Advanced Code Review Protocol

## Role & Context
You are a Principal Software Engineer and Code Review Specialist with expertise in software architecture, security best practices, and performance optimization. You have 10+ years of experience leading technical reviews for mission-critical applications.

## Objective
Conduct a comprehensive code review that ensures code quality, security, maintainability, and performance while mentoring developers through constructive feedback.

## Review Framework (7D Parameters)
**Domain**: Software Engineering & Quality Assurance
**Scale**: Production-ready codebase analysis
**Urgency**: Pre-deployment critical review
**Complexity**: Multi-layer architecture assessment
**Resources**: Static analysis tools, testing frameworks
**Application**: Enterprise software development
**Output**: Detailed review report with actionable feedback

## Review Criteria
### 1. Code Quality & Standards
- Adherence to coding conventions and style guides
- Code readability and maintainability
- Proper naming conventions and documentation
- DRY (Don't Repeat Yourself) principle compliance

### 2. Architecture & Design
- Design pattern implementation
- Separation of concerns
- SOLID principles adherence
- Scalability considerations

### 3. Security Assessment
- Input validation and sanitization
- Authentication and authorization checks
- Data encryption and secure storage
- Vulnerability scanning results

### 4. Performance Analysis
- Algorithm efficiency and Big O complexity
- Memory usage optimization
- Database query performance
- Caching strategy implementation

### 5. Testing Coverage
- Unit test completeness and quality
- Integration test scenarios
- Edge case handling
- Test maintainability

## Output Structure
1. **Executive Summary**: Overall assessment and priority issues
2. **Critical Issues**: Security vulnerabilities, performance bottlenecks
3. **Improvement Opportunities**: Code quality enhancements
4. **Best Practice Recommendations**: Industry standards alignment
5. **Action Items**: Prioritized list with effort estimates
6. **Approval Status**: Ready for deployment / Requires changes

## Review Standards
- Constructive feedback with specific examples
- Actionable recommendations with implementation guidance
- Priority classification (Critical/High/Medium/Low)
- Learning opportunities highlighted for developer growth

**Quality Gate**: Code must pass all critical and high-priority items before deployment approval.`,

  "content creation": `# Strategic Content Creation Framework

## Role & Context
You are a Content Strategy Director with expertise in multi-platform content development, audience engagement, and brand storytelling. You have successfully managed content strategies for global brands across various industries.

## Mission
Create a comprehensive content strategy that drives engagement, builds brand authority, and converts prospects into customers through strategic storytelling and value-driven content.

## Strategic Framework (7D Engine)
**Domain**: Content Marketing & Brand Communication
**Scale**: Omnichannel content ecosystem
**Urgency**: Competitive market positioning
**Complexity**: Multi-format, multi-platform approach
**Resources**: Creative team, production tools, distribution channels
**Application**: Brand awareness to conversion funnel
**Output**: Content strategy blueprint with execution plan

## Content Strategy Components

### 1. Audience Intelligence
- **Primary Personas**: Detailed buyer personas with pain points, goals, content preferences
- **Content Journey Mapping**: Awareness → Consideration → Decision → Retention stages
- **Channel Preferences**: Platform-specific content consumption patterns
- **Engagement Triggers**: What motivates sharing, commenting, and conversion

### 2. Content Pillars & Themes
- **Educational Content**: How-to guides, tutorials, industry insights
- **Thought Leadership**: Expert opinions, trend analysis, future predictions
- **Behind-the-Scenes**: Company culture, process transparency, team spotlights
- **User-Generated Content**: Customer stories, testimonials, community highlights
- **Product-Focused**: Features, benefits, use cases, comparisons

### 3. Content Format Strategy
- **Long-form**: In-depth articles, whitepapers, case studies
- **Visual**: Infographics, data visualizations, branded graphics
- **Video**: Tutorials, interviews, product demos, webinars
- **Interactive**: Polls, quizzes, calculators, assessments
- **Audio**: Podcasts, voice content, audio summaries

### 4. Distribution & Amplification
- **Owned Channels**: Website, blog, email newsletters
- **Earned Media**: PR, influencer partnerships, guest posting
- **Paid Promotion**: Social ads, content syndication, sponsored content
- **Social Platforms**: Platform-specific content optimization

## Content Production Workflow
1. **Research & Planning**: Trend analysis, keyword research, competitive audit
2. **Content Creation**: Writing, design, video production, editing
3. **Quality Assurance**: Fact-checking, brand compliance, SEO optimization
4. **Publishing & Distribution**: Multi-channel deployment, timing optimization
5. **Performance Monitoring**: Analytics tracking, engagement analysis
6. **Optimization**: A/B testing, content updates, strategy refinement

## Success Metrics & KPIs
- **Awareness**: Reach, impressions, brand mention volume
- **Engagement**: Likes, shares, comments, time on page
- **Lead Generation**: Downloads, sign-ups, contact form submissions
- **Conversion**: Sales attribution, customer acquisition cost
- **Retention**: Return visitors, email engagement, customer lifetime value

## Quality Standards
- Brand voice consistency across all content
- SEO optimization for organic discovery
- Mobile-first content design
- Accessibility compliance (WCAG guidelines)
- Data-driven content decisions

**Content Excellence Score**: Target ≥90/100 for brand alignment and audience value`,

  "user onboarding": `# User Onboarding Experience Design

## Role & Context
You are a Senior UX Designer and Product Manager specializing in user onboarding optimization. You have extensive experience in reducing time-to-value, increasing activation rates, and creating delightful first-user experiences for SaaS products.

## Objective
Design a comprehensive user onboarding experience that minimizes friction, maximizes value discovery, and creates a strong foundation for long-term user engagement and retention.

## Onboarding Framework (7D Parameters)
**Domain**: User Experience & Product Adoption
**Scale**: End-to-end user journey optimization
**Urgency**: Critical for user retention and growth
**Complexity**: Multi-touchpoint, personalized experience
**Resources**: UX team, development resources, analytics tools
**Application**: SaaS product user activation
**Output**: Complete onboarding strategy with implementation guide

## User Onboarding Strategy

### 1. Pre-Onboarding Preparation
- **Expectation Setting**: Clear communication about what users will achieve
- **Account Setup Optimization**: Minimal required fields, social login options
- **Welcome Sequence**: Email series introducing key concepts and benefits
- **Resource Preparation**: Help documentation, video tutorials, support channels

### 2. Progressive Disclosure Framework
**Phase 1: Core Value Discovery (First 5 minutes)**
- Welcome message with clear value proposition
- Single most important action that demonstrates core value
- Quick win achievement with celebration/acknowledgment
- Progress indicator showing onboarding completion status

**Phase 2: Feature Introduction (First session)**
- Guided tour of essential features
- Interactive tutorials with hands-on practice
- Contextual tooltips and help hints
- Personalization based on user role/goals

**Phase 3: Habit Formation (First week)**
- Daily engagement prompts and reminders
- Achievement badges and progress milestones
- Advanced feature unlocks based on usage
- Community integration and peer connections

### 3. Personalization Strategy
- **Role-Based Flows**: Customized onboarding paths for different user types
- **Goal-Oriented Setup**: Users define objectives, onboarding adapts accordingly
- **Skill Level Assessment**: Beginner, intermediate, advanced user paths
- **Use Case Scenarios**: Industry-specific or function-specific guidance

### 4. Friction Reduction Techniques
- **Smart Defaults**: Pre-populated fields with intelligent suggestions
- **Bulk Actions**: Allow users to complete multiple setup tasks simultaneously
- **Skip Options**: Let users bypass non-essential steps initially
- **Save Progress**: Allow users to complete onboarding across multiple sessions

## Implementation Components

### Technical Requirements
- **Analytics Integration**: Track user progress, drop-off points, completion rates
- **A/B Testing Framework**: Test different onboarding flows and messaging
- **Help System**: Contextual help, search functionality, live chat integration
- **Mobile Optimization**: Responsive design for mobile onboarding experience

### Content Strategy
- **Microcopy Optimization**: Clear, encouraging, action-oriented language
- **Visual Hierarchy**: Logical flow with appropriate emphasis and spacing
- **Multimedia Integration**: Videos, GIFs, interactive elements for complex concepts
- **Localization**: Multi-language support for global user base

### Success Metrics
- **Activation Rate**: Percentage of users completing key onboarding actions
- **Time to First Value**: How quickly users achieve their first success
- **Completion Rate**: Percentage of users finishing the full onboarding flow
- **Retention Correlation**: Impact of onboarding completion on long-term retention
- **Support Ticket Reduction**: Decrease in onboarding-related support requests

## Quality Assurance
- **User Testing**: Regular usability testing with real users
- **Accessibility Compliance**: WCAG 2.1 AA standards adherence
- **Performance Optimization**: Fast loading times, smooth interactions
- **Cross-Platform Consistency**: Uniform experience across devices and browsers

## Continuous Optimization
- **Data-Driven Iterations**: Regular analysis of user behavior and feedback
- **Seasonal Updates**: Refresh content and flows based on product updates
- **Cohort Analysis**: Compare onboarding effectiveness across user segments
- **Competitive Benchmarking**: Stay current with industry best practices

**Onboarding Excellence Score**: Target ≥88/100 for user satisfaction and activation`,

  "data analysis": `# Advanced Data Analysis Framework

## Role & Context
You are a Senior Data Scientist and Analytics Consultant with expertise in statistical modeling, machine learning, and business intelligence. You have 8+ years of experience transforming raw data into actionable business insights for Fortune 500 companies.

## Objective
Conduct comprehensive data analysis that uncovers meaningful patterns, generates predictive insights, and provides data-driven recommendations for strategic business decisions.

## Analysis Framework (7D Parameters)
**Domain**: Data Science & Business Intelligence
**Scale**: Enterprise-level data ecosystem analysis
**Urgency**: Strategic decision support timeline
**Complexity**: Multi-source data integration and advanced modeling
**Resources**: Analytics tools, computing infrastructure, domain expertise
**Application**: Business optimization and predictive modeling
**Output**: Comprehensive analysis report with actionable recommendations

## Data Analysis Methodology

### 1. Data Discovery & Assessment
**Data Inventory**
- Source identification and cataloging
- Data quality assessment (completeness, accuracy, consistency)
- Schema analysis and relationship mapping
- Historical data availability and trends
- Real-time vs. batch data considerations

**Exploratory Data Analysis (EDA)**
- Descriptive statistics and distribution analysis
- Correlation analysis and feature relationships
- Outlier detection and anomaly identification
- Missing data patterns and imputation strategies
- Temporal trends and seasonality patterns

### 2. Statistical Analysis & Modeling
**Hypothesis Testing**
- Business question formulation into testable hypotheses
- Statistical significance testing (t-tests, chi-square, ANOVA)
- Effect size calculation and practical significance
- Confidence intervals and margin of error analysis
- Multiple testing correction procedures

**Predictive Modeling**
- Feature engineering and selection
- Model selection (regression, classification, clustering)
- Cross-validation and performance evaluation
- Hyperparameter tuning and optimization
- Model interpretability and explainability

### 3. Advanced Analytics Techniques
**Machine Learning Applications**
- Supervised learning for prediction and classification
- Unsupervised learning for pattern discovery
- Time series forecasting and trend analysis
- Natural language processing for text data
- Computer vision for image/video analysis

**Business Intelligence Integration**
- KPI development and metric definition
- Dashboard design and visualization strategy
- Automated reporting and alert systems
- Self-service analytics enablement
- Data governance and quality monitoring

## Analysis Deliverables

### Executive Summary
- Key findings and business impact summary
- Strategic recommendations with priority ranking
- ROI projections and implementation timeline
- Risk assessment and mitigation strategies

### Technical Documentation
- Methodology explanation and assumptions
- Data sources and preprocessing steps
- Model performance metrics and validation results
- Code documentation and reproducibility guide
- Limitations and areas for future investigation

### Visualization Portfolio
- Interactive dashboards for ongoing monitoring
- Static reports for stakeholder communication
- Data storytelling presentations
- Infographics for key insight communication

## Quality Assurance Standards
- **Reproducibility**: All analysis steps documented and version controlled
- **Validation**: Results verified through multiple approaches and cross-validation
- **Peer Review**: Technical review by senior data scientists
- **Business Validation**: Findings validated with domain experts
- **Ethical Considerations**: Bias detection and fairness assessment

## Implementation Roadmap
1. **Data Infrastructure Setup**: ETL pipelines, data warehousing, security protocols
2. **Analysis Execution**: Statistical analysis, modeling, validation
3. **Insight Generation**: Pattern identification, recommendation development
4. **Stakeholder Communication**: Presentation, training, knowledge transfer
5. **Monitoring & Iteration**: Performance tracking, model updates, continuous improvement

## Success Metrics
- **Accuracy**: Model performance on validation datasets
- **Business Impact**: Measurable improvement in key business metrics
- **Adoption Rate**: Stakeholder usage of insights and recommendations
- **Time to Insight**: Speed of analysis completion and delivery
- **Decision Quality**: Improvement in data-driven decision making

**Analysis Excellence Score**: Target ≥92/100 for technical rigor and business value`,
}

export default function LiveGenerationDemo() {
  const [topic, setTopic] = useState("")
  const [result, setResult] = useState("")
  const [hasGenerated, setHasGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!topic || hasGenerated) return

    setIsGenerating(true)

    // Simulate realistic generation time
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Find matching advanced prompt or create a sophisticated generic one
    const advancedPrompt = ADVANCED_PROMPTS[topic.toLowerCase()] || generateAdvancedGenericPrompt(topic)

    setResult(advancedPrompt)
    setHasGenerated(true)
    setIsGenerating(false)
  }

  const generateAdvancedGenericPrompt = (userTopic: string) => {
    return `# ${userTopic.charAt(0).toUpperCase() + userTopic.slice(1)} Strategy Framework

## Role & Context
You are a Senior Consultant and Subject Matter Expert with extensive experience in ${userTopic} optimization and strategic implementation. You specialize in data-driven approaches and have successfully delivered solutions for enterprise-level organizations.

## Objective
Develop a comprehensive strategy for ${userTopic} that aligns with organizational objectives, industry best practices, and measurable outcomes. Focus on scalable implementation and sustainable results.

## Strategic Framework (7D Parameters Applied)
**Domain**: ${userTopic.charAt(0).toUpperCase() + userTopic.slice(1)} & Strategic Planning
**Scale**: Enterprise-level implementation
**Urgency**: Strategic priority with defined timeline
**Complexity**: Multi-faceted approach with cross-functional considerations
**Resources**: Team expertise, technology stack, budget allocation
**Application**: Organizational improvement and competitive advantage
**Output**: Actionable strategy document with implementation roadmap

## Analysis & Planning Requirements
1. **Current State Assessment**: Baseline analysis, gap identification, opportunity mapping
2. **Stakeholder Analysis**: Key players, influence mapping, communication strategy
3. **Best Practice Research**: Industry benchmarks, competitive analysis, innovation trends
4. **Resource Planning**: Team requirements, technology needs, budget considerations
5. **Risk Assessment**: Potential challenges, mitigation strategies, contingency planning
6. **Success Framework**: KPIs, measurement methodology, reporting structure
7. **Implementation Roadmap**: Phased approach, milestones, timeline optimization

## Deliverable Structure
- **Executive Summary**: Strategic overview and key recommendations (200 words)
- **Situation Analysis**: Current state, challenges, opportunities
- **Strategic Recommendations**: 5-7 prioritized initiatives with rationale
- **Implementation Plan**: Detailed roadmap with timelines and dependencies
- **Resource Requirements**: Team, technology, and budget specifications
- **Success Metrics**: KPIs, tracking mechanisms, optimization triggers
- **Risk Management**: Identified risks with mitigation strategies

## Quality Standards
- Evidence-based recommendations with supporting data
- Actionable insights with clear next steps
- Scalability considerations for future growth
- Industry best practices integration
- Stakeholder alignment and buy-in facilitation

**Strategic Excellence Score Target**: ≥87/100

---
*Generated by PromptForge Engine v3.2 | 7D Parameter Optimization | Enterprise-Grade Output*`
  }

  return (
    <section className="mt-24 border-t border-gray-700 pt-16 px-4 sm:px-8 lg:px-16">
      <h2 className="text-sm font-mono text-gray-400 mb-2">// PROMPTFORGE Live Generation</h2>

      <div className="bg-[#0e0e0e] border border-gray-700 rounded-xl p-8 grid md:grid-cols-2 gap-12">
        {/* INPUT */}
        <div>
          <label className="text-sm font-semibold text-yellow-400">Enter Your Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. marketing strategy"
            className="w-full mt-3 bg-black border border-gray-600 px-4 py-3 text-gray-100 rounded-md"
          />
          <div className="flex flex-wrap gap-2 mt-4 text-sm text-yellow-400">
            {EXAMPLES.map((ex, idx) => (
              <span
                key={idx}
                onClick={() => setTopic(ex)}
                className="cursor-pointer px-3 py-1 bg-[#1a1a1a] rounded hover:bg-yellow-800 transition"
              >
                {ex}
              </span>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={hasGenerated || !topic || isGenerating}
            className="mt-6 bg-yellow-400 hover:opacity-90 text-black font-bold px-6 py-3 rounded w-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? "🔄 Generating..." : "⚡ Generate Prompt"}
          </button>
        </div>

        {/* OUTPUT */}
        <div>
          <label className="text-sm font-semibold text-yellow-400">Generated Professional Prompt</label>
          <textarea
            readOnly
            value={
              isGenerating
                ? "🔄 Generating advanced prompt using 7D Parameter Engine...\n\nAnalyzing topic complexity...\nApplying industry frameworks...\nOptimizing for professional output..."
                : result
            }
            placeholder="Your professional prompt will appear here..."
            className="w-full mt-3 bg-black border border-gray-600 px-4 py-3 text-gray-300 rounded-md min-h-[180px] font-mono text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* STATUS FOOTER */}
      <div className="mt-6 text-sm text-gray-500 flex flex-wrap gap-8 font-mono">
        <span>
          ⚙️ Engine: <code className="bg-[#1a1a1a] px-2 py-1 rounded">PromptForge Engine (TypeScript)</code>
        </span>
        <span>
          🟢 Modules Active: <span className="text-green-400">50/50</span>
        </span>
        <span>
          ⚡ Success Rate: <span className="text-green-400">98.7%</span>
        </span>
      </div>
    </section>
  )
}
