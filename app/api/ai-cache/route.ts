import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuth } from '@/lib/auth/server-auth'
import { aiCache, cacheUtils } from '@/lib/ai-cache'

const cacheRequestSchema = z.object({
  action: z.enum(['stats', 'clear', 'cleanup', 'get', 'set']),
  key: z.string().optional(),
  data: z.any().optional()
})

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request)

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action') || 'stats'
    
    // Validate request
    const validation = cacheRequestSchema.safeParse({ action })
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request parameters', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { action: validAction } = validation.data

    switch (validAction) {
      case 'stats': {
        const stats = await aiCache.getStats()
        return NextResponse.json({
          success: true,
          stats: {
            ...stats,
            formatted: cacheUtils.formatStats(stats)
          }
        })
      }

      case 'cleanup': {
        await aiCache.cleanup()
        return NextResponse.json({
          success: true,
          message: 'Cache cleanup completed'
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action for GET request' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('AI Cache API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request)

    // Parse request body
    const body = await request.json()
    const validation = cacheRequestSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { action: validAction, key, data } = validation.data

    // Note: key and data are destructured but may not be used in all cases

    switch (validAction) {
      case 'clear': {
        await aiCache.clear()
        return NextResponse.json({
          success: true,
          message: 'Cache cleared successfully'
        })
      }

      case 'cleanup': {
        await aiCache.cleanup()
        return NextResponse.json({
          success: true,
          message: 'Cache cleanup completed'
        })
      }

      case 'stats': {
        const stats = await aiCache.getStats()
        return NextResponse.json({
          success: true,
          stats: {
            ...stats,
            formatted: cacheUtils.formatStats(stats)
          }
        })
      }

      case 'get': {
        if (!key) {
          return NextResponse.json(
            { success: false, error: 'Key is required for get operation' },
            { status: 400 }
          )
        }
        const value = await aiCache.get(key, 'default-model')
        return NextResponse.json({
          success: true,
          data: value
        })
      }

      case 'set': {
        if (!key) {
          return NextResponse.json(
            { success: false, error: 'Key is required for set operation' },
            { status: 400 }
          )
        }
        await aiCache.set(
          key,
          'default-model',
          0.7,
          1000,
          JSON.stringify(data),
          { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
          100
        )
        return NextResponse.json({
          success: true,
          message: 'Data cached successfully'
        })
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('AI Cache API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth(request)
    
    // Clear all cache
    await aiCache.clear()
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully'
    })

  } catch (error) {
    console.error('AI Cache API error:', error)
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
