import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/lib/access'


export const VendorFieldSchema: CollectionConfig = {
  slug: 'vendor-field-schema',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'fieldKey', 'fieldType', 'required', 'active', 'order'],
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'fieldKey',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'JSON key used in vendors.extraFields' },
    },
    {
      name: 'fieldType',
      type: 'select',
      options: [
        { label: 'Text', value: 'text' },
        { label: 'Number', value: 'number' },
        { label: 'Select', value: 'select' },
        { label: 'File', value: 'file' },
      ],
      required: true,
    },
    {
      name: 'options',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.fieldType === 'select',
        description: 'Options for select type fields',
      },
      fields: [{ name: 'value', type: 'text', required: true }],
    },
    { name: 'required', type: 'checkbox', defaultValue: false },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'active', type: 'checkbox', defaultValue: true, label: 'Show on registration form' },
  ],
}
