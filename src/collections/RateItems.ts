import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/access'


export const RateItems: CollectionConfig = {
  slug: 'rate-items',
  admin: {
    useAsTitle: 'serviceLabel',
    defaultColumns: ['serviceLabel', 'category', 'unit', 'mgArtsRate', 'marketRate', 'order'],
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Civil', value: 'civil' },
        { label: 'Electrical', value: 'electrical' },
        { label: 'Plumbing', value: 'plumbing' },
        { label: 'Carpentry', value: 'carpentry' },
      ],
      required: true,
      index: true,
    },
    { name: 'serviceLabel', type: 'text', required: true },
    { name: 'unit', type: 'text', required: true, label: 'Unit (sqft, running ft, point, etc.)' },
    { name: 'mgArtsRate', type: 'number', required: true, min: 0 },
    { name: 'marketRate', type: 'number', required: true, min: 0 },
    { name: 'withMaterial', type: 'checkbox', defaultValue: false, label: 'Rate includes material' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
}
