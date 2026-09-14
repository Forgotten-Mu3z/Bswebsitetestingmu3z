import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/cart'] },
    ],
    sitemap:
      'https://blackshark-gaming-oman.xxgunone11.chatgpt.site/sitemap.xml',
  };
}
