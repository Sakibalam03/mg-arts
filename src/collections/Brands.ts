import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req }) => (req.user as any)?.role === 'admin'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'visible', 'order'],
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'authLetter', type: 'upload', relationTo: 'media', label: 'Authorization Letter' },
    { name: 'visible', type: 'checkbox', defaultValue: true, label: 'Show on site' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
