import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config: await config })

await payload.updateGlobal({
  slug: 'footer',
  data: {
    tagline: 'Interior Execution & PMC',
    copyrightName: 'MG Arts',
    columns: [
      {
        heading: 'Company',
        items: [
          { text: 'About', link: '/about' },
          { text: 'Services', link: '/services' },
          { text: 'Rates', link: '/rates' },
          { text: 'Projects', link: '/projects' },
          { text: 'PMC', link: '/pmc' },
        ],
      },
      {
        heading: 'Connect',
        items: [
          { text: 'Contact Us', link: '/contact' },
          { text: 'Client Login', link: '/auth' },
          { text: 'Vendor Registration', link: '/vendors/register' },
        ],
      },
      {
        heading: 'Social',
        items: [
          { text: 'Instagram', link: 'https://instagram.com/mgarts.in' },
          { text: 'LinkedIn', link: 'https://linkedin.com/company/mgarts' },
          { text: 'Facebook', link: 'https://facebook.com/mgarts.in' },
          { text: 'YouTube', link: 'https://youtube.com/@mgarts' },
        ],
      },
    ],
  } as any,
})

console.log('Footer seeded.')
process.exit(0)
