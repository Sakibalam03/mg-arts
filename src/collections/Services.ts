import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req }) => (req.user as any)?.role === 'admin'

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
