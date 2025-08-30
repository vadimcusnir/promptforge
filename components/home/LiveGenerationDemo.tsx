"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { ContentChunker } from "@/components/ui/content-chunker"

// Memoized examples to prevent re-creation
const EXAMPLES = ["marketing strategy", "code review", "content creation", "user onboarding", "data analysis"]

// Optimized, shorter prompts for better LCP
const PROMPT_PREVIEWS: Record<string, string> = {
  "marketing strategy": `# Marketing Strategy Framework

## Role & Context
Senior Marketing Strategist with 15+ years experience in digital marketing and growth strategy.

## Objective
Develop comprehensive marketing strategy aligned with business objectives and measurable outcomes.

## Framework (7D Parameters)
**Domain**: Marketing & Growth
**Scale**: Enterprise-level (6-12 month timeline)
**Urgency**: Strategic priority (Q1 implementation)
**Complexity**: Multi-channel, cross-functional approach
**Resources**: Marketing team, budget, tech stack
**Application**: B2B/B2C market penetration
**Output**: Actionable strategy with KPIs

## Key Deliverables
- Market analysis & competitive landscape
- Audience segmentation & value proposition
- Channel strategy & budget allocation
- Implementation roadmap & success metrics

**Confidence Target**: ≥85/100`,

  "code review": `# Advanced Code Review Protocol

## Role & Context
Principal Software Engineer specializing in architecture, security, and performance optimization.

## Objective
Comprehensive code review ensuring quality, security, maintainability, and performance.

## Review Framework (7D Parameters)
**Domain**: Software Engineering & QA
**Scale**: Production-ready codebase analysis
**Urgency**: Pre-deployment critical review
**Complexity**: Multi-layer architecture assessment
**Resources**: Static analysis tools, testing frameworks
**Application**: Enterprise software development
**Output**: Detailed review with actionable feedback

## Review Criteria
1. **Code Quality**: Standards, readability, documentation
2. **Architecture**: Design patterns, SOLID principles
3. **Security**: Validation, authentication, encryption
4. **Performance**: Algorithm efficiency, optimization
5. **Testing**: Coverage, scenarios, edge cases

## Output Structure
- Executive summary & priority issues
- Code quality score breakdown
- Critical issues & recommendations
- Action items with effort estimates

**Confidence Target**: ≥90/100`,

  "content creation": `# Content Creation Excellence Framework

## Role & Context
Senior Content Strategist with 12+ years creating high-performing content for global brands.

## Objective
Comprehensive content strategy driving engagement, brand awareness, and business outcomes.

## Content Framework (7D Parameters)
**Domain**: Content Marketing & Creative Strategy
**Scale**: Multi-channel content ecosystem
**Urgency**: Ongoing content pipeline
**Complexity**: Integrated cross-platform approach
**Resources**: Content team, creative tools, distribution channels
**Application**: Brand awareness and audience engagement
**Output**: Content strategy and production guidelines

## Content Strategy Requirements
- Audience analysis & content audit
- Channel strategy & content pillars
- Production calendar & distribution plan
- Performance metrics & optimization framework

## Content Types
- Long-form articles & video content
- Infographics & social media series
- Podcasts & email newsletters
- Case studies & user-generated content

**Confidence Target**: ≥88/100`,

  "user onboarding": `# User Onboarding Excellence Framework

## Role & Context
Senior UX Designer specializing in user journey mapping and conversion optimization.

## Objective
Comprehensive onboarding experience maximizing activation, reducing churn, and accelerating time-to-value.

## Onboarding Framework (7D Parameters)
**Domain**: User Experience & Product Adoption
**Scale**: End-to-end user journey optimization
**Urgency**: Critical for user retention and growth
**Complexity**: Multi-touchpoint, personalized experience
**Resources**: UX team, analytics tools, A/B testing platform
**Application**: SaaS product user activation
**Output**: Complete onboarding strategy and implementation plan

## Experience Design
1. **Welcome & Orientation**: Personalized welcome, clear expectations
2. **Guided Setup**: Step-by-step configuration, essential features
3. **First Value**: Quick wins, guided completion, celebration
4. **Ongoing Support**: Contextual help, progressive disclosure

## Success Metrics
- Activation rate & time-to-value
- Completion rate & engagement
- Support ticket reduction

**Confidence Target**: ≥92/100`,

  "data analysis": `# Data Analysis Excellence Framework

## Role & Context
Senior Data Scientist with 15+ years helping organizations make data-driven decisions.

## Objective
Comprehensive data analysis framework enabling meaningful insights and measurable business outcomes.

## Analysis Framework (7D Parameters)
**Domain**: Data Science & Business Intelligence
**Scale**: Enterprise-wide analytics implementation
**Urgency**: Strategic decision-making support
**Complexity**: Multi-source, multi-dimensional analysis
**Resources**: Data team, analytics tools, visualization platforms
**Application**: Business intelligence and strategic planning
**Output**: Comprehensive analysis strategy and implementation plan

## Analysis Methodology
1. **Data Assessment**: Quality, integration, governance
2. **Exploratory Analysis**: Statistics, patterns, outliers
3. **Advanced Analytics**: Modeling, forecasting, ML
4. **Insight Generation**: Findings, recommendations, next steps

## Deliverables
- Executive summary & technical analysis
- Visualizations & interactive dashboards
- Actionable insights & implementation plan
- Monitoring framework & optimization

**Confidence Target**: ≥95/100`
}

