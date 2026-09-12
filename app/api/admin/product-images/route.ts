import { getBinding, getFileBucket } from '@/db';
import {
  adminAccess,
  AdminError,
  adminFailure,
  sameOrigin,
} from '@/server/admin-access';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const acceptedTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

function hasExpectedSignature(bytes: Uint8Array, type: string) {
  if (type === 'image/jpeg')
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (type === 'image/png')
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47 &&
      bytes[4] === 0x0d &&
      bytes[5] === 0x0a &&
      bytes[6] === 0x1a &&
      bytes[7] === 0x0a
    );
  const marker = new TextDecoder().decode(bytes);
  if (type === 'image/webp')
    return marker.startsWith('RIFF') && marker.slice(8, 12) === 'WEBP';
  return marker.slice(4, 8) === 'ftyp' && /avif|avis/.test(marker.slice(8, 16));
}

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { identity, grants } = await adminAccess();
    if (
      !grants.includes('products.create') &&
      !grants.includes('products.edit')
    )
      throw new AdminError(
        'You do not have permission to upload product images.',
        403,
      );

    const declaredLength = Number(request.headers.get('content-length') || 0);
    if (declaredLength > MAX_IMAGE_SIZE + 512 * 1024)
      throw new AdminError('Product images must be 5 MB or smaller.', 413);
    if (!request.headers.get('content-type')?.includes('multipart/form-data'))
      throw new AdminError('Upload an image file.', 415);

    const form = await request.formData();
    const image = form.get('image');
    if (!(image instanceof File))
      throw new AdminError('Choose an image to upload.', 400, 'product_image');
    if (!image.size || image.size > MAX_IMAGE_SIZE)
      throw new AdminError(
        'Product images must be between 1 byte and 5 MB.',
        413,
        'product_image',
      );
    if (!acceptedTypes.has(image.type))
      throw new AdminError(
        'Use a JPG, PNG, WebP, or AVIF image.',
        415,
        'product_image',
      );

    const contents = await image.arrayBuffer();
    if (
      !hasExpectedSignature(new Uint8Array(contents.slice(0, 16)), image.type)
    )
      throw new AdminError(
        'That file does not appear to be a valid image.',
        415,
        'product_image',
      );

    const id = crypto.randomUUID();
    await getFileBucket().put(`products/${id}`, contents, {
      httpMetadata: { contentType: image.type },
      customMetadata: { uploadedBy: identity.userId },
    });

    return Response.json(
      { url: `/api/product-images/${id}` },
      {
        status: 201,
        headers: { 'Cache-Control': 'private, no-store' },
      },
    );
  } catch (error) {
    return adminFailure(error);
  }
}

export async function DELETE(request: Request) {
  try {
    sameOrigin(request);
    const { grants } = await adminAccess();
    if (
      !grants.includes('products.create') &&
      !grants.includes('products.edit')
    )
      throw new AdminError(
        'You do not have permission to remove product images.',
        403,
      );
    if (!request.headers.get('content-type')?.includes('application/json'))
      throw new AdminError('Send image details as JSON.', 415);
    const raw = await request.text();
    if (raw.length > 300) throw new AdminError('Invalid image details.', 413);
    let url = '';
    try {
      const value = (JSON.parse(raw) as { url?: unknown }).url;
      url = typeof value === 'string' ? value : '';
    } catch {
      throw new AdminError('Invalid image details.');
    }
    const id = url.match(
      /^\/api\/product-images\/([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12})$/,
    )?.[1];
    if (!id) throw new AdminError('Invalid image details.');

    const used = await getBinding()
      .prepare('SELECT id FROM products WHERE image_key = ? LIMIT 1')
      .bind(url)
      .first();
    if (used)
      throw new AdminError('This image is currently used by a product.', 409);
    await getFileBucket().delete(`products/${id}`);
    return new Response(null, { status: 204 });
  } catch (error) {
    return adminFailure(error);
  }
}
