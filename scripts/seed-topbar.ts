import { getPayload } from 'payload'
import config from '../src/payload.config'

const payload = await getPayload({ config: await config })

await payload.updateGlobal({
  slug: 'site-settings',
  data: {
    topbar: {
      enabled: true,
      text: 'Free site visit & consultation for projects above ₹5 lakhs - Book now and get a detailed quote within 48 hours.',
      linkUrl: '/contact',
    },
  } as any,
})

console.log('Topbar seeded.')
process.exit(0)
