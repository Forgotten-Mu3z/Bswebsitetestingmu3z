import { getSearchSuggestions } from '@/server/catalog';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q') ?? '';
  const products = await getSearchSuggestions(query);
  return Response.json(
    { products },
    { headers: { 'Cache-Control': 'private, max-age=30' } },
  );
}
