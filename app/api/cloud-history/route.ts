// PROMPTFORGE™ v3 - Cloud History API
// Istoricul prompturilor cu RLS și retention policies

import { NextRequest, NextResponse } from 'next/server';
import { cloudHistory, type HistoryFilters } from '@/lib/cloud-history';
import { validateSACFHeaders, assertMembership, handleSecurityError } from '@/lib/security/assert';

// GET - Obține istoricul cu filtrare și paginare
export async function GET(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const url = new URL(req.url);

    // Extract user from auth - în development folosim header
    const userId = req.headers.get('x-user-id') || 'dev-user';

    // Parse query parameters
    const action = url.searchParams.get('action');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const includeFullContent = url.searchParams.get('includeFullContent') === 'true';

    // Parse filters
    const filters: HistoryFilters = {};
    if (url.searchParams.get('domain')) filters.domain = url.searchParams.get('domain') as string;
    if (url.searchParams.get('module_id')) filters.module_id = url.searchParams.get('module_id')!;
    if (url.searchParams.get('preset_id')) filters.preset_id = url.searchParams.get('preset_id')!;
    if (url.searchParams.get('date_from')) filters.date_from = url.searchParams.get('date_from')!;
    if (url.searchParams.get('date_to')) filters.date_to = url.searchParams.get('date_to')!;
    if (url.searchParams.get('min_score'))
      filters.min_score = parseFloat(url.searchParams.get('min_score')!);
    if (url.searchParams.get('only_favorites'))
      filters.only_favorites = url.searchParams.get('only_favorites') === 'true';
    if (url.searchParams.get('shared_only'))
      filters.shared_only = url.searchParams.get('shared_only') === 'true';
    if (url.searchParams.get('user_id')) filters.user_id = url.searchParams.get('user_id')!;
    if (url.searchParams.get('tags')) filters.tags = url.searchParams.get('tags')!.split(',');

    // Verifică membership
    await assertMembership(orgId, userId);

    if (action === 'stats') {
      // Request pentru statistici
      const stats = await cloudHistory.getHistoryStats(orgId, userId);

      return NextResponse.json({
        orgId,
        userId,
        stats,
        retention_info: {
          note: 'Entries are automatically deleted based on your plan retention policy',
          upgrade_hint:
            stats.retention_summary.expiring_soon > 0
              ? 'Upgrade to Pro or Enterprise for longer retention'
              : null,
        },
      });
    } else {
      // Request pentru istoric
      const historyData = await cloudHistory.getHistory({
        orgId,
        userId,
        filters,
        page,
        limit,
        includeFullContent,
      });

      return NextResponse.json({
        ...historyData,
        filters,
        content_access: {
          full_content_available: includeFullContent,
          upgrade_hint: !includeFullContent
            ? 'Upgrade to Pro for full prompt and response storage'
            : null,
        },
      });
    }
  } catch (error) {
    console.error('Cloud History API error:', error);
    return handleSecurityError(error);
  }
}

// POST - Salvează în istoric sau acțiuni pe entries existente
export async function POST(req: NextRequest) {
  try {
    const { orgId } = await validateSACFHeaders();
    const body = await req.json();
    const userId = req.headers.get('x-user-id') || 'dev-user';

    // Verifică membership
    await assertMembership(orgId, userId);

    const { action, ...params } = body;

    switch (action) {
      case 'save':
        // Salvează un nou entry în istoric
        const {
          moduleId,
          presetId,
          domain,
          sevenDConfig,
          promptText,
          modelResponse,
          score,
          usage,
          tags,
          shareWithOrg,
        } = params;

        if (!domain || !sevenDConfig || !promptText || !usage) {
          return NextResponse.json(
            {
              error: 'MISSING_PARAMETERS',
              message: 'domain, sevenDConfig, promptText, and usage are required',
            },
            { status: 400 }
          );
        }

        const historyId = await cloudHistory.saveToHistory({
          orgId,
          userId,
          moduleId,
          presetId,
          domain,
          sevenDConfig,
          promptText,
          modelResponse,
          score,
          usage,
          tags,
          shareWithOrg,
        });

        return NextResponse.json({
          success: true,
          historyId,
          message: 'Entry saved to cloud history',
        });

      case 'toggle_favorite':
        // Marchează/demarchează ca favorit
        const { historyId: favoriteHistoryId } = params;

        if (!favoriteHistoryId) {
          return NextResponse.json(
            { error: 'MISSING_PARAMETERS', message: 'historyId is required' },
            { status: 400 }
          );
        }

        const newFavoriteStatus = await cloudHistory.toggleFavorite(favoriteHistoryId, userId);

        return NextResponse.json({
          success: true,
          historyId: favoriteHistoryId,
          is_favorite: newFavoriteStatus,
          message: newFavoriteStatus ? 'Added to favorites' : 'Removed from favorites',
        });

      case 'delete':
        // Șterge entry din istoric
        const { historyId: deleteHistoryId } = params;

        if (!deleteHistoryId) {
          return NextResponse.json(
            { error: 'MISSING_PARAMETERS', message: 'historyId is required' },
            { status: 400 }
          );
        }

        await cloudHistory.deleteHistoryEntry(deleteHistoryId, userId);

        return NextResponse.json({
          success: true,
          historyId: deleteHistoryId,
          message: 'Entry deleted from history',
        });

      default:
        return NextResponse.json(
          { error: 'INVALID_ACTION', message: 'Supported actions: save, toggle_favorite, delete' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Cloud History POST error:', error);
    return handleSecurityError(error);
  }
}
