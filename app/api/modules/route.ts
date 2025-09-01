import { NextRequest, NextResponse } from "next/server"
import { catalogData } from "@/lib/modules"

export async function GET(request: NextRequest) {
  try {
    // Transform modules for UI consumption
    const modules = Object.values(catalogData.modules).map(module => ({
      id: module.id,
      title: module.title,
      slug: module.slug,
      summary: module.summary,
      vectors: module.vectors,
      difficulty: module.difficulty,
      minPlan: module.minPlan,
      tags: module.tags,
      outputs: module.outputs,
      version: module.version,
      deprecated: module.deprecated
    }))
    
    // Add search parameters for filtering
    const { searchParams } = new URL(request.url)
    const vector = searchParams.get('vector')
    const difficulty = searchParams.get('difficulty')
    const minPlan = searchParams.get('minPlan')
    const search = searchParams.get('search')
    
    let filteredModules = modules
    
    // Apply filters
    if (vector) {
      filteredModules = filteredModules.filter(module => 
        module.vectors.includes(vector)
      )
    }
    
    if (difficulty) {
      const difficultyNum = parseInt(difficulty)
      filteredModules = filteredModules.filter(module => 
        module.difficulty === difficultyNum
      )
    }
    
    if (minPlan) {
      const planHierarchy = { FREE: 0, CREATOR: 1, PRO: 2, ENTERPRISE: 3 }
      const userPlanLevel = planHierarchy[minPlan.toUpperCase() as keyof typeof planHierarchy] || 0
      
      filteredModules = filteredModules.filter(module => {
        const modulePlanLevel = planHierarchy[module.minPlan] || 0
        return userPlanLevel >= modulePlanLevel
      })
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredModules = filteredModules.filter(module =>
        module.title.toLowerCase().includes(searchLower) ||
        module.summary.toLowerCase().includes(searchLower) ||
        module.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        modules: filteredModules,
        total: filteredModules.length,
        catalogVersion: catalogData.version,
        filters: {
          vectors: ['strategic', 'operations', 'branding', 'content', 'analytics', 'sales', 'technical', 'crisis_management'],
          difficulties: [1, 2, 3, 4, 5],
          plans: ['FREE', 'CREATOR', 'PRO', 'ENTERPRISE']
        }
      }
    })
    
  } catch (error) {
    console.error('Module catalog error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Module catalog error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { moduleId, action, inputs } = body
    
    // Validate module exists
    // The original code used validateModuleCatalog, but catalogData is now directly imported.
    // Assuming the intent was to check if the module exists in catalogData.modules.
    const module = catalogData.modules[moduleId]
    
    if (!module) {
      return NextResponse.json({
        success: false,
        error: 'Module not found'
      }, { status: 404 })
    }
    
    // Handle different actions
    switch (action) {
      case 'simulate':
        // Return simulation data
        return NextResponse.json({
          success: true,
          data: {
            moduleId,
            action: 'simulate',
            result: {
              estimatedTokens: Math.floor(Math.random() * 2000) + 500,
              estimatedTime: Math.floor(Math.random() * 300) + 60,
              sampleOutput: `Simulated output for ${module.title}...`
            }
          }
        })
        
      case 'run':
        // TODO: Implement actual module execution
        return NextResponse.json({
          success: true,
          data: {
            moduleId,
            action: 'run',
            result: {
              runId: `run_${Date.now()}`,
              status: 'completed',
              output: `Real execution result for ${module.title}...`
            }
          }
        })
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Module execution failed:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Module execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}