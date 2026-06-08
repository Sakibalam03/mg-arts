import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/access'


const slugify = (str: string) =>
  str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'city', 'year', 'createdAt'],
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && data.title && !data.slug) {
          data.slug = slugify(data.title as string)
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { description: 'Auto-generated from title on create. Edit to override.' },
    },
    { name: 'city', type: 'text', required: true, index: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Hospitality', value: 'hospitality' },
      ],
      required: true,
      index: true,
    },
    { name: 'year', type: 'number', required: true },
    {
      name: 'photos',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },
    {
      name: 'brands',
      type: 'relationship',
      relationTo: 'brands',
      hasMany: true,
    },
    { name: 'description', type: 'richText' },
    { name: 'collaborator', type: 'text', label: 'Collaborating Architect / Firm' },
    { name: 'metaTitle', type: 'text' },
    { name: 'metaDesc', type: 'textarea', label: 'Meta Description' },
  ],
}
