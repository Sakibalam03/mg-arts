import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    description: 'Manage footer link columns',
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      defaultValue: 'Interior Execution & PMC',
      admin: { description: 'Short descriptor shown below the logo' },
    },
    {
      name: 'copyrightName',
      type: 'text',
      label: 'Copyright Name',
      defaultValue: 'MG Arts',
      admin: { description: 'Name used in the © copyright line (year is added automatically)' },
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Link Columns',
      admin: {
        description: 'Each column appears as a group of links in the footer.',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Column Heading',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Links',
          minRows: 1,
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Label',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              label: 'URL',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
