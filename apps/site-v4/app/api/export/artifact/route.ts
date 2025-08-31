import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { data, format, filename } = await request.json()

    let content: string
    let contentType: string

    switch (format) {
      case "json":
        content = JSON.stringify(data, null, 2)
        contentType = "application/json"
        break

      case "csv":
        const csvHeaders =
          "Module,Domain,Scale,Urgency,Complexity,Resources,Application,Output,AI Score,Clarity,Execution,Business Fit\n"
        const csvRow = [
          data.module?.name || "",
          data.sevenDParameters.domain,
          data.sevenDParameters.scale,
          data.sevenDParameters.urgency,
          data.sevenDParameters.complexity,
          data.sevenDParameters.resources,
          data.sevenDParameters.application,
          data.sevenDParameters.output,
          data.qualityMetrics?.overallScore || "",
          data.qualityMetrics?.clarity || "",
          data.qualityMetrics?.execution || "",
          data.qualityMetrics?.businessFit || "",
        ]
          .map((field) => `"${field}"`)
          .join(",")
        content = csvHeaders + csvRow
        contentType = "text/csv"
        break

      case "txt":
        content = `PromptForge Export - ${data.timestamp}

Module: ${data.module?.name || "N/A"}
Description: ${data.module?.description || "N/A"}

7D Parameters:
- Domain: ${data.sevenDParameters.domain}
- Scale: ${data.sevenDParameters.scale}
- Urgency: ${data.sevenDParameters.urgency}
- Complexity: ${data.sevenDParameters.complexity}
- Resources: ${data.sevenDParameters.resources}
- Application: ${data.sevenDParameters.application}
- Output: ${data.sevenDParameters.output}

Generated Prompt:
${data.promptPreview}

AI Response:
${data.aiResponse}

Quality Metrics:
- Overall Score: ${data.qualityMetrics?.overallScore || "N/A"}
- Clarity: ${data.qualityMetrics?.clarity || "N/A"}
- Execution: ${data.qualityMetrics?.execution || "N/A"}
- Business Fit: ${data.qualityMetrics?.businessFit || "N/A"}
- Ambiguity: ${data.qualityMetrics?.ambiguity || "N/A"}
`
        contentType = "text/plain"
        break

      case "md":
        content = `# PromptForge Export
*Generated: ${data.timestamp}*

## Module Information
**Name:** ${data.module?.name || "N/A"}  
**Description:** ${data.module?.description || "N/A"}

## 7D Framework Parameters
| Parameter | Value |
|-----------|-------|
| Domain | ${data.sevenDParameters.domain} |
| Scale | ${data.sevenDParameters.scale} |
| Urgency | ${data.sevenDParameters.urgency} |
| Complexity | ${data.sevenDParameters.complexity} |
| Resources | ${data.sevenDParameters.resources} |
| Application | ${data.sevenDParameters.application} |
| Output | ${data.sevenDParameters.output} |

## Generated Prompt
\`\`\`
${data.promptPreview}
\`\`\`

## AI Response
${data.aiResponse}

## Quality Metrics
- **Overall Score:** ${data.qualityMetrics?.overallScore || "N/A"}
- **Clarity:** ${data.qualityMetrics?.clarity || "N/A"}
- **Execution:** ${data.qualityMetrics?.execution || "N/A"}
- **Business Fit:** ${data.qualityMetrics?.businessFit || "N/A"}
- **Ambiguity:** ${data.qualityMetrics?.ambiguity || "N/A"}
`
        contentType = "text/markdown"
        break

      default:
        throw new Error("Unsupported format")
    }

    return new NextResponse(content, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}.${format}"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
