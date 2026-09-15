import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const manifest = JSON.parse(
  await readFile(
    path.join(projectRoot, 'scripts', 'product-image-manifest.json'),
    'utf8',
  ),
);
const outputDirectory = path.join(projectRoot, 'public', 'products');

await mkdir(outputDirectory, { recursive: true });

async function downloadProductImage(entry) {
  let response;
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      response = await fetch(entry.imageUrl, {
        headers: {
          Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
          Referer: entry.sourcePage,
          'User-Agent':
            'Mozilla/5.0 (compatible; BLACKSHARK product-image importer)',
        },
        signal: AbortSignal.timeout(45_000),
      });
      if (response.ok) break;
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }
  if (!response?.ok) throw new Error(`${entry.slug}: ${lastError}`);

  const input = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(outputDirectory, `${entry.slug}.webp`);
  await sharp(input)
    .rotate()
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 84, effort: 5 })
    .toFile(outputPath);
  return outputPath;
}

const concurrency = 3;
let nextIndex = 0;

async function worker() {
  while (nextIndex < manifest.length) {
    const entry = manifest[nextIndex];
    nextIndex += 1;
    const outputPath = await downloadProductImage(entry);
    console.log(`${entry.slug} -> ${path.relative(projectRoot, outputPath)}`);
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
console.log(`Downloaded ${manifest.length} verified product images.`);
