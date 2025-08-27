import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const enterpriseContactSchema = z.object({
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().optional(),
  plan: z.string().optional(),
  source: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validatedData = enterpriseContactSchema.parse(body)
    
    // Here you would typically:
    // 1. Send email to sales team
    // 2. Store in CRM
    // 3. Create ticket in support system
    // 4. Send confirmation to user
    
    console.log('Enterprise contact form submission:', {
      company: validatedData.company,
      email: validatedData.email,
      plan: validatedData.plan,
      source: validatedData.source,
      timestamp: new Date().toISOString()
    })
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Enterprise inquiry submitted successfully',
      data: {
        company: validatedData.company,
        email: validatedData.email,
        plan: validatedData.plan,
        submittedAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Enterprise contact API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to submit enterprise inquiry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
