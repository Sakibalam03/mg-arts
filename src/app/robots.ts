import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/auth/', '/cms/'],
      },
    ],
    sitemap: 'https://mgarts.co.in/sitemap.xml',
  }
}
