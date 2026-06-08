import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req }) => (req.user as any)?.role === 'admin'

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'project', 'uploadedBy', 'visibleTo', 'createdAt'],
  },
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => {
      const user = req.user as any
      if (!user) return false
      if (user.role === 'admin') return true
      const visibleToValue = user.role === 'architect' ? 'architect' : 'client'
      const or: any[] = [
        { visibleTo: { in: [visibleToValue, 'all'] } },
        { uploadedBy: { equals: user.id } },
      ]
      return { or }
    },
    update: ({ req }) => {
      const user = req.user as any
      if (!user) return false
      if (user.role === 'admin') return true
      return { uploadedBy: { equals: user.id } }
    },
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.uploadedBy = req.user.id
          if (!data.visibleTo) {
            const role = (req.user as any).role
            if (role === 'architect') data.visibleTo = 'architect'
            else if (role === 'client') data.visibleTo = 'client'
            else data.visibleTo = 'admin'
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { readOnly: true },
    },
    { name: 'fileUrl', type: 'text', required: true, label: 'S3 Key / File URL' },
    { name: 'fileName', type: 'text', label: 'Original Filename' },
    { name: 'fileType', type: 'text', label: 'MIME Type' },
    {
      name: 'label',
      type: 'select',
      options: [
        { label: 'Requirement', value: 'requirement' },
        { label: 'Quote', value: 'quote' },
        { label: 'BOQ', value: 'boq' },
        { label: 'Drawing', value: 'drawing' },
        { label: 'Other', value: 'other' },
      ],
      defaultValue: 'other',
      required: true,
    },
    {
      name: 'visibleTo',
      type: 'select',
      options: [
        { label: 'Client', value: 'client' },
        { label: 'Architect', value: 'architect' },
        { label: 'Admin', value: 'admin' },
        { label: 'All', value: 'all' },
      ],
      defaultValue: 'all',
      required: true,
    },
  ],
}
