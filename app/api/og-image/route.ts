import { NextRequest } from 'next/server';
import { generateOGImage } from '@/lib/og-image-generator';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const title = searchParams.get('title') || 'Blog Post';
  const author = searchParams.get('author') || undefined;
  const category = searchParams.get('category') || undefined;
  const cover = searchParams.get('cover') || undefined;

  try {
    const image = await generateOGImage({
      title,
      author,
      category,
      cover: cover ? `${process.env.NEXT_PUBLIC_BASE_URL || 'https://chatgpt-prompting.com'}${cover}` : undefined,
    });

    return new Response(image.body, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}
