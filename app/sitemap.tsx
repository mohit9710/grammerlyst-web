import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://grammrlyst.com',
      lastModified: new Date(),
    },
    {
      url: 'https://grammrlyst.com/blog',
      lastModified: new Date(),
    },
    {
      url: 'https://grammrlyst.com/contact',
      lastModified: new Date(),
    },
  ]
}