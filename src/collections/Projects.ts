import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req }) => (req.user as any)?.role === 'admin'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'status', 'city', 'createdAt'],
  },
  access: {
    create: isAdmin,
    read: ({ req }) => {
      const user = req.user as any
      if (!user) return false
      if (user.role === 'admin') return true
      const or: any[] = [{ client: { equals: user.id } }, { architect: { equals: user.id } }]
      return { or }
    },
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'client',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'architect',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Inquiry', value: 'inquiry' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'inquiry',
      required: true,
    },
    { name: 'city', type: 'text', required: true },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
    },
    {
      name: 'notes',
      type: 'richText',
      admin: {
        condition: (_, __, { user }) => (user as any)?.role === 'admin',
      },
    },
  ],
}
