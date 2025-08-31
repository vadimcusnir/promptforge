import jsPDF from 'jspdf'
import JSZip from 'jszip'

export interface ExportOptions {
  format: 'pdf' | 'json' | 'md' | 'zip'
  modules: any[]
  metadata?: {
    title: string
    description: string
    author: string
    date: string
  }
}

export async function exportToPDF(options: ExportOptions): Promise<Blob> {
  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text(options.metadata?.title || 'PromptForge Export', 20, 20)
  
  // Add description
  doc.setFontSize(12)
  doc.text(options.metadata?.description || '', 20, 35)
  
  let yPosition = 50
  
  // Add modules
  options.modules.forEach((module, index) => {
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }
    
    doc.setFontSize(14)
    doc.text(`${module.id}: ${module.name}`, 20, yPosition)
    yPosition += 10
    
    doc.setFontSize(10)
    doc.text(module.description, 20, yPosition)
    yPosition += 15
    
    doc.text(`Prompt: ${module.prompt}`, 20, yPosition)
    yPosition += 20
  })
  
  return doc.output('blob')
}

export async function exportToJSON(options: ExportOptions): Promise<Blob> {
  const data = {
    metadata: options.metadata,
    modules: options.modules,
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  }
  
  const jsonString = JSON.stringify(data, null, 2)
  return new Blob([jsonString], { type: 'application/json' })
}

export async function exportToMarkdown(options: ExportOptions): Promise<Blob> {
  let markdown = `# ${options.metadata?.title || 'PromptForge Export'}\n\n`
  
  if (options.metadata?.description) {
    markdown += `${options.metadata.description}\n\n`
  }
  
  markdown += `**Exported:** ${new Date().toLocaleDateString()}\n\n`
  markdown += `**Author:** ${options.metadata?.author || 'PromptForge'}\n\n`
  markdown += `---\n\n`
  
  options.modules.forEach(module => {
    markdown += `## ${module.id}: ${module.name}\n\n`
    markdown += `${module.description}\n\n`
    markdown += `**Category:** ${module.category}\n\n`
    markdown += `**Difficulty:** ${module.difficulty}\n\n`
    markdown += `**Tags:** ${module.tags.join(', ')}\n\n`
    markdown += `### Prompt\n\n`
    markdown += `\`\`\`\n${module.prompt}\n\`\`\`\n\n`
    
    if (module.examples && module.examples.length > 0) {
      markdown += `### Examples\n\n`
      module.examples.forEach((example: any, index: number) => {
        markdown += `**Example ${index + 1}:**\n\n`
        markdown += `**Input:** ${example.input}\n\n`
        markdown += `**Output:** ${example.output}\n\n`
      })
    }
    
    markdown += `---\n\n`
  })
  
  return new Blob([markdown], { type: 'text/markdown' })
}

export async function exportToZip(options: ExportOptions): Promise<Blob> {
  const zip = new JSZip()
  
  // Add JSON export
  const jsonBlob = await exportToJSON(options)
  zip.file('modules.json', jsonBlob)
  
  // Add Markdown export
  const mdBlob = await exportToMarkdown(options)
  zip.file('modules.md', mdBlob)
  
  // Add PDF export
  const pdfBlob = await exportToPDF(options)
  zip.file('modules.pdf', pdfBlob)
  
  // Add manifest
  const manifest = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    files: ['modules.json', 'modules.md', 'modules.pdf'],
    moduleCount: options.modules.length,
    metadata: options.metadata
  }
  
  zip.file('manifest.json', JSON.stringify(manifest, null, 2))
  
  return zip.generateAsync({ type: 'blob' })
}

export async function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
