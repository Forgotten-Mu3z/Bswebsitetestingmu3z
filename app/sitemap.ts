import type { MetadataRoute } from 'next';
import { getSitemapEntries } from '@/server/catalog';

const siteUrl = 'https://blackshark-gaming-oman.xxgunone11.chatgpt.site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();
  return [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/search`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/deals`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/build`, changeFrequency: 'weekly', priority: 0.8 },
    ...entries.categories.map((category) => ({
      url: `${siteUrl}/categories/${category.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...entries.products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
