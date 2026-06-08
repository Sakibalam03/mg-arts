/**
 * Seeds the Navigation global with the default menu structure from constants/menus.ts
 * Run: pnpm tsx scripts/seed-navigation.ts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config'

const items = [
  {
    label: 'Services',
    sections: [
      {
        title: 'Execution Works',
        items: [
          { title: 'Civil Works', link: '/services#civil', description: 'Structural, flooring & tiling' },
          { title: 'Electrical', link: '/services#electrical', description: 'Full wiring & fixtures' },
          { title: 'Plumbing', link: '/services#plumbing', description: 'Supply, drainage & fixtures' },
          { title: 'Carpentry', link: '/services#carpentry', description: 'Custom furniture & woodwork' },
        ],
      },
      {
        title: 'Project Types',
        items: [
          { title: 'Residential', link: '/services#residential', description: 'Apartments & villas' },
          { title: 'Commercial', link: '/services#commercial', description: 'Offices & retail spaces' },
          { title: 'Hospitality', link: '/services#hospitality', description: 'Hotels & restaurants' },
        ],
      },
    ],
  },
  {
    label: 'PMC',
    sections: [
      {
        title: 'For Architects',
        items: [
          { title: 'Project Management', link: '/pmc#project-management', description: 'End-to-end execution partner' },
          { title: 'Site Supervision', link: '/pmc#site-supervision', description: 'Daily on-site oversight' },
          { title: 'Quality Control', link: '/pmc#quality-control', description: 'Standards & compliance' },
        ],
      },
      {
        title: 'For Clients',
        items: [
          { title: 'Full Turnkey', link: '/pmc#turnkey', description: 'Complete project handover' },
          { title: 'Renovation', link: '/pmc#renovation', description: 'Partial upgrades & remodels' },
          { title: 'Consultation', link: '/pmc#consultation', description: 'Scope, planning & BOQ' },
        ],
      },
    ],
  },
  {
    label: 'Rates',
    link: '/rates',
  },
  {
    label: 'Projects',
    link: '/projects',
  },
  {
    label: 'About',
    sections: [
      {
        title: 'Company',
        items: [
          { title: 'Our Story', link: '/about#story', description: 'The MG Arts journey' },
          { title: 'Team', link: '/about#team', description: 'Our expert crew' },
          { title: 'Authorized Brands', link: '/about#brands', description: 'Our brand partners' },
        ],
      },
      {
        title: 'Connect',
        items: [
          { title: 'Contact Us', link: '/contact', description: 'Get in touch' },
          { title: 'Vendor Registration', link: '/vendors/register', description: 'Join our contractor network' },
          { title: 'Client Portal', link: '/auth', description: 'Login to your dashboard' },
        ],
      },
    ],
  },
]

const payload = await getPayload({ config: await config })

await payload.updateGlobal({
  slug: 'navigation',
  data: { items } as any,
})

console.log('Navigation global seeded successfully.')
process.exit(0)
