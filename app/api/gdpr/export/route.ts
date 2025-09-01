import { NextRequest, NextResponse } from 'next/server'
import { gdprCompliance } from '@/lib/compliance/gdpr'
import { z } from 'zod'

// Data export request validation schema
const DataExportSchema = z.object({
  userId: z.string().uuid(),
  format: z.enum(['json', 'csv']).default('json')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request schema
    const validation = DataExportSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors
        },
        { status: 400 }
      )
    }

    const { userId, format } = validation.data

    // Process data export
    const exportData = await gdprCompliance.processDataExport(userId)

    // Format response based on requested format
    if (format === 'csv') {
      // Convert to CSV format
      const csvData = convertToCSV(exportData)
      
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="user-data-export-${userId}.csv"`,
          'Cache-Control': 'no-cache'
        }
      })
    } else {
      // Return JSON format
      return NextResponse.json(exportData, {
        headers: {
          'Content-Disposition': `attachment; filename="user-data-export-${userId}.json"`,
          'Cache-Control': 'no-cache'
        }
      })
    }

  } catch (error) {
    console.error('Data export failed:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to export user data'
      },
      { status: 500 }
    )
  }
}

// Helper function to convert data to CSV format
function convertToCSV(data: any): string {
  const csvRows: string[] = []
  
  // Personal data section
  csvRows.push('Section,Field,Value')
  csvRows.push('Personal Data,ID,' + data.personal_data.id)
  csvRows.push('Personal Data,Email,' + data.personal_data.email)
  csvRows.push('Personal Data,Full Name,' + (data.personal_data.full_name || ''))
  csvRows.push('Personal Data,Created At,' + data.personal_data.created_at)
  csvRows.push('Personal Data,Updated At,' + data.personal_data.updated_at)
  csvRows.push('Personal Data,Plan,' + data.personal_data.plan)
  
  // Prompt runs section
  csvRows.push('')
  csvRows.push('Prompt Runs,ID,Module ID,Created At,Status,AI Score')
  for (const run of data.prompt_runs) {
    csvRows.push(`Prompt Runs,${run.id},${run.module_id},${run.created_at},${run.status},${run.ai_score || ''}`)
  }
  
  // Exports section
  csvRows.push('')
  csvRows.push('Exports,ID,Format,Created At,Download Count')
  for (const export_ of data.exports) {
    csvRows.push(`Exports,${export_.id},${export_.format},${export_.created_at},${export_.download_count}`)
  }
  
  // Consent history section
  csvRows.push('')
  csvRows.push('Consent History,Type,Granted,Timestamp,Expires At')
  for (const consent of data.consent_history) {
    csvRows.push(`Consent History,${consent.consent_type},${consent.granted},${consent.timestamp},${consent.expires_at || ''}`)
  }
  
  // Audit logs section
  csvRows.push('')
  csvRows.push('Audit Logs,Action,Timestamp,Details')
  for (const log of data.audit_logs) {
    csvRows.push(`Audit Logs,${log.action},${log.timestamp},"${JSON.stringify(log.details).replace(/"/g, '""')}"`)
  }
  
  return csvRows.join('\n')
}
