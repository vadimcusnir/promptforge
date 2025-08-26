import { PromptRun } from "@/utils/promptCompiler"

export interface ExportOptions {
  format: 'txt' | 'md' | 'json' | 'pdf' | 'zip'
  includeMetadata?: boolean
  includeScores?: boolean
  includeHistory?: boolean
}

export interface ExportResult {
  success: boolean
  filename: string
  data: string | Blob
  error?: string
}

export function canExportFormat(format: string, plan: string): boolean {
  const exportPermissions = {
    free: ['txt'],
    creator: ['txt', 'md'],
    pro: ['txt', 'md', 'json', 'pdf'],
    enterprise: ['txt', 'md', 'json', 'pdf', 'zip']
  }
  
  return exportPermissions[plan as keyof typeof exportPermissions]?.includes(format) || false
}

export function exportPrompt(
  promptRun: PromptRun, 
  options: ExportOptions,
  plan: string
): ExportResult {
  if (!canExportFormat(options.format, plan)) {
    return {
      success: false,
      filename: '',
      data: '',
      error: `Export format ${options.format} not available on ${plan} plan`
    }
  }

  try {
    let content = ''
    let filename = `prompt_${promptRun.hash}`

    switch (options.format) {
      case 'txt':
        content = generateTextExport(promptRun, options)
        filename += '.txt'
        break
      
      case 'md':
        content = generateMarkdownExport(promptRun, options)
        filename += '.md'
        break
      
      case 'json':
        content = generateJsonExport(promptRun, options)
        filename += '.json'
        break
      
      case 'pdf':
        // For PDF, we'd typically use a library like jsPDF
        // For now, return HTML content that can be converted
        content = generateHtmlExport(promptRun, options)
        filename += '.html'
        break
      
      case 'zip':
        // For ZIP, we'd typically use a library like JSZip
        // For now, return a combined text file
        content = generateZipExport(promptRun, options)
        filename += '.txt'
        break
      
      default:
        throw new Error(`Unsupported export format: ${options.format}`)
    }

    return {
      success: true,
      filename,
      data: content
    }
  } catch (error) {
    return {
      success: false,
      filename: '',
      data: '',
      error: error instanceof Error ? error.message : 'Export failed'
    }
  }
}

function generateTextExport(promptRun: PromptRun, options: ExportOptions): string {
  let content = `PROMPT FORGE EXPORT\n`
  content += `Generated: ${new Date(promptRun.timestamp).toLocaleString()}\n`
  content += `Run ID: ${promptRun.id}\n`
  content += `Module: ${promptRun.moduleId}\n`
  content += `Hash: ${promptRun.hash}\n`
  content += `Plan: ${promptRun.plan}\n\n`
  
  if (options.includeScores && promptRun.scores) {
    content += `SCORES:\n`
    content += `Structure: ${promptRun.scores.structure}/100\n`
    content += `Clarity: ${promptRun.scores.clarity}/100\n`
    content += `KPI Compliance: ${promptRun.scores.kpi_compliance}/100\n`
    content += `Executability: ${promptRun.scores.executability}/100\n\n`
  }
  
  if (options.includeMetadata) {
    content += `INPUT VALUES:\n`
    Object.entries(promptRun.inputValues).forEach(([key, value]) => {
      content += `${key}: ${JSON.stringify(value)}\n`
    })
    content += `\n`
  }
  
  content += `PROMPT CONTENT:\n`
  content += `${promptRun.prompt}\n\n`
  
  if (promptRun.tokensUsed) {
    content += `Tokens Used: ${promptRun.tokensUsed}\n`
  }
  
  if (promptRun.cost) {
    content += `Cost: $${promptRun.cost.toFixed(4)}\n`
  }
  
  return content
}

function generateMarkdownExport(promptRun: PromptRun, options: ExportOptions): string {
  let content = `# Prompt Forge Export\n\n`
  content += `**Generated:** ${new Date(promptRun.timestamp).toLocaleString()}\n`
  content += `**Run ID:** \`${promptRun.id}\`\n`
  content += `**Module:** ${promptRun.moduleId}\n`
  content += `**Hash:** \`${promptRun.hash}\`\n`
  content += `**Plan:** ${promptRun.plan}\n\n`
  
  if (options.includeScores && promptRun.scores) {
    content += `## Scores\n\n`
    content += `| Metric | Score |\n`
    content += `|--------|-------|\n`
    content += `| Structure | ${promptRun.scores.structure}/100 |\n`
    content += `| Clarity | ${promptRun.scores.clarity}/100 |\n`
    content += `| KPI Compliance | ${promptRun.scores.kpi_compliance}/100 |\n`
    content += `| Executability | ${promptRun.scores.executability}/100 |\n\n`
  }
  
  if (options.includeMetadata) {
    content += `## Input Values\n\n`
    Object.entries(promptRun.inputValues).forEach(([key, value]) => {
      content += `**${key}:** \`${JSON.stringify(value)}\`\n\n`
    })
  }
  
  content += `## Prompt Content\n\n`
  content += `\`\`\`\n${promptRun.prompt}\n\`\`\`\n\n`
  
  if (promptRun.tokensUsed || promptRun.cost) {
    content += `## Usage\n\n`
    if (promptRun.tokensUsed) {
      content += `**Tokens Used:** ${promptRun.tokensUsed}\n\n`
    }
    if (promptRun.cost) {
      content += `**Cost:** $${promptRun.cost.toFixed(4)}\n\n`
    }
  }
  
  return content
}

