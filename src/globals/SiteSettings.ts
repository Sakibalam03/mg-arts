import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: { group: 'Settings' },
  fields: [
    { name: 'siteName', type: 'text', defaultValue: 'MG Arts' },
    {
      name: 'topbar',
      type: 'group',
      label: 'Topbar Banner',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Show topbar',
          defaultValue: false,
        },
        {
          name: 'text',
          type: 'text',
          label: 'Message',
          admin: { description: 'The announcement text shown in the topbar' },
        },
        {
          name: 'linkUrl',
          type: 'text',
          label: 'Link URL',
          admin: { description: 'Where the topbar message links to (e.g. /contact)' },
        },
      ],
    },
    { name: 'phone', type: 'text' },
    { name: 'email', type: 'email' },
    {
      name: 'offices',
      type: 'array',
      label: 'Office Locations',
      fields: [
        {
          name: 'city',
          type: 'select',
          options: [
            { label: 'Mumbai', value: 'mumbai' },
            { label: 'Bangalore', value: 'bangalore' },
            { label: 'Kolkata', value: 'kolkata' },
          ],
          required: true,
        },
        { name: 'address', type: 'textarea', required: true },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
  ],
}
