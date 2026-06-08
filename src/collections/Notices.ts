import type { CollectionConfig } from 'payload'
import { isAdmin, hasRole } from '@/lib/access'

export const Notices: CollectionConfig = {
  slug: 'notices',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'targetRole', 'sentAt', 'createdAt'],
  },
  access: {
    create: isAdmin,
    read: ({ req }) => {
      const user = req.user as any
      if (hasRole(user, 'admin')) return true
      return { active: { equals: true } }
    },
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc }) => {
        if (data.sendEmail && !originalDoc?.sentAt) {
          data.sentAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'richText' },
    { name: 'active', type: 'checkbox', defaultValue: false, label: 'Show banner on site' },
    { name: 'sendEmail', type: 'checkbox', defaultValue: false, label: 'Send email blast on publish' },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Email sent at',
      admin: { readOnly: true, description: 'Stamped automatically on first send' },
    },
    {
      name: 'targetRole',
      type: 'select',
      options: [
        { label: 'All Users', value: 'all' },
        { label: 'Clients Only', value: 'client' },
        { label: 'Architects Only', value: 'architect' },
      ],
      defaultValue: 'all',
      required: true,
    },
  ],
}
