import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ExportSchema = z.object({
  format: z.enum(['pdf', 'json', 'md', 'zip']),
  moduleIds: z.array(z.string()),
  metadata: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, moduleIds, metadata } = ExportSchema.parse(body)

    // Mock export data for demo
    const mockModules = [
      {
        id: 'M01',
        title: 'Content Generator',
        summary: 'Generate high-quality content for any topic',
        prompt: 'Generate comprehensive content about {topic} with the following requirements: {requirements}',
        parameters: {
          topic: 'string',
          requirements: 'string',
          tone: 'string',
          length: 'string',
        },
      },
      {
        id: 'M02',
        title: 'Text Analyzer',
        summary: 'Analyze text for sentiment, keywords, and structure',
        prompt: 'Analyze the following text: {text}. Provide sentiment analysis, key themes, and structural insights.',
        parameters: {
          text: 'string',
          analysis_type: 'string',
        },
      },
      {
        id: 'M03',
        title: 'Prompt Optimizer',
        summary: 'Optimize prompts for better AI responses',
        prompt: 'Optimize this prompt for better AI performance: {original_prompt}. Consider clarity, specificity, and context.',
        parameters: {
          original_prompt: 'string',
          optimization_goals: 'array',
        },
      },
    ]

    const selectedModules = mockModules.filter(module => moduleIds.includes(module.id))

    let exportData: string
    let filename: string
    let mimeType: string

    switch (format) {
      case 'json':
        exportData = JSON.stringify({
          metadata,
          modules: selectedModules,
          exportedAt: new Date().toISOString(),
        }, null, 2)
        filename = `promptforge-modules-${Date.now()}.json`
        mimeType = 'application/json'
        break

      case 'md':
        exportData = `# ${metadata.title}\n\n${metadata.description}\n\n**Author:** ${metadata.author}\n**Exported:** ${new Date().toLocaleDateString()}\n\n---\n\n${selectedModules.map(module => `## ${module.title}\n\n${module.summary}\n\n**Prompt:**\n\`\`\`\n${module.prompt}\n\`\`\`\n\n**Parameters:**\n${Object.entries(module.parameters).map(([key, type]) => `- ${key}: ${type}`).join('\n')}\n\n---\n\n`).join('')}`
        filename = `promptforge-modules-${Date.now()}.md`
        mimeType = 'text/markdown'
        break

      case 'pdf':
        // For demo, return a simple text representation
        exportData = `PromptForge Module Export\n\n${metadata.title}\n${metadata.description}\n\nAuthor: ${metadata.author}\nExported: ${new Date().toLocaleDateString()}\n\nModules:\n${selectedModules.map(module => `\n${module.title}\n${module.summary}\n${module.prompt}\n`).join('\n')}`
        filename = `promptforge-modules-${Date.now()}.txt`
        mimeType = 'text/plain'
        break

      case 'zip':
        // For demo, return a simple text representation
        exportData = `PromptForge Module Bundle\n\n${metadata.title}\n${metadata.description}\n\nAuthor: ${metadata.author}\nExported: ${new Date().toLocaleDateString()}\n\nModules:\n${selectedModules.map(module => `\n${module.title}\n${module.summary}\n${module.prompt}\n`).join('\n')}`
        filename = `promptforge-modules-${Date.now()}.txt`
        mimeType = 'text/plain'
        break

      default:
        return NextResponse.json(
          { error: 'Unsupported export format' },
          { status: 400 }
        )
    }

    // Convert to base64 for transmission
    const base64Data = Buffer.from(exportData).toString('base64')

    return NextResponse.json({
      success: true,
      data: base64Data,
      filename,
      mimeType,
      size: exportData.length,
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export modules' },
      { status: 500 }
    )
  }
}
