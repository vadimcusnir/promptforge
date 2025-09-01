import { NextRequest, NextResponse } from 'next/server';
import { catalogData, validateModuleCatalog } from '@/lib/modules';

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Validate the catalog
    const validatedCatalog = validateModuleCatalog(catalogData);
    
    // Convert the catalog to the expected format
    const modules = Object.values(validatedCatalog.modules).map(module => ({
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
      deprecated: module.deprecated || false
    }));

    return NextResponse.json({
      success: true,
      data: {
        modules,
        total: modules.length,
        version: validatedCatalog.version
      }
    });

  } catch (error) {
    console.error('Failed to fetch modules:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch modules',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
