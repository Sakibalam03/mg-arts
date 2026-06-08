import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrArchitect } from '@/lib/access'

export const ArchitectResources: CollectionConfig = {
  slug: 'architect-resources',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'active', 'order'],
  },
  access: {
    create: isAdmin,
    read: isAdminOrArchitect,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'BOQ Template', value: 'boq-template' },
        { label: 'Rate Sheet', value: 'rate-sheet' },
        { label: 'Guideline', value: 'guideline' },
      ],
      required: true,
    },
    { name: 'file', type: 'upload', relationTo: 'media', required: true },
    { name: 'active', type: 'checkbox', defaultValue: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
