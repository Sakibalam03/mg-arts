import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/access'


export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'withMaterial', 'active', 'order'],
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'richText' },
    { name: 'icon', type: 'upload', relationTo: 'media' },
    { name: 'withMaterial', type: 'checkbox', defaultValue: false, label: 'Rate includes material' },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
