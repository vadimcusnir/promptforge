import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Create a comprehensive free guide content
    const guideContent = `# PromptForge™ Free Guide
## Industrial Prompt Engineering Fundamentals

### What is PromptForge?
PromptForge is an industrial-grade prompt generation platform that transforms vague ideas into precise, executable prompts using a systematic 7-dimensional parameter engine.

### The 7D Parameter Engine
Our proprietary system uses seven dimensions to create optimal prompts:

1. **Domain** - Business context (marketing, sales, strategy, etc.)
2. **Scale** - Organization size (startup, SMB, enterprise)
3. **Urgency** - Time sensitivity (standard, high, critical)
4. **Complexity** - Task difficulty (basic, intermediate, advanced)
5. **Resources** - Available capacity (limited, standard, unlimited)
6. **Application** - Use case (content, strategy, analysis)
7. **Output** - Desired format (text, structured, visual)

### Getting Started
1. Choose your domain and scale
2. Set urgency and complexity levels
3. Configure resources and application context
4. Select desired output format
5. Generate and score your prompt

### Quality Scoring
All prompts are scored on a 0-100 scale:
- **80+ Score**: Export-ready, professional quality
- **60-79 Score**: Good quality, minor improvements needed
- **Below 60**: Needs significant refinement

### Export Options
- **Free Plan**: TXT format only
- **Creator Plan**: TXT + Markdown
- **Pro Plan**: TXT + Markdown + PDF + JSON
- **Enterprise Plan**: All formats + Bundle.zip + API access

### Best Practices
1. Be specific with your domain selection
2. Match complexity to your actual needs
3. Use appropriate urgency levels
4. Consider your resource constraints
5. Choose the right output format for your use case

### Common Use Cases
- **Content Creation**: Blog posts, social media, marketing copy
- **Strategic Planning**: Business plans, market analysis, risk assessment
- **Sales Enablement**: Proposals, presentations, follow-up sequences
- **Analytics**: Data analysis, reporting, insights generation

### Next Steps
1. Try the free plan with 3 core modules
2. Upgrade to Creator for full module access
3. Use Pro for advanced exports and live testing
4. Contact us for Enterprise features and API access

---
© 2025 PromptForge™. All rights reserved.
For more information, visit: https://promptforge.com
`

    // Create response with the guide content
    const response = new NextResponse(guideContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown',
        'Content-Disposition': 'attachment; filename="promptforge-free-guide.md"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })

    return response

  } catch (error) {
    console.error('Error generating free guide:', error)
    return NextResponse.json(
      { error: 'Failed to generate guide' },
      { status: 500 }
    )
  }
}
