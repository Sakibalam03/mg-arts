import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
  admin: { group: 'Pages' },
  fields: [
    { name: 'companyStory', type: 'richText', label: 'Company Story' },
    {
      name: 'teamMembers',
      type: 'array',
      label: 'Team Members',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true, label: 'Job Title' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'bio', type: 'textarea' },
      ],
    },
    {
      name: 'brandsSection',
      type: 'group',
      label: 'Authorized Brands Section',
      fields: [
        { name: 'heading', type: 'text', defaultValue: 'Our Authorized Brands' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
