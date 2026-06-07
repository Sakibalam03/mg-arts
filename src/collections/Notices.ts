import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req }) => (req.user as any)?.role === 'admin'

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
      if (user?.role === 'admin') return true
      // Public-facing active notices readable by all (for the banner)
      return { active: { equals: true } }
    },
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc }) => {
        // Stamp sentAt on first email send; prevent duplicate blasts on re-save
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