// Full detailed prompts for when user requests them
const FULL_PROMPTS: Record<string, string> = {
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
2. **Code Quality Score**: Numerical rating with breakdown
3. **Critical Issues**: Security vulnerabilities and major bugs
4. **Performance Concerns**: Bottlenecks and optimization opportunities
5. **Architecture Feedback**: Design pattern recommendations
6. **Testing Recommendations**: Coverage improvements and test strategies
7. **Action Items**: Prioritized list of required changes

## Quality Standards
- Specific, actionable feedback with code examples
- Risk-based prioritization of issues
- Educational context for learning opportunities
- Performance impact assessment for all recommendations

**Confidence Score Target**: ≥90/100`,

  "content creation": `# Content Creation Excellence Framework

## Role & Context
You are a Senior Content Strategist and Creative Director with expertise in content marketing, brand storytelling, and audience engagement. You have 12+ years of experience creating high-performing content for global brands and have led content teams that consistently achieve engagement rates above industry averages.

## Objective
Develop a comprehensive content creation strategy that drives audience engagement, brand awareness, and business outcomes while maintaining consistent quality and voice across all channels.

## Content Framework (7D Parameters)
**Domain**: Content Marketing & Creative Strategy
**Scale**: Multi-channel content ecosystem
**Urgency**: Ongoing content pipeline
**Complexity**: Integrated cross-platform approach
**Resources**: Content team, creative tools, distribution channels
**Application**: Brand awareness and audience engagement
**Output**: Content strategy and production guidelines

## Content Strategy Requirements
1. **Audience Analysis**: Deep dive into target demographics and psychographics
2. **Content Audit**: Assessment of existing content performance and gaps
3. **Channel Strategy**: Optimal mix of owned, earned, and paid channels
4. **Content Pillars**: Core themes and messaging frameworks
5. **Production Calendar**: Editorial calendar with content themes
6. **Distribution Strategy**: Multi-channel amplification approach
7. **Performance Metrics**: KPIs and measurement frameworks

## Content Types & Formats
### Primary Content
- Long-form articles and blog posts
- Video content (tutorials, interviews, behind-the-scenes)
- Infographics and visual content
- Podcast episodes and audio content
- Social media content series

### Supporting Content
- Email newsletters and nurture sequences
- Social media posts and stories
- Webinar content and presentations
- Case studies and success stories
- User-generated content campaigns

## Quality Standards
- Original, valuable content that solves audience problems
- Consistent brand voice and messaging
- SEO-optimized content with keyword strategy
- Engaging visuals and multimedia elements
- Clear calls-to-action and conversion paths

## Output Deliverables
1. **Content Strategy Document**: Comprehensive strategy with implementation plan
2. **Editorial Calendar**: 90-day content plan with themes and topics
3. **Content Guidelines**: Style guide, voice, and quality standards
4. **Distribution Plan**: Channel-specific content adaptation
5. **Performance Dashboard**: Metrics and optimization framework

**Confidence Score Target**: ≥88/100`,

  "user onboarding": `# User Onboarding Excellence Framework

## Role & Context
You are a Senior User Experience Designer and Onboarding Specialist with expertise in user journey mapping, conversion optimization, and product adoption. You have 10+ years of experience designing onboarding experiences that achieve 80%+ completion rates and significantly reduce time-to-value for SaaS products.

## Objective
Design a comprehensive user onboarding experience that maximizes user activation, reduces churn, and accelerates time-to-value while maintaining a delightful user experience that aligns with brand standards.

## Onboarding Framework (7D Parameters)
**Domain**: User Experience & Product Adoption
**Scale**: End-to-end user journey optimization
**Urgency**: Critical for user retention and growth
**Complexity**: Multi-touchpoint, personalized experience
**Resources**: UX team, analytics tools, A/B testing platform
**Application**: SaaS product user activation
**Output**: Complete onboarding strategy and implementation plan

## Onboarding Experience Design
### 1. Welcome & Orientation
- Personalized welcome sequence
- Product overview and value proposition
- Clear expectations and success metrics
- Progress tracking and motivation

### 2. Guided Setup
- Step-by-step account configuration
- Essential feature introduction
- Data import and migration support
- Integration setup assistance

### 3. First Value Achievement
- Quick wins and immediate benefits
- Guided first use case completion
- Success celebration and reinforcement
- Next steps and advanced features

### 4. Ongoing Support
- Contextual help and tooltips
- Progressive disclosure of features
- Community and support resources
- Feedback collection and iteration

## User Journey Optimization
1. **Pre-Onboarding**: Email sequences and expectations setting
2. **Onboarding Flow**: Step-by-step guided experience
3. **Post-Onboarding**: Follow-up and advanced feature introduction
4. **Retention**: Ongoing engagement and value delivery

## Success Metrics
- **Activation Rate**: Users who complete key onboarding steps
- **Time-to-Value**: Time from signup to first meaningful outcome
- **Completion Rate**: Percentage of users who finish onboarding
- **Engagement**: Post-onboarding feature usage and retention
- **Support Tickets**: Reduction in onboarding-related support requests

## Output Deliverables
1. **Onboarding Strategy**: Complete user journey and experience design
2. **Implementation Plan**: Technical requirements and development roadmap
3. **Content Strategy**: Copy, visuals, and interactive elements
4. **Analytics Framework**: Measurement and optimization strategy
5. **A/B Testing Plan**: Continuous improvement and optimization

**Confidence Target**: ≥92/100`,

  "data analysis": `# Data Analysis Excellence Framework

## Role & Context
You are a Senior Data Scientist and Analytics Consultant with expertise in statistical analysis, data visualization, and business intelligence. You have 15+ years of experience helping organizations make data-driven decisions and have led analytics teams that consistently deliver actionable insights driving significant business impact.

## Objective
Develop a comprehensive data analysis framework that enables organizations to extract meaningful insights from their data, make informed decisions, and drive measurable business outcomes through systematic analysis and clear communication of findings.

## Analysis Framework (7D Parameters)
**Domain**: Data Science & Business Intelligence
**Scale**: Enterprise-wide analytics implementation
**Urgency**: Strategic decision-making support
**Complexity**: Multi-source, multi-dimensional analysis
**Resources**: Data team, analytics tools, visualization platforms
**Application**: Business intelligence and strategic planning
**Output**: Comprehensive analysis strategy and implementation plan

## Analysis Methodology
### 1. Data Assessment & Preparation
- Data quality assessment and cleaning
- Source system integration and ETL processes
- Data governance and security protocols
- Metadata management and documentation

### 2. Exploratory Data Analysis
- Statistical summaries and distributions
- Correlation analysis and pattern identification
- Outlier detection and anomaly analysis
- Data visualization and exploration

### 3. Advanced Analytics
- Predictive modeling and forecasting
- Segmentation and clustering analysis
- A/B testing and experimental design
- Machine learning model development

### 4. Insight Generation
- Key findings and trend identification
- Root cause analysis and hypothesis testing
- Impact assessment and business implications
- Actionable recommendations and next steps

## Analysis Deliverables
1. **Executive Summary**: High-level findings and business impact
2. **Technical Analysis**: Detailed methodology and results
3. **Visualizations**: Charts, graphs, and interactive dashboards
4. **Recommendations**: Actionable insights and implementation plan
5. **Monitoring Framework**: Ongoing measurement and optimization

## Quality Standards
- Rigorous statistical methodology and validation
- Clear, actionable insights with business context
- Professional visualization and presentation
- Comprehensive documentation and reproducibility
- Ethical data handling and privacy compliance

## Success Metrics
- **Insight Quality**: Accuracy and relevance of findings
- **Business Impact**: Measurable outcomes and ROI
- **Stakeholder Adoption**: Implementation of recommendations
- **Process Efficiency**: Time from data to insight
- **Continuous Improvement**: Iterative optimization and learning

**Confidence Score Target**: ≥95/100`
}

export default function LiveGenerationDemo() {
  const [selectedExample, setSelectedExample] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [showFullPrompt, setShowFullPrompt] = useState(false)
  const [currentPromptType, setCurrentPromptType] = useState<"preview" | "full">("preview")
  const [useChunking, setUseChunking] = useState(false)

  // Progressive loading - show basic interface first, then enhance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100) // Small delay to ensure smooth rendering

    return () => clearTimeout(timer)
  }, [])

  // Memoized prompt generation to prevent unnecessary recalculations
  const handleGeneratePrompt = useCallback(() => {
    if (selectedExample) {
      const promptType = showFullPrompt ? "full" : "preview"
      setCurrentPromptType(promptType)
      
      if (promptType === "preview") {
        setGeneratedPrompt(PROMPT_PREVIEWS[selectedExample] || "Prompt not found")
        setUseChunking(false) // Preview mode doesn't need chunking
      } else {
        const fullPrompt = FULL_PROMPTS[selectedExample] || "Full prompt not found"
        setGeneratedPrompt(fullPrompt)
        // Enable chunking for full prompts to improve LCP
        setUseChunking(fullPrompt.length > 1000)
      }
    }
  }, [selectedExample, showFullPrompt])

  // Memoized example selection to prevent unnecessary re-renders
  const handleExampleSelect = useCallback((example: string) => {
    setSelectedExample(example)
    setGeneratedPrompt("")
    setShowFullPrompt(false)
    setCurrentPromptType("preview")
    setUseChunking(false)
  }, [])

  // Toggle between preview and full prompt
  const togglePromptType = useCallback(() => {
    setShowFullPrompt(!showFullPrompt)
    if (selectedExample) {
      handleGeneratePrompt()
    }
  }, [showFullPrompt, selectedExample, handleGeneratePrompt])

  // Show minimal interface until fully loaded
  if (!isLoaded) {
    return (
      <section className="mt-24 border-t border-gray-700 pt-16 px-4 sm:px-8 lg:px-16">
        <div className="bg-primary border border-gray-700 rounded-xl p-8">
          <div className="text-center text-gray-400">
            <div className="text-sm font-mono mb-2">// PROMPTFORGE Live Generation</div>
            <div className="text-lg">Loading demo interface...</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="mt-24 border-t border-gray-700 pt-16 px-4 sm:px-8 lg:px-16">
      <h2 className="text-sm font-mono text-gray-400 mb-2">// PROMPTFORGE Live Generation</h2>
      <div className="bg-primary border border-gray-700 rounded-xl p-8 grid md:grid-cols-2 gap-12">
        <div>
          <label className="text-sm font-semibold text-yellow-400">Enter Your Topic</label>
          <input 
            type="text" 
            placeholder="e.g. marketing strategy" 
            className="w-full mt-3 bg-black border border-gray-600 px-4 py-3 text-gray-100 rounded-md" 
            value={selectedExample}
            onChange={(e) => setSelectedExample(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mt-4 text-sm text-yellow-400">
            {EXAMPLES.map((example) => (
              <span 
                key={example}
                className="cursor-pointer px-3 py-1 bg-primary rounded hover:bg-yellow-800 transition"
                onClick={() => handleExampleSelect(example)}
              >
                {example}
              </span>
            ))}
          </div>
          
          {/* Prompt Type Toggle */}
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm text-gray-400">Prompt Type:</label>
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded text-xs transition ${
                  !showFullPrompt 
                    ? 'bg-yellow-600 text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => {
                  if (showFullPrompt) {
                    setShowFullPrompt(false)
                    setCurrentPromptType("preview")
                  }
                }}
              >
                Preview
              </button>
              <button
                className={`px-3 py-1 rounded text-xs transition ${
                  showFullPrompt 
                    ? 'bg-yellow-600 text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => {
                  if (!showFullPrompt) {
                    setShowFullPrompt(true)
                    setCurrentPromptType("full")
                  }
                }}
              >
                Full
              </button>
            </div>
          </div>
          
          <button 
            disabled={!selectedExample}
            className="mt-6 bg-yellow-400 hover:opacity-90 text-black font-bold px-6 py-3 rounded w-full disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleGeneratePrompt}
          >
            ⚡ Generate {showFullPrompt ? 'Full' : 'Preview'} Prompt
          </button>
        </div>
        <div>
          <label className="text-sm font-semibold text-yellow-400">
            Generated Professional Prompt
            {currentPromptType === "preview" && (
              <span className="ml-2 text-xs text-gray-500">(Preview Mode)</span>
            )}
            {useChunking && (
              <span className="ml-2 text-xs text-green-400">(Chunked for LCP)</span>
            )}
          </label>
          
          {/* Use content chunking for long content to improve LCP */}
          {useChunking && generatedPrompt ? (
            <div className="mt-3">
              <ContentChunker
                content={generatedPrompt}
                maxChunkSize={800}
                showProgress={true}
                autoExpand={false}
                className="bg-black border border-gray-600 rounded-md p-3"
              />
            </div>
          ) : (
            <textarea 
              readOnly 
              placeholder="Your professional prompt will appear here..." 
              className="w-full mt-3 bg-black border border-gray-600 px-4 py-3 text-gray-300 rounded-md min-h-[180px] font-mono text-sm leading-relaxed"
              value={generatedPrompt}
            />
          )}
          
          {/* Content Length Indicator */}
          {generatedPrompt && (
            <div className="mt-2 text-xs text-gray-500">
              Content length: {generatedPrompt.length} characters
              {currentPromptType === "preview" && (
                <span className="ml-2 text-yellow-400">
                  (Full version: {FULL_PROMPTS[selectedExample]?.length || 0} characters)
                </span>
              )}
              {useChunking && (
                <span className="ml-2 text-green-400">
                  (Optimized with content chunking)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-500 flex flex-wrap gap-8 font-mono">
        <span>⚙️ Engine: <code className="bg-primary px-2 py-1 rounded">PromptForge Engine (TypeScript)</code></span>
        <span>🟢 Modules Active: <span className="text-green-400">50/50</span></span>
        <span>⚡ Success Rate: <span className="text-green-400">98.7%</span></span>
        <span>📊 LCP Optimized: <span className="text-green-400">
          {useChunking ? 'Content Chunking' : currentPromptType === 'preview' ? 'Preview Mode' : 'Standard Mode'}
        </span></span>
      </div>
    </section>
  )
}
