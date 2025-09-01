import { NextRequest, NextResponse } from 'next/server';
import { getModules, validateCatalog } from '@/lib/modules';

export async function GET(request: NextRequest) {
  try {
    // Validate catalog integrity
    const validation = validateCatalog();
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: 'Catalog validation failed', 
          details: validation.errors 
        },
        { status: 500 }
      );
    }

    // Get modules
    const modules = await getModules();
    
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const vectors = searchParams.get('vectors')?.split(',') || [];
    const difficulty = searchParams.get('difficulty') || '';
    const plan = searchParams.get('plan') || '';

    // Apply filters
    let filteredModules = modules;
    
    if (query) {
      filteredModules = filteredModules.filter(module =>
        module.title.toLowerCase().includes(query.toLowerCase()) ||
        module.summary.toLowerCase().includes(query.toLowerCase()) ||
        module.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (vectors.length > 0) {
      filteredModules = filteredModules.filter(module =>
        vectors.some(vector => module.vectors.includes(vector as any))
      );
    }

    if (difficulty) {
      filteredModules = filteredModules.filter(module =>
        module.difficulty === difficulty
      );
    }

    if (plan) {
      filteredModules = filteredModules.filter(module =>
        module.minPlan === plan
      );
    }

    // Return response with metadata
    return NextResponse.json({
      success: true,
      data: {
        modules: filteredModules,
        total: filteredModules.length,
        total_available: modules.length,
        filters: {
          query,
          vectors,
          difficulty,
          plan
        }
      },
      meta: {
        catalog_version: '1.0.0',
        last_updated: new Date().toISOString(),
        validation_status: 'passed'
      }
    });

  } catch (error) {
    console.error('Modules API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Failed to retrieve modules'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
