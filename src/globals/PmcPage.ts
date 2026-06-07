import type { GlobalConfig } from 'payload'

export const PmcPage: GlobalConfig = {
  slug: 'pmc-page',
  label: 'PMC Page',
  admin: { group: 'Pages' },
  fields: [
    { name: 'intro', type: 'richText', label: 'Introduction' },
    {
      name: 'services',
      type: 'array',
      label: 'PMC Services',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'pastCollaborations',
      type: 'array',
      label: 'Past Architect Collaborations',
      fields: [
        { name: 'architectFirm', type: 'text', required: true, label: 'Architect / Firm Name' },
        { name: 'projectName', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'year', type: 'number', required: true },
      ],
    },
  ],
}
