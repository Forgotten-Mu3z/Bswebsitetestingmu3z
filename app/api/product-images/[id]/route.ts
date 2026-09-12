import { getFileBucket } from '@/db';

export const dynamic = 'force-dynamic';

const imageId =
  /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;

async function serve(params: Promise<{ id: string }>, includeBody: boolean) {
  const { id } = await params;
  if (!imageId.test(id)) return new Response('Not found', { status: 404 });

  const object = await getFileBucket().get(`products/${id}`);
  if (!object) return new Response('Not found', { status: 404 });

  const headers = new Headers({
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Content-Type':
      object.httpMetadata?.contentType ?? 'application/octet-stream',
    'X-Content-Type-Options': 'nosniff',
  });
  headers.set('ETag', object.httpEtag);
  headers.set('Content-Length', String(object.size));
  return new Response(includeBody ? object.body : null, { headers });
}

export function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return serve(params, true);
}

export function HEAD(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return serve(params, false);
}
