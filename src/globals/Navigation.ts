import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    description: 'Manage top navigation links and dropdown menus',
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Nav Items',
      minRows: 1,
      admin: {
        description: 'Top-level links. Items with dropdown sections ignore the URL field.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'URL',
          admin: {
            description: 'Direct link URL. Leave blank when using dropdown sections.',
          },
        },
        {
          name: 'sections',
          type: 'array',
          label: 'Dropdown Sections',
          admin: {
            description: 'Add sections to create a dropdown menu for this item.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Section Heading',
              admin: {
                description: 'Optional label shown above this group of links',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'Links',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Description',
                  admin: {
                    description: 'Short subtitle displayed below the link title',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
