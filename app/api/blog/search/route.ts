import { NextRequest, NextResponse } from 'next/server';
import { searchBlogPosts, getSearchSuggestions } from '@/lib/blog-search';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const query = searchParams.get('q') || '';
  const categories = searchParams.get('categories')?.split(',') || undefined;
  const tags = searchParams.get('tags')?.split(',') || undefined;
  const author = searchParams.get('author') || undefined;
  const limit = parseInt(searchParams.get('limit') || '10');
  const offset = parseInt(searchParams.get('offset') || '0');
  const suggestions = searchParams.get('suggestions') === 'true';

  try {
    if (suggestions) {
      const suggestionsList = getSearchSuggestions(query, 5);
      return NextResponse.json({ suggestions: suggestionsList });
    }

    const results = searchBlogPosts({
      query,
      categories,
      tags,
      author,
      limit,
      offset,
    });

    return NextResponse.json({
      results,
      total: results.length,
      query,
      pagination: {
        limit,
        offset,
        hasMore: results.length === limit,
      },
    });
  } catch (error) {
    console.error('Blog search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
