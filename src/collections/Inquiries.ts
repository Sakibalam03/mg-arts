import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req }) => (req.user as any)?.role === 'admin'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'source', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Contact Page', value: 'contact' },
        { label: 'Landing Page', value: 'landing' },
        { label: 'Rates Page', value: 'rates' },
        { label: 'PMC Page', value: 'pmc' },
      ],
      defaultValue: 'contact',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Converted', value: 'converted' },
      ],
      defaultValue: 'new',
      required: true,
    },
  ],
}