function generateJsonExport(promptRun: PromptRun, options: ExportOptions): string {
  const exportData: any = {
    metadata: {
      generated: promptRun.timestamp,
      runId: promptRun.id,
      moduleId: promptRun.moduleId,
      hash: promptRun.hash,
      plan: promptRun.plan
    },
    prompt: promptRun.prompt
  }
  
  if (options.includeScores && promptRun.scores) {
    exportData.scores = promptRun.scores
  }
  
  if (options.includeMetadata) {
    exportData.inputValues = promptRun.inputValues
  }
  
  if (promptRun.tokensUsed) {
    exportData.tokensUsed = promptRun.tokensUsed
  }
  
  if (promptRun.cost) {
    exportData.cost = promptRun.cost
  }
  
  return JSON.stringify(exportData, null, 2)
}

function generateHtmlExport(promptRun: PromptRun, options: ExportOptions): string {
  let content = `<!DOCTYPE html>
<html>
<head>
  <title>Prompt Forge Export</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .header { border-bottom: 2px solid #d1a954; padding-bottom: 20px; margin-bottom: 30px; }
    .metadata { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .score-card { background: #d1a954; color: white; padding: 20px; border-radius: 8px; text-align: center; }
    .prompt { background: #f9f9f9; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Prompt Forge Export</h1>
    <p><strong>Generated:</strong> ${new Date(promptRun.timestamp).toLocaleString()}</p>
    <p><strong>Run ID:</strong> ${promptRun.id}</p>
    <p><strong>Module:</strong> ${promptRun.moduleId}</p>
    <p><strong>Hash:</strong> ${promptRun.hash}</p>
    <p><strong>Plan:</strong> ${promptRun.plan}</p>
  </div>`
  
  if (options.includeScores && promptRun.scores) {
    content += `
  <h2>Scores</h2>
  <div class="scores">
    <div class="score-card">
      <h3>Structure</h3>
      <h2>${promptRun.scores.structure}/100</h2>
    </div>
    <div class="score-card">
      <h3>Clarity</h3>
      <h2>${promptRun.scores.clarity}/100</h2>
    </div>
    <div class="score-card">
      <h3>KPI Compliance</h3>
      <h2>${promptRun.scores.kpi_compliance}/100</h2>
    </div>
    <div class="score-card">
      <h3>Executability</h3>
      <h2>${promptRun.scores.executability}/100</h2>
    </div>
  </div>`
  }
  
  if (options.includeMetadata) {
    content += `
  <h2>Input Values</h2>
  <div class="metadata">
    ${Object.entries(promptRun.inputValues).map(([key, value]) => 
      `<p><strong>${key}:</strong> <code>${JSON.stringify(value)}</code></p>`
    ).join('')}
  </div>`
  }
  
  content += `
  <h2>Prompt Content</h2>
  <div class="prompt">${promptRun.prompt}</div>`
  
  if (promptRun.tokensUsed || promptRun.cost) {
    content += `
  <h2>Usage</h2>
  <div class="metadata">
    ${promptRun.tokensUsed ? `<p><strong>Tokens Used:</strong> ${promptRun.tokensUsed}</p>` : ''}
    ${promptRun.cost ? `<p><strong>Cost:</strong> $${promptRun.cost.toFixed(4)}</p>` : ''}
  </div>`
  }
  
  content += `
</body>
</html>`
  
  return content
}

function generateZipExport(promptRun: PromptRun, options: ExportOptions): string {
  // This would typically create a ZIP file with multiple formats
  // For now, return a comprehensive text export
  return generateTextExport(promptRun, { ...options, includeMetadata: true, includeScores: true })
}

export function downloadExport(result: ExportResult): void {
  if (!result.success) {
    throw new Error(result.error || 'Export failed')
  }
  
  const blob = new Blob([result.data], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = result.filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
